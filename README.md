# CommisioNyx

**An art commission marketplace built with Angular.**

CommisioNyx is a school project: a complete, runnable e-commerce style web
application where visitors can browse original artwork, commission custom
pieces from artists, and check out with a working cart.

The design is dark and gothic — black, deep crimson, white and soft grey —
so it reads like an art marketplace rather than a generic online store.

---

## Quick start

You need **Node.js 18.19+ or 20.11+** and npm.

```bash
# 1. install the dependencies
npm install

# 2. start the development server
ng serve

# 3. open the app
#    http://localhost:4200
```

If you do not have the Angular CLI installed globally, use `npx` instead:

```bash
npm install
npx ng serve
```

Then open **http://localhost:4200** in your browser.

To have the browser open automatically:

```bash
ng serve --open
```

### Building for production

```bash
ng build
```

The compiled output is written to `dist/commisionyx/browser/`.

---

## Opening the project in VS Code

1. Unzip the folder.
2. In VS Code choose **File → Open Folder…** and select the `commisionyx` folder
   (the one containing `package.json`).
3. Open a terminal in VS Code (**Terminal → New Terminal**) and run:

   ```bash
   npm install
   ng serve
   ```

Recommended extension: **Angular Language Service** — it gives you autocomplete
and inline template checking in the HTML files.

---

## Tech stack

| Piece | What is used |
|---|---|
| Framework | Angular 18 (module-based, `AppModule` + `AppRoutingModule`) |
| Language | TypeScript |
| Templates | Angular HTML templates with `*ngIf`, `*ngFor`, `[(ngModel)]` |
| Forms | Template-driven (`FormsModule`) and reactive (`ReactiveFormsModule`) |
| Styling | Plain CSS with custom properties (no CSS framework) |
| Data | In-memory mock data, no backend needed |
| Persistence | `localStorage` for the cart and the mock login |

There is **no backend and no database**. Everything runs in the browser, which
is why the project starts with a single command.

---

## Project structure

```
commisionyx/
├── angular.json                     Angular CLI configuration
├── package.json                     Dependencies and npm scripts
├── tsconfig.json                    TypeScript configuration
├── README.md                        This file
└── src/
    ├── index.html                   The single HTML page Angular bootstraps into
    ├── main.ts                      Application entry point
    ├── styles.css                   Global theme: colours, buttons, forms, grids
    │
    ├── assets/img/
    │   ├── art/                     Artwork images (art_01 … art_12)
    │   ├── artists/                 Artist avatars (artist_01 … artist_06)
    │   ├── hero.png                 Home page hero background
    │   └── about_studio.png         About page image
    │
    └── app/
        ├── app.module.ts            Declares every component
        ├── app-routing.module.ts    All routes
        ├── app.component.ts/.html   The shell: navbar + router-outlet + footer
        │
        ├── models/                  TypeScript interfaces (the data shapes)
        │   ├── artwork.model.ts
        │   ├── artist.model.ts
        │   ├── cart-item.model.ts
        │   └── commission.model.ts
        │
        ├── data/                    Mock data
        │   ├── artworks.data.ts     The 12 artworks
        │   ├── artists.data.ts      The 6 artists
        │   └── commission-options.data.ts   Commission choices and prices
        │
        ├── services/                Shared logic
        │   ├── artwork.service.ts       Serves the catalogue and artists
        │   ├── cart.service.ts          Cart + localStorage persistence
        │   ├── commission.service.ts    The commission price calculator
        │   ├── auth.service.ts          Mock login and registration
        │   └── toast.service.ts         Small confirmation popups
        │
        ├── components/              Reusable components
        │   ├── navbar/              Sticky navigation with a live cart badge
        │   ├── footer/              Site footer
        │   ├── artwork-card/        The product card used in every grid
        │   └── toast/               The shared confirmation popup
        │
        └── pages/                   One folder per route
            ├── home/                Home
            ├── browse/              Browse Art (search, filters, sorting)
            ├── commissions/         Commissions (live price estimator)
            ├── artists/             Artists
            ├── artwork-details/     Artwork Details
            ├── cart/                Cart
            ├── checkout/            Checkout
            ├── about/               About
            └── login/               Login / Register
```

Each page folder holds three files:

- `*.component.ts` — the logic
- `*.component.html` — the template
- `*.component.css` — the styles (scoped to that component only)

---

## Pages and routes

