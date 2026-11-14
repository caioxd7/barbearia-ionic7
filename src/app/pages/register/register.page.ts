import { Component, inject } from '@angular/core';
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
	templateUrl: 'register.page.html'
})
export class RegisterPage {
	name = '';
	email = '';
	password = '';
	error = '';
	loading = false;
	private auth = inject(AuthService);
	private router = inject(Router);

	async register(form: NgForm) {
		this.error = '';
		if (form.invalid) {
			form.control.markAllAsTouched();
			this.error = 'Informe seu nome, um e-mail válido e uma senha com pelo menos 6 caracteres.';
			return;
		}

		this.loading = true;
		try {
			await this.auth.register(this.name.trim(), this.email.trim(), this.password);
			await this.router.navigateByUrl('/home');
		} catch (error) {
			const code = this.errorCode(error);
			if (code === 'auth/email-already-in-use') {
				this.error = 'Já existe uma conta com este e-mail.';
			} else if (code === 'auth/weak-password') {
				this.error = 'A senha precisa ter pelo menos 6 caracteres.';
			} else if (code === 'auth/invalid-email') {
				this.error = 'Informe um endereço de e-mail válido.';
			} else if (code === 'auth/network-request-failed') {
				this.error = 'Não foi possível conectar ao Firebase. Verifique sua internet.';
			} else if (code === 'permission-denied') {
				this.error = 'A conta foi criada, mas o Firestore recusou a gravação do perfil. Verifique as regras do banco.';
			} else {
				this.error = 'Não foi possível criar a conta. Confira os dados e tente novamente.';
			}
		} finally {
			this.loading = false;
		}
	}

	private errorCode(error: unknown): string {
		return typeof error === 'object' && error !== null && 'code' in error
			? String(error.code)
			: '';
	}
}