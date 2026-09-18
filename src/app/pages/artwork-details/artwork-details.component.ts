import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artwork } from '../../models/artwork.model';
import { Artist } from '../../models/artist.model';
import { ArtworkService } from '../../services/artwork.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

/**
 * The detail page for a single artwork.
 *
 * The id comes from the URL (/artwork/:id), so this one component can display
 * every artwork in the catalogue.
 */
@Component({
  selector: 'app-artwork-details',
  templateUrl: './artwork-details.component.html',
  styleUrl: './artwork-details.component.css'
})
export class ArtworkDetailsComponent implements OnInit {
  /** The artwork being viewed, or undefined while loading / when missing. */
  artwork?: Artwork;

  /** The artist who made it. */
  artist?: Artist;

  /** Other pieces by the same artist, shown at the bottom. */
  relatedArtworks: Artwork[] = [];

  /** Quantity chosen with the plus / minus buttons. */
  quantity = 1;

  /** The five star positions used to draw the rating. */
  readonly starPositions = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artworkService: ArtworkService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  /** Read the id from the URL and load everything that page needs. */
  ngOnInit(): void {
    // snapshot is enough here because the component is recreated per id.
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.artworkService.getArtworkById(id);

    if (!found) {
      // Unknown id: send the visitor back to the catalogue.
      this.router.navigate(['/browse']);
      return;
    }

    this.artwork = found;
    this.artist = this.artworkService.getArtistById(found.artistId);

    this.relatedArtworks = this.artworkService
      .getArtworksByArtist(found.artistId)
      .filter((item) => item.id !== found.id)
      .slice(0, 3);
  }

  /** Increase the quantity, up to a sensible maximum of 10. */
  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  /** Decrease the quantity, never below one. */
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /** Add the chosen quantity of this artwork to the cart. */
  addToCart(): void {
    if (!this.artwork) {
      return;
    }

    this.cartService.addToCart(this.artwork, this.quantity);
    this.toastService.show(
      this.quantity + ' x ' + this.artwork.title + ' added to your cart.'
    );
  }

  /** Add a related artwork straight to the cart from the bottom grid. */
  onAddRelated(artwork: Artwork): void {
    this.cartService.addToCart(artwork);
    this.toastService.show(artwork.title + ' added to your cart.');
  }
}
