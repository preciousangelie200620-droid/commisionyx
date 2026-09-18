import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';

/**
 * The sticky top navigation bar.
 * Shows a live cart badge and the signed-in user's name.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  /** Kept open/closed state for the mobile menu. */
  menuOpen = false;

  /** Live number of items in the cart. */
  itemCount$: Observable<number>;

  /** The signed-in user, or null. */
  currentUser$: Observable<User | null>;

  constructor(private cartService: CartService, private authService: AuthService) {
    this.itemCount$ = this.cartService.itemCount$;
    this.currentUser$ = this.authService.currentUser$;
  }

  /** Open or close the mobile navigation menu. */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /** Close the mobile menu after a link is followed. */
  closeMenu(): void {
    this.menuOpen = false;
  }

  /** Sign the current user out. */
  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}
