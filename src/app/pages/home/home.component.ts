import { Component, OnInit } from '@angular/core';
import { Artwork } from '../../models/artwork.model';
import { Artist } from '../../models/artist.model';
import { ArtworkService } from '../../services/artwork.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CATEGORIES } from '../../data/commission-options.data';

/**
 * The landing page.
 * Hero, call to action buttons, featured artwork, category links and the
 * artists preview.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  /** The four featured artworks shown in the grid. */
  featuredArtworks: Artwork[] = [];

  /** The artists shown in the "meet the artists" strip. */
  artists: Artist[] = [];

  /** The four shop categories. */
  readonly categories = CATEGORIES;

  /** Small piece of copy shown under each category tile. */
  readonly categoryBlurbs: { [key: string]: string } = {
    Portraits: 'Faces with a story behind them.',
    Anime: 'Sharp lines, endless motion.',
    Illustrations: 'Whole scenes, fully realised.',
    'Fan Art': 'The worlds you already love.'
  };

  /** Simple platform statistics used in the trust strip. */
  readonly stats = [
    { value: '1,200+', label: 'Commissions delivered' },
    { value: '480+', label: 'Original artworks for sale' },
    { value: '4.9', label: 'Average artist rating' },
    { value: '72h', label: 'Average first reply' }
  ];

  /** The three step explanation of how commissioning works. */
  readonly steps = [
    {
      number: '01',
      title: 'Describe your idea',
      text: 'Fill in the commission form with your character, style and deadline. The price estimate updates as you choose.'
    },
    {
      number: '02',
      title: 'The artist sketches',
      text: 'Your chosen artist sends a rough sketch first so the direction is right before the detail work begins.'
    },
    {
      number: '03',
      title: 'Receive your artwork',
      text: 'Approved pieces are delivered as a high resolution file, ready to print, use or display.'
    }
  ];

  constructor(
    private artworkService: ArtworkService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  /** Load the featured artworks and a few artists for the page. */
  ngOnInit(): void {
    this.featuredArtworks = this.artworkService.getFeaturedArtworks(4);

    this.artworkService.getArtists().subscribe((artists) => {
      this.artists = artists.slice(0, 3);
    });
  }

  /** Add a featured artwork to the cart from the home page. */
  onAddToCart(artwork: Artwork): void {
    this.cartService.addToCart(artwork);
    this.toastService.show(artwork.title + ' added to your cart.');
  }
}
