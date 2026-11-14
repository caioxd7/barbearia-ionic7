import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;

  if (!auth.isLogged()) return router.createUrlTree(['/login']);
  const status = await auth.adminAccessStatus();
  return status === 'admin'
    ? true
    : router.createUrlTree(['/dashboard-access'], { queryParams: { reason: status } });
};