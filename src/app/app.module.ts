import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ArtworkCardComponent } from './components/artwork-card/artwork-card.component';
import { ToastComponent } from './components/toast/toast.component';

// Pages
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
 * The application module.
 * Every component is declared here and the router decides which page to show.
 */
@NgModule({
  declarations: [
    AppComponent,

    // Shared components
    NavbarComponent,
    FooterComponent,
    ArtworkCardComponent,
    ToastComponent,

    // Pages
    HomeComponent,
    BrowseComponent,
    CommissionsComponent,
    ArtistsComponent,
    ArtworkDetailsComponent,
    CartComponent,
    CheckoutComponent,
    AboutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
