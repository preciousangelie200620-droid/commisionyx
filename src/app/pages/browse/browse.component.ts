import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Artwork } from '../../models/artwork.model';
import { ArtworkService } from '../../services/artwork.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ART_STYLES, CATEGORIES } from '../../data/commission-options.data';

/**
 * The Browse Art page.
 *
 * Holds the whole catalogue and narrows it down with a text search plus four
 * filters and a sort order. Every filter runs through one method, applyFilters(),
 * so the logic is easy to follow.
 */
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  /** The full catalogue, loaded once. */
  allArtworks: Artwork[] = [];

  /** The artworks left after filtering and sorting - what the page renders. */
  visibleArtworks: Artwork[] = [];

  /** Filter values, all bound to the controls in the template. */
  searchTerm = '';
  selectedCategory = 'All';
  selectedStyle = 'All';
  priceLimit = 0;
  minimumRating = 0;
  sortBy = 'featured';

  /** The highest price in the catalogue, used as the slider maximum. */
  maxPrice = 0;

  /** Dropdown choices. "All" is added to the front of each list. */
  readonly categories = ['All', ...CATEGORIES];
  readonly styles = ['All', ...ART_STYLES];
  readonly ratings = [
    { value: 0, label: 'Any rating' },
    { value: 4.5, label: '4.5 stars and up' },
    { value: 4.8, label: '4.8 stars and up' },
    { value: 5, label: '5 stars only' }
  ];

  /** Sort orders offered to the user. */
  readonly sortOptions = [
    { value: 'featured', label: 'Featured first' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'rating', label: 'Highest rated' },
    { value: 'newest', label: 'Newest first' },
    { value: 'title', label: 'Title: A to Z' }
  ];

  /** Whether any filter is currently doing something, for the "clear" button. */
  get hasActiveFilters(): boolean {
    return (
      this.searchTerm.trim() !== '' ||
      this.selectedCategory !== 'All' ||
      this.selectedStyle !== 'All' ||
      this.minimumRating !== 0 ||
      this.priceLimit < this.maxPrice
    );
  }

  constructor(
    private artworkService: ArtworkService,
    private cartService: CartService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  /** Load the catalogue, read any category in the URL, then run the filters. */
  ngOnInit(): void {
    this.maxPrice = this.artworkService.getMaxPrice();
    this.priceLimit = this.maxPrice;

    this.artworkService.getArtworks().subscribe((artworks) => {
      this.allArtworks = artworks;

      // Links such as "Portraits" in the footer arrive as ?category=Portraits
      const categoryFromUrl = this.route.snapshot.queryParamMap.get('category');
      if (categoryFromUrl && this.categories.includes(categoryFromUrl)) {
        this.selectedCategory = categoryFromUrl;
      }

      this.applyFilters();
    });
  }

  /**
   * Apply the search box, every filter and the chosen sort order.
   * Called whenever the user changes something on the page.
   */
  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    let results = this.allArtworks.filter((artwork) => {
      // 1. Text search across title, artist, style and tags.
      const matchesSearch =
        term === '' ||
        artwork.title.toLowerCase().includes(term) ||
        artwork.artistName.toLowerCase().includes(term) ||
        artwork.style.toLowerCase().includes(term) ||
        artwork.tags.some((tag) => tag.toLowerCase().includes(term));

      // 2. Category
      const matchesCategory =
        this.selectedCategory === 'All' || artwork.category === this.selectedCategory;

      // 3. Style
      const matchesStyle =
        this.selectedStyle === 'All' || artwork.style === this.selectedStyle;

      // 4. Price ceiling
      const matchesPrice = artwork.price <= this.priceLimit;

      // 5. Minimum rating
      const matchesRating = artwork.rating >= this.minimumRating;

      return matchesSearch && matchesCategory && matchesStyle && matchesPrice && matchesRating;
    });

    results = this.sortArtworks(results);
    this.visibleArtworks = results;
  }

  /** Put the filtered list into the order the user asked for. */
  private sortArtworks(artworks: Artwork[]): Artwork[] {
    const sorted = [...artworks];

    switch (this.sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        // Featured pieces float to the top, then everything else stays put.
        return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }

  /** Reset every filter back to its starting value. */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.selectedStyle = 'All';
    this.minimumRating = 0;
    this.priceLimit = this.maxPrice;
    this.sortBy = 'featured';
    this.applyFilters();
  }

  /** Select a category with a single click from the chip row. */
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  /** Add an artwork to the cart from the grid. */
  onAddToCart(artwork: Artwork): void {
    this.cartService.addToCart(artwork);
    this.toastService.show(artwork.title + ' added to your cart.');
  }
}
