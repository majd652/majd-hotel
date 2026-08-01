import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload, User } from '../../models/user.model';

const TOKEN_KEY = 'majd_hotel_token';
const USER_KEY = 'majd_hotel_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _currentUser = signal<Omit<User, 'password'> | null>(this.readStoredUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`, {
      params: { email: payload.email },
    }).pipe(
      map((users) => {
        const found = users[0];
        if (!found || found.password !== payload.password) {
          throw new Error('Invalid email or password');
        }
        const { password, ...safeUser } = found;
        const token = btoa(`${safeUser.email}:${Date.now()}`);
        return { token, user: safeUser } as AuthResponse;
      }),
      tap((res) => this.persistSession(res)),
      catchError((err) => throwError(() => (err instanceof Error ? err : new Error('Login failed.')))),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._currentUser.set(res.user);
  }

  private readStoredUser(): Omit<User, 'password'> | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
}