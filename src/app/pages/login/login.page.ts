import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { DEMO_PASSWORD } from '../../core/demo-data';
import { StorageService } from '../../core/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  message = '';
  busy = false;
  registration = { firstName: '', lastName: '', email: '', phone: '', password: '', accepted: false };
  readonly demoPassword = DEMO_PASSWORD;
  readonly accounts = [
    { role: 'Ciudadano', email: 'ciudadano@demo.local', icon: 'person-outline', note: 'Crear y dar seguimiento' },
    { role: 'Personal municipal', email: 'municipal@demo.local', icon: 'business-outline', note: 'Gestionar solicitudes del ayuntamiento' },
    { role: 'Administrador', email: 'admin@demo.local', icon: 'shield-checkmark-outline', note: 'Configurar y auditar' },
  ];

  chooseAccount(email: string): void {
    this.email = email;
    this.password = DEMO_PASSWORD;
    this.message = '';
  }

  login(): void {
    this.message = '';
    if (!/^\S+@\S+\.\S+$/.test(this.email)) { this.message = 'Ingrese un correo electrónico válido.'; return; }
    if (!this.password) { this.message = 'Ingrese la contraseña de demostración.'; return; }
    this.busy = true;
    const result = this.auth.authenticate(this.email, this.password);
    this.busy = false;
    if (!result.ok) this.message = result.message ?? 'No fue posible iniciar sesión.';
  }

  register(): void {
    this.message = '';
    const data = this.registration;
    if (!data.firstName.trim() || !data.lastName.trim()) { this.message = 'Complete nombres y apellidos.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) { this.message = 'Ingrese un correo electrónico válido.'; return; }
    if (this.storage.db().users.some((item) => item.email.toLowerCase() === data.email.trim().toLowerCase())) { this.message = 'El correo ya está registrado en los datos demo.'; return; }
    if (data.password !== DEMO_PASSWORD) { this.message = `En este prototipo utilice la contraseña común ${DEMO_PASSWORD}.`; return; }
    if (!data.accepted) { this.message = 'Debe aceptar el uso ficticio de los datos del prototipo.'; return; }
    const user = this.storage.registerCitizen({ firstName: data.firstName.trim(), lastName: data.lastName.trim(), email: data.email.trim(), phone: data.phone.trim() });
    this.storage.login(user);
    void this.router.navigateByUrl('/app');
  }
}
