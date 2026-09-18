import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Artwork } from '../../models/artwork.model';

/**
 * A reusable product card for one artwork.
 *
 * Used on the Home page, the Browse Art page and anywhere else a grid of
 * artworks is shown, so the card only ever needs to be written once.
 */
@Component({
  selector: 'app-artwork-card',
  templateUrl: './artwork-card.component.html',
  styleUrl: './artwork-card.component.css'
})
export class ArtworkCardComponent {
  /** The artwork this card displays. */
  @Input() artwork!: Artwork;

  /** Tells the parent page that the customer wants to add this to the cart. */
  @Output() addToCart = new EventEmitter<Artwork>();

  /** The five positions used to draw the star rating. */
  readonly starPositions = [1, 2, 3, 4, 5];

  /** Emit the add to cart event up to the page. */
  onAddToCart(event: Event): void {
    // Stop the click from also triggering the card's own link.
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.artwork);
  }
}
