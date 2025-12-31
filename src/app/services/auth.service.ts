import { Injectable, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject, Observable, from, tap, catchError, of } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalService = inject(MsalService);
  
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$: Observable<UserProfile | null> = this.userProfileSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  
  private isMsalInitialized = false;
  
  constructor() {
    console.log('🔄 AuthService constructor called');
    this.checkMSALInitialization();
  }
  
  private checkMSALInitialization(): void {
    console.log('🔍 Checking MSAL initialization...');
    
    // Check if MSAL is initialized by looking at accounts
    try {
      const accounts = this.msalService.instance.getAllAccounts();
      console.log('📋 Found accounts:', accounts.length);
      
      if (accounts.length > 0) {
        console.log('✅ User already logged in:', accounts[0].username);
        this.msalService.instance.setActiveAccount(accounts[0]);
        this.updateUserProfile(accounts[0]);
        this.isAuthenticatedSubject.next(true);
        this.isMsalInitialized = true;
      } else {
        console.log('🔒 No user logged in');
        this.isMsalInitialized = true;
      }
    } catch (error) {
      console.warn('⚠️ MSAL not initialized yet:', error);
      // MSAL might not be initialized yet, we'll retry when needed
    }
  }
  
  private updateUserProfile(account: any): void {
    console.log('👤 Updating user profile:', account);
    const profile: UserProfile = {
      name: account.name || 'User',
      email: account.username || '',
      username: account.username || '',
      roles: account.idTokenClaims?.roles || []
    };
    this.userProfileSubject.next(profile);
  }
  
  private ensureMSALInitialized(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isMsalInitialized) {
        resolve(true);
        return;
      }
      
      console.log('🔄 Ensuring MSAL is initialized...');
      
      // Try to initialize if not already done
      this.msalService.instance.initialize().then(() => {
        console.log('✅ MSAL initialized successfully');
        this.isMsalInitialized = true;
        this.checkMSALInitialization();
        resolve(true);
      }).catch(error => {
        console.error('❌ MSAL initialization failed:', error);
        resolve(false);
      });
    });
  }
  
  login(): void {
    console.log('🚀 Starting login process...');
    this.isLoadingSubject.next(true);
    
    this.ensureMSALInitialized().then(isInitialized => {
      if (!isInitialized) {
        console.error('❌ Cannot login: MSAL not initialized');
        this.isLoadingSubject.next(false);
        return;
      }
      
      console.log('✅ MSAL initialized, proceeding with login');
      
      this.msalService.loginPopup({
        scopes: ['user.read'],
        prompt: 'select_account'
      }).subscribe({
        next: (response) => {
          console.log('✅ Login successful', response);
          const accounts = this.msalService.instance.getAllAccounts();
          console.log('📋 Accounts after login:', accounts);
          
          if (accounts.length > 0) {
            this.msalService.instance.setActiveAccount(accounts[0]);
            this.updateUserProfile(accounts[0]);
            this.isAuthenticatedSubject.next(true);
          }
          this.isLoadingSubject.next(false);
        },
        error: (error) => {
          console.error('❌ Login failed:', error);
          this.isLoadingSubject.next(false);
        },
        complete: () => {
          console.log('🏁 Login process complete');
        }
      });
    });
  }
  
  logout(): void {
    console.log('🚪 Starting logout process...');
    this.isLoadingSubject.next(true);
    
    this.msalService.logoutPopup({
      mainWindowRedirectUri: '/login'
    }).subscribe({
      next: () => {
        console.log('✅ Logout successful');
        this.userProfileSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.isLoadingSubject.next(false);
      },
      error: (error) => {
        console.error('❌ Logout failed:', error);
        this.isLoadingSubject.next(false);
      }
    });
  }
  
  async getAccessToken(): Promise<string> {
    console.log('🔑 Getting access token...');
    
    const isInitialized = await this.ensureMSALInitialized();
    if (!isInitialized) {
      throw new Error('MSAL not initialized');
    }
    
    try {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No user account found');
      }
      
      const response = await this.msalService.acquireTokenSilent({
        scopes: ['user.read'],
        account: accounts[0]
      }).toPromise();
      
      console.log('✅ Token acquired:', response?.accessToken?.substring(0, 30) + '...');
      return response?.accessToken || '';
    } catch (error) {
      console.error('❌ Failed to get access token silently:', error);
      
      // Try to get token interactively if silent fails
      try {
        const response = await this.msalService.acquireTokenPopup({
          scopes: ['user.read']
        }).toPromise();
        
        console.log('✅ Token acquired via popup');
        return response?.accessToken || '';
      } catch (popupError) {
        console.error('❌ Failed to get token via popup:', popupError);
        throw popupError;
      }
    }
  }
  
  getCurrentUser(): UserProfile | null {
    return this.userProfileSubject.value;
  }
  
  getMSALStatus(): string {
    return this.isMsalInitialized ? 'Initialized' : 'Not Initialized';
  }
}