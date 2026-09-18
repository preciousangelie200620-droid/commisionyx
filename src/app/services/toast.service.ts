import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** How long a toast stays on screen, in milliseconds. */
const TOAST_DURATION = 2600;

/**
 * A tiny notification service.
 *
 * Any component can call show() and the single <app-toast> element in the app
 * shell will display the message. This avoids every page having to build its
 * own confirmation popup.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageSubject = new BehaviorSubject<string>('');

  /** The message to display - an empty string means "nothing to show". */
  readonly message$: Observable<string> = this.messageSubject.asObservable();

  /** Timer handle so a new toast replaces the previous one cleanly. */
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  /** Show a message, automatically hiding it after a short delay. */
  show(message: string): void {
    this.messageSubject.next(message);

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this.hideTimer = setTimeout(() => this.messageSubject.next(''), TOAST_DURATION);
  }
}
