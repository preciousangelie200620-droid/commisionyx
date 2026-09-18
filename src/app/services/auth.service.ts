import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** A user account stored in localStorage for this demo. */
export interface User {
  name: string;
  email: string;
  role: string;
}

/** Internal record - in a real app the password would never be kept client side. */
interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'commisionyx_users';
const SESSION_KEY = 'commisionyx_session';

/**
 * Very small mock authentication service.
 *
 * Accounts and the current session live in localStorage. There is no server,
 * so this exists purely to make the Login/Register page behave like the real
 * thing for a school project.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readSession());

  /** The signed-in user, or null when nobody is logged in. */
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  /** Create an account and sign the user straight in. */
  register(name: string, email: string, password: string, role: string): { success: boolean; message: string } {
    const users = this.readUsers();
    const normalisedEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email === normalisedEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = { name: name.trim(), email: normalisedEmail, password, role };
    users.push(newUser);
    this.writeUsers(users);
    this.startSession(newUser);

    return { success: true, message: 'Welcome to CommisioNyx, ' + newUser.name + '.' };
  }

  /** Sign in with an existing account. */
  login(email: string, password: string): { success: boolean; message: string } {
    const normalisedEmail = email.trim().toLowerCase();
    const user = this.readUsers().find((entry) => entry.email === normalisedEmail);

    if (!user) {
      return { success: false, message: 'No account found with this email.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'That password is not correct.' };
    }

    this.startSession(user);
    return { success: true, message: 'Welcome back, ' + user.name + '.' };
  }

  /** Sign the current user out. */
  logout(): void {
    this.currentUserSubject.next(null);
    this.safeRemove(SESSION_KEY);
  }

  /** Whether somebody is signed in right now. */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /** Save the session and tell every subscriber about the new user. */
  private startSession(user: StoredUser): void {
    const session: User = { name: user.name, email: user.email, role: user.role };
    this.currentUserSubject.next(session);

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage problems - the session still works in memory.
    }
  }

  /** Read the signed-in user from localStorage. */
  private readSession(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      return null;
    }
  }

  /** Read every registered account. */
  private readUsers(): StoredUser[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const saved = localStorage.getItem(USERS_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Save every registered account. */
  private writeUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      // Ignore storage problems.
    }
  }

  /** Remove a localStorage key without throwing. */
  private safeRemove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage problems.
    }
  }
}
