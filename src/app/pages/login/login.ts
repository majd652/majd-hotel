import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Input } from '../../shared/components/input/input';
import { Button } from '../../shared/components/button/button';
import { APP_NAME } from '../../shared/utils/app-constants';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Input, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly appName = APP_NAME;
  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get emailError(): string {
    const c = this.form.controls.email;
    if (!c.touched || c.valid) return '';
    if (c.hasError('required')) return 'Email is required.';
    if (c.hasError('email')) return 'Enter a valid email address.';
    return '';
  }

  get passwordError(): string {
    const c = this.form.controls.password;
    if (!c.touched || c.valid) return '';
    if (c.hasError('required')) return 'Password is required.';
    if (c.hasError('minlength')) return 'Password must be at least 6 characters.';
    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message || 'Login failed.');
      },
    });
  }
}
