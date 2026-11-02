import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  quickSelectAccount(type: 'admin' | 'smak'): void {
    if (type === 'admin') {
      this.username = 'admin';
      this.password = '123qwe...';
    } else {
      this.username = 'SMAK-Admin';
      this.password = 'Admin123';
    }
    this.errorMessage = '';
  }

  onSubmit(): void {
    const u = this.username.trim();
    const p = this.password.trim();

    if (!u || !p) {
      this.errorMessage = 'Por favor ingrese usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: u, password: p }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = typeof err === 'string' ? err : 'Credenciales inválidas. Verifique usuario y contraseña.';
      }
    });
  }
}
