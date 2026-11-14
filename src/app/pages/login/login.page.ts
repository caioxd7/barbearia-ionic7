import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cut } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

addIcons({ cut });

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, IonIcon],
  templateUrl: 'login.page.html'
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;
  private auth = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    await this.auth.ready;
    if (!this.auth.isLogged()) return;

    const status = await this.auth.adminAccessStatus();
    await this.router.navigateByUrl(status === 'admin' ? '/dashboard' : '/home');
  }

  async login(form: NgForm) {
    this.error = '';
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.error = 'Informe um e-mail válido e sua senha.';
      return;
    }

    this.loading = true;
    try {
      await this.auth.login(this.email.trim(), this.password);
      const status = await this.auth.adminAccessStatus();
      await this.router.navigateByUrl(status === 'admin' ? '/dashboard' : '/home');
    } catch (error) {
      const code = this.errorCode(error);
      if (code === 'auth/network-request-failed') {
        this.error = 'Não foi possível conectar ao Firebase. Verifique sua internet.';
      } else if (code === 'auth/too-many-requests') {
        this.error = 'Muitas tentativas. Aguarde um pouco e tente novamente.';
      } else if (code === 'auth/invalid-email') {
        this.error = 'Informe um endereço de e-mail válido.';
      } else {
        this.error = 'E-mail ou senha inválidos.';
      }
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    return this.router.navigateByUrl('/register');
  }

  private errorCode(error: unknown): string {
    return typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';
  }
}