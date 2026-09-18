import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';

/**
 * The single confirmation popup used across the whole app.
 * It listens to ToastService and slides in whenever a message is published.
 */
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  /** The current message, or an empty string when hidden. */
  message$: Observable<string>;

  constructor(private toastService: ToastService) {
    this.message$ = this.toastService.message$;
  }
}
