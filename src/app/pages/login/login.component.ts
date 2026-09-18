import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

/**
 * The Login / Register page.
 *
 * One component with two modes. The modeSwitch buttons simply change which
 * form is shown - both forms are reactive forms with real validation.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /** 'login' or 'register'. */
  mode: 'login' | 'register' = 'login';

  /** The sign in form. */
  loginForm: FormGroup;

  /** The account creation form. */
  registerForm: FormGroup;

  /** An error message shown above the active form. */
  errorMessage = '';

  /** A success message shown after registering. */
  successMessage = '';

  /** The account types offered at registration. */
  readonly roles = [
    { value: 'collector', label: 'Collector' },
    { value: 'artist', label: 'Artist' },
    { value: 'both', label: 'Both' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['collector', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordsMatch });
  }

  /** Show the sign in form. */
  showLogin(): void {
    this.mode = 'login';
    this.errorMessage = '';
    this.successMessage = '';
  }

  /** Show the registration form. */
  showRegister(): void {
    this.mode = 'register';
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Cross-field validator: the two password fields must match.
   * Returns null when they do, or an error object when they do not.
   */
  private passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (password && confirm && password !== confirm) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  }

  /** Helper used by the template to test a control's error state. */
  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && control.touched;
  }

  /** Sign in with the entered credentials. */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    const result = this.authService.login(email, password);

    if (result.success) {
      this.errorMessage = '';
      this.toastService.show(result.message);
      this.router.navigate(['/']);
    } else {
      this.errorMessage = result.message;
    }
  }

  /** Create an account. */
  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, role } = this.registerForm.value;
    const result = this.authService.register(name, email, password, role);

    if (result.success) {
      this.errorMessage = '';
      this.toastService.show(result.message);
      this.router.navigate(['/']);
    } else {
      this.errorMessage = result.message;
    }
  }
}
