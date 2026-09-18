import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { ArtworkDetailsComponent } from './pages/artwork-details/artwork-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';

/**
 * Every page in the application.
 *
 * Note the ':id' segment on the artwork route: it lets one component show any
 * artwork, and the component reads the id with ActivatedRoute.
 */
const routes: Routes = [
  { path: '', component: HomeComponent, title: 'CommisioNyx | Turn Your Imagination Into Art' },
  { path: 'browse', component: BrowseComponent, title: 'CommisioNyx | Browse Art' },
  { path: 'commissions', component: CommissionsComponent, title: 'CommisioNyx | Request a Commission' },
  { path: 'artists', component: ArtistsComponent, title: 'CommisioNyx | Our Artists' },
  { path: 'artwork/:id', component: ArtworkDetailsComponent, title: 'CommisioNyx | Artwork Details' },
  { path: 'cart', component: CartComponent, title: 'CommisioNyx | Your Cart' },
  { path: 'checkout', component: CheckoutComponent, title: 'CommisioNyx | Checkout' },
  { path: 'about', component: AboutComponent, title: 'CommisioNyx | About' },
  { path: 'login', component: LoginComponent, title: 'CommisioNyx | Sign In' },

  // Anything else falls back to the home page.
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
