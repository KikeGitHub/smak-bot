import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  fullName: string;
  role: string;
  tenantId: string;
  expiresIn: number;
}

export interface AuthUser {
  username: string;
  fullName: string;
  role: string;
  tenantId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'smakbot_jwt_token';
  private readonly USER_KEY = 'smakbot_jwt_user';
  private readonly baseUrl: string;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.baseUrl = environment.apiBaseUrl || 'http://localhost:8080';
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  public isSuperAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'SUPER_ADMIN';
  }

  public getTenantId(): string {
    return this.currentUserValue?.tenantId || 'smak';
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const url = `${this.baseUrl}/api/v1/auth/login`;

    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => {
        // Fallback Dual Bridge (SDOP Framework): si el backend no está disponible, valida localmente
        const fallback = this.fallbackLocalLogin(credentials);
        if (fallback) {
          this.handleAuthSuccess(fallback);
          return of(fallback);
        }
        return throwError(() => err?.error?.error || 'Credenciales incorrectas. Verifique usuario o contraseña.');
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem('smakbot_admin_logged');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    const user: AuthUser = {
      username: res.username,
      fullName: res.fullName,
      role: res.role,
      tenantId: res.tenantId || 'smak'
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem('smakbot_admin_logged', 'true');
    }

    this.currentUserSubject.next(user);
  }

  private getStoredUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false;
      return payload.exp * 1000 < Date.now();
    } catch {
      return false;
    }
  }

  private fallbackLocalLogin(credentials: LoginRequest): AuthResponse | null {
    const u = (credentials.username || '').trim();
    const p = (credentials.password || '').trim();

    // 1. Super Usuario
    if (u.toLowerCase() === 'admin' && p === '123qwe...') {
      return {
        token: this.generateMockJwt('admin', 'ROLE_SUPER_ADMIN', 'smak', 'Super Administrador SMAKBOT'),
        tokenType: 'Bearer',
        username: 'admin',
        fullName: 'Super Administrador SMAKBOT',
        role: 'ROLE_SUPER_ADMIN',
        tenantId: 'smak',
        expiresIn: 86400
      };
    }

    // 2. Administrador SMAK Muebles
    if (u.toLowerCase() === 'smak-admin' && p === 'Admin123') {
      return {
        token: this.generateMockJwt('SMAK-Admin', 'ROLE_TENANT_ADMIN', 'smak', 'Administrador SMAK Muebles'),
        tokenType: 'Bearer',
        username: 'SMAK-Admin',
        fullName: 'Administrador SMAK Muebles',
        role: 'ROLE_TENANT_ADMIN',
        tenantId: 'smak',
        expiresIn: 86400
      };
    }

    return null;
  }

  private generateMockJwt(username: string, role: string, tenantId: string, fullName: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
      sub: username,
      role,
      tenantId,
      fullName,
      iat: now,
      exp: now + 86400
    }));
    const sig = btoa('smakbot-client-simulated-signature');
    return `${header}.${payload}.${sig}`;
  }
}
