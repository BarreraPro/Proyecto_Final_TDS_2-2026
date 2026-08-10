import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'acceso',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shell/shell.page').then((m) => m.ShellPage),
  },
  {
    path: '',
    redirectTo: 'acceso',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'acceso' },
];
