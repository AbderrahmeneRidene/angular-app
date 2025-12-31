import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);
  
  const accounts = msalService.instance.getAllAccounts();
  
  if (accounts.length > 0) {
    return true;
  }
  
  // Redirect to login
  router.navigate(['/login']);
  return false;
};