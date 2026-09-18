import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Artwork } from '../models/artwork.model';
import { CartItem, OrderTotals } from '../models/cart-item.model';
import { SERVICE_FEE_RATE, TAX_RATE } from '../data/commission-options.data';

/** The localStorage key the cart is saved under. */
const STORAGE_KEY = 'commisionyx_cart';

/**
 * Holds the shopping cart and keeps it in sync with localStorage, so the
 * cart survives a page refresh.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  /** The single source of truth for the cart contents. */
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readFromStorage());

  /** Components subscribe to this to render the cart. */
  readonly items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  /** Total number of individual items, used for the navbar badge. */
  readonly itemCount$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  /** The current cart contents, read synchronously. */
  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  /**
   * Add an artwork to the cart. If it is already there, the quantity goes up
   * instead of creating a duplicate line.
   */
  addToCart(artwork: Artwork, quantity: number = 1): void {
    const items = [...this.items];
    const existing = items.find((item) => item.artwork.id === artwork.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ artwork, quantity });
    }

    this.update(items);
  }

  /** Remove one line from the cart entirely. */
  removeFromCart(artworkId: number): void {
    this.update(this.items.filter((item) => item.artwork.id !== artworkId));
  }

  /** Set the quantity of one line. Quantities below 1 are clamped to 1. */
  updateQuantity(artworkId: number, quantity: number): void {
    const items = this.items.map((item) => {
      if (item.artwork.id !== artworkId) {
        return item;
      }
      return { ...item, quantity: Math.max(1, Math.min(99, quantity)) };
    });

    this.update(items);
  }

  /** Increase one line by one. */
  increaseQuantity(artworkId: number): void {
    const item = this.items.find((line) => line.artwork.id === artworkId);
    if (item) {
      this.updateQuantity(artworkId, item.quantity + 1);
    }
  }

  /** Decrease one line by one. */
  decreaseQuantity(artworkId: number): void {
    const item = this.items.find((line) => line.artwork.id === artworkId);
    if (item) {
      this.updateQuantity(artworkId, item.quantity - 1);
    }
  }

  /** Empty the cart, for example after a successful order. */
  clearCart(): void {
    this.update([]);
  }

  /** How many items are in the cart right now. */
  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Calculate subtotal, service fee, tax and total for the current cart.
   * Returns zeroes when the cart is empty so the templates never show NaN.
   */
  getTotals(): OrderTotals {
    const subtotal = this.calculateSubtotal();
    const commissionFee = subtotal * SERVICE_FEE_RATE;
    const tax = (subtotal + commissionFee) * TAX_RATE;

    return {
      subtotal: this.round(subtotal),
      commissionFee: this.round(commissionFee),
      tax: this.round(tax),
      total: this.round(subtotal + commissionFee + tax)
    };
  }

  /** Sum of every line (price multiplied by quantity). */
  calculateSubtotal(): number {
    return this.round(
      this.items.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0)
    );
  }

  /** Round to two decimals so money never shows floating point noise. */
  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /** Push new items to every subscriber and persist them. */
  private update(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.writeToStorage(items);
  }

  /** Read the saved cart. Falls back to an empty cart if anything is wrong. */
  private readFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Corrupted data should never break the app - start fresh instead.
      return [];
    }
  }

  /** Save the cart so it is still there after a refresh. */
  private writeToStorage(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be full or blocked; the in-memory cart still works.
    }
  }
}
