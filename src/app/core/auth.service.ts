import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DEMO_PASSWORD } from './demo-data';
import { StorageService } from './storage.service';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  get currentUser(): User | null { return this.storage.currentUser(); }

  authenticate(email: string, password: string): { ok: boolean; message?: string } {
    const normalized = email.trim().toLowerCase();
    const user = this.storage.db().users.find((item) => item.email.toLowerCase() === normalized);
    if (!user || password !== DEMO_PASSWORD) return { ok: false, message: 'Correo o contraseña de demostración incorrectos.' };
    if (user.status !== 'activo') return { ok: false, message: 'La cuenta de demostración no está activa.' };
    this.storage.login(user);
    void this.router.navigateByUrl('/app');
    return { ok: true };
  }

  logout(): void {
    this.storage.logout();
    void this.router.navigateByUrl('/acceso');
  }
}
