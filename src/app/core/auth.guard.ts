import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from './storage.service';

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  return storage.currentUser() ? true : router.createUrlTree(['/acceso']);
};

export const guestGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  return storage.currentUser() ? router.createUrlTree(['/app']) : true;
};
