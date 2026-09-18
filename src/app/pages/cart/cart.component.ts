import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem, OrderTotals } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

/**
 * The shopping cart page.
 *
 * Reads the live cart from CartService, so any change here is saved to
 * localStorage automatically and the navbar badge updates immediately.
 */
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  /** The live cart contents. */
  items$: Observable<CartItem[]>;

  /** Current money breakdown. */
  totals: OrderTotals = { subtotal: 0, commissionFee: 0, tax: 0, total: 0 };

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.items$ = this.cartService.items$;
  }

  /**
   * Keep the totals in sync with the cart.
   * Subscribing to items$ means the totals follow every quantity change.
   */
  ngOnInit(): void {
    this.items$.subscribe(() => {
      this.totals = this.cartService.getTotals();
    });
  }

  /** Add one to a line. */
  increase(item: CartItem): void {
    this.cartService.increaseQuantity(item.artwork.id);
  }

  /** Take one off a line. */
  decrease(item: CartItem): void {
    this.cartService.decreaseQuantity(item.artwork.id);
  }

  /** Set a line's quantity straight from the number input. */
  onQuantityChange(item: CartItem, value: string): void {
    const quantity = Number(value);

    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(item.artwork.id, quantity);
    }
  }

  /** Remove a line and tell the user. */
  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.artwork.id);
    this.toastService.show(item.artwork.title + ' removed from your cart.');
  }

  /** Empty the whole cart. */
  clearCart(): void {
    this.cartService.clearCart();
    this.toastService.show('Your cart is now empty.');
  }

  /** Move on to the checkout page. */
  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
