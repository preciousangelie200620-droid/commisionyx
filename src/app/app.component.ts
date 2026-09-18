import { Component } from '@angular/core';

/**
 * The root component.
 * It only holds the shell (navbar, routed page, footer) - all real work is
 * done by the page components.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CommisioNyx';
}
