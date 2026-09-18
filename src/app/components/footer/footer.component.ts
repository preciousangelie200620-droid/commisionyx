import { Component } from '@angular/core';

/**
 * Site footer, shown on every page below the routed content.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  /** The current year, so the copyright line never goes stale. */
  readonly year = new Date().getFullYear();

  /** Categories listed in the footer's shop column. */
  readonly categories = ['Portraits', 'Anime', 'Illustrations', 'Fan Art'];

  /** Static link lists for the other footer columns. */
  readonly platformLinks = [
    { label: 'Browse Art', path: '/browse' },
    { label: 'Request a Commission', path: '/commissions' },
    { label: 'Our Artists', path: '/artists' },
    { label: 'About Us', path: '/about' }
  ];

  readonly accountLinks = [
    { label: 'Sign In / Register', path: '/login' },
    { label: 'Your Cart', path: '/cart' },
    { label: 'Checkout', path: '/checkout' }
  ];
}