| Route | Page | What it does |
|---|---|---|
| `/` | Home | Hero, call-to-action buttons, featured artwork, categories, how it works |
| `/browse` | Browse Art | Full catalogue with search, filters and sorting |
| `/commissions` | Commissions | Commission form with a live price estimate |
| `/artists` | Artists | Artist cards with bio, specialties and stats |
| `/artwork/:id` | Artwork Details | One artwork, quantity picker and related pieces |
| `/cart` | Cart | Quantity controls, remove items, subtotal and total |
| `/checkout` | Checkout | Customer details, payment method, simulated order confirmation |
| `/about` | About | The story, values, team and an FAQ |
| `/login` | Login / Register | Sign in or create an account |
| `**` | — | Any unknown URL redirects to Home |

---

## Features

### Browsing and filtering
- Text search across title, artist, style and tags
- Filter by category, art style, maximum price and minimum rating
- Six sort orders: featured, price low→high, price high→low, rating, newest, A→Z
- Quick category chips and a one-click **Clear Filters** button
- Live result count, and a friendly empty state when nothing matches

### Cart
- Add any artwork from a card, the details page or the home page
- Increase, decrease or type a quantity; remove single items or empty the cart
- Service fee (5%) and estimated tax (8%) calculated in real time
- **Saved to `localStorage`**, so the cart survives a page refresh
- A live item-count badge in the navbar on every page

### Commissions
The commission form collects every option a real brief would need:

- Art type (portrait, half body, full body, full illustration)
- Artist
- Character count (1–6)
- Art style (sketch, lined, cel shaded, painterly, oil)
- Background (none, simple, detailed, epic)
- Usage rights (personal or commercial)
- Deadline (flexible, standard, priority, rush) and a target date
- Written instructions
- An optional reference image

**The estimated price updates live as you change any option**, and the side
panel explains the maths:

```
estimate = (basePrice x styleMultiplier
            + extraCharacters x 60
            + backgroundFee)
           x artistRateMultiplier
           + commercialLicenceFee
           + deadlineFee
```

Submitting shows a confirmation panel with a reference number and a summary of
everything the artist will receive.

### Checkout
- Validated customer information (name, email, phone, address, city, postcode, country)
- Three payment methods, with card fields appearing and becoming required only
  when the card option is selected
- Card number, expiry (`MM/YY`) and CVC format validation
- Order summary listing every line item
- A **simulated** confirmation with an order number and total — the cart is then
  emptied. No payment is ever processed.

### Accounts
Mock registration and login stored in `localStorage`. This exists so the
Login/Register page behaves realistically; there is no server involved. The two
password fields must match, and the terms checkbox is required.

### Responsive design
Every page adapts to tablet and mobile. The navbar collapses into a hamburger
menu, grids drop to a single column, and sticky panels unstick on small screens.

---

## How the interesting parts work

### Cart persistence
`CartService` keeps the cart in a `BehaviorSubject` and mirrors every change
into `localStorage` under the key `commisionyx_cart`. Components subscribe to
`items$`, so any change updates the cart page and the navbar badge at once.

```ts
localStorage.setItem('commisionyx_cart', JSON.stringify(items));
```

On startup the service reads that key back, so a refresh does not lose anything.

### The live price estimate
`CommissionService.calculatePrice()` takes the current form values and returns a
breakdown object (base, style adjustment, character fee, background fee, artist
adjustment, commercial fee, deadline fee, total). The Commissions page calls it
inside `form.valueChanges.subscribe(...)`, which is what makes the price update
the instant you click a different option.

### Reusable components
`ArtworkCardComponent` is used by the Home, Browse Art and Artwork Details pages.
It takes the artwork as an `@Input()` and announces the add-to-cart with an
`@Output()`, so the same card works everywhere without being rewritten.

### Reactive forms and validation
The Commissions, Checkout and Login pages use `FormBuilder` with `Validators`.
Invalid fields are highlighted and each shows a clear message. The Register form
also uses a **cross-field validator** to confirm both passwords match.

---

## Things to try

1. **Browse Art** → search `vampire`, or set the price slider to `$300`.
2. **Browse Art** → click *Add to Cart* twice, then refresh the page — the cart
   is still there.
3. **Commissions** → change the art type to *Full Illustration*, set 4 characters
   and choose *Rush*; watch the estimate climb and the breakdown explain why.
4. **Commissions** → submit without writing a brief; validation blocks you.
5. **Checkout** → submit the empty form to see validation, then fill it in with
   any card numbers (e.g. `4242 4242 4242 4242`) and place the order.
6. **Login** → create an account and watch the navbar greet you by name.

---

## Notes

- All artwork, artist names, reviews and orders are **sample data**.
- No payment is processed and no data leaves the browser.
- The login system stores passwords in `localStorage` purely for demonstration —
  never do this in a real application.
- Artwork images live in `src/assets/img/` and are referenced as
  `assets/img/art/art_01.png`.
