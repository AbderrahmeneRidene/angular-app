import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = false;
  errorMessage = '';
  msalStatus = 'Checking...';
  
  ngOnInit(): void {
    //console.log('🏁 LoginComponent initialized');
    
    // Subscribe to loading state
    this.authService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
      //console.log('🔄 Loading state:', loading);
    });
    
    // Subscribe to auth state - redirect if already authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      //console.log('🔐 Auth state changed:', isAuth);
      if (isAuth) {
        //console.log('✅ Already authenticated, redirecting to dashboard');
        this.router.navigate(['/dashboard']);
      }
    });
    
    // Check MSAL status after a delay
    setTimeout(() => {
      this.msalStatus = this.authService.getMSALStatus();
      //console.log('📊 MSAL Status:', this.msalStatus);
    }, 1000);
  }
  
  onLogin(): void {
    //console.log('🎯 Login button clicked');
    this.errorMessage = '';
    this.msalStatus = 'Initializing...';
    
    // Add a small delay to ensure UI updates
    setTimeout(() => {
      this.authService.login();
    }, 100);
  }
  
  testMSAL(): void {
    /*
    console.log('🧪 Testing MSAL...');
    console.log('Auth Service:', this.authService);
    console.log('Is Loading:', this.isLoading);
    console.log('MSAL Status:', this.msalStatus);
    */
    // Test MSAL initialization
    this.authService.login();
  }
}