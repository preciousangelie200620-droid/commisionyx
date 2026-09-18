import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, OrderTotals } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

/**
 * The checkout page.
 *
 * Collects customer details and a payment method, shows the order summary, and
 * then displays a simulated confirmation. No payment is really processed -
 * submitting the form simply empties the cart and shows a receipt.
 */
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  /** The checkout form. */
  checkoutForm!: FormGroup;

  /** The cart contents at the moment of checkout. */
  items: CartItem[] = [];

  /** Money breakdown. */
  totals: OrderTotals = { subtotal: 0, commissionFee: 0, tax: 0, total: 0 };

  /** True once the order has been placed. */
  orderPlaced = false;

  /** The generated order number shown on the receipt. */
  orderNumber = '';

  /** The date the order was placed, for the receipt. */
  orderDate = '';

  /** A frozen copy of the purchased items, so the receipt survives an empty cart. */
  purchasedItems: CartItem[] = [];

  /** The total that was actually paid. */
  purchasedTotal = 0;

  /** The payment methods offered. */
  readonly paymentMethods = [
    { id: 'card', label: 'Credit or Debit Card', description: 'Visa, Mastercard, American Express.' },
    { id: 'paypal', label: 'PayPal', description: 'Redirects to PayPal in a real store.' },
    { id: 'bank', label: 'Bank Transfer', description: 'Artwork is released once funds clear.' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  /** Build the form and take a snapshot of the cart. */
  ngOnInit(): void {
    this.items = this.cartService.items;
    this.totals = this.cartService.getTotals();

    this.checkoutForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9 +()-]{7,20}$')]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 -]{3,10}$')]],
      country: ['', Validators.required],
      paymentMethod: ['card', Validators.required],
      cardNumber: ['', [Validators.pattern('^[0-9 ]{12,23}$')]],
      cardName: [''],
      cardExpiry: ['', [Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$')]],
      cardCvc: ['', [Validators.pattern('^[0-9]{3,4}$')]],
      notes: ['']
    });

    // Card fields are only required while the card method is selected.
    this.updateCardValidation();

    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(() => {
      this.updateCardValidation();
    });
  }

  /** Whether the selected payment method is the card option. */
  get isCardPayment(): boolean {
    return this.checkoutForm.get('paymentMethod')?.value === 'card';
  }

  /**
   * Add required validators to the card fields when paying by card, and remove
   * them otherwise so the form stays valid for PayPal or bank transfer.
   */
  private updateCardValidation(): void {
    const cardFields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvc'];

    cardFields.forEach((field) => {
      const control = this.checkoutForm.get(field);
      if (!control) {
        return;
      }

      if (this.isCardPayment) {
        control.addValidators(Validators.required);
      } else {
        control.removeValidators(Validators.required);
        control.setValue('');
      }

      control.updateValueAndValidity();
    });
  }

  /** Helper used by the template to test a control's error state. */
  isInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  /**
   * Place the order.
   * Everything here is simulated: no request leaves the browser.
   */
  onPlaceOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toastService.show('Please check the highlighted fields.');
      return;
    }

    if (this.items.length === 0) {
      this.toastService.show('Your cart is empty.');
      return;
    }

    // Freeze the order details for the receipt before clearing the cart.
    this.purchasedItems = this.items.map((item) => ({ ...item }));
    this.purchasedTotal = this.totals.total;
    this.orderNumber = 'CNX-' + Math.floor(100000 + Math.random() * 899999);
    this.orderDate = new Date().toLocaleString();

    this.cartService.clearCart();
    this.orderPlaced = true;
    this.toastService.show('Order placed. Thank you.');

    // Bring the receipt into view.
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }
}
