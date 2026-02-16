import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
constructor(private authService2: AuthService) {}
  async testBackend() {
    const token = await this.authService2.getBackendToken();
    console.log(token);
  }

  private authService = inject(AuthService);
  private router = inject(Router);

  userProfile: UserProfile | null = null;
  isLoading = false;
  tokenInfo: any = null;

  ngOnInit(): void {
    // Subscribe to user profile
    this.authService.userProfile$.subscribe((profile) => {
      this.userProfile = profile;
      //console.log('📋 User profile updated:', profile);
    });

    // Check if authenticated
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        console.log('🔒 Not authenticated, redirecting to login');
        this.router.navigate(['/login']);
      }
    });

    // Subscribe to loading state
    this.authService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  async getAccessToken(): Promise<void> {
    this.isLoading = true;

    try {
      const token = await this.authService.getAccessToken();
      this.tokenInfo = {
        hasToken: !!token,
        length: token?.length || 0,
        preview: token ? `${token.substring(0, 30)}...` : 'No token',
        timestamp: new Date().toISOString(),
      };
      console.log('✅ Token acquired successfully');
    } catch (error: any) {
      this.tokenInfo = {
        hasToken: false,
        error: error.message || 'Failed to get token',
      };
      console.error('❌ Token acquisition failed:', error);
    } finally {
      this.isLoading = false;
    }
  }

  simulateApiCall(): void {
    this.tokenInfo = {
      hasToken: true,
      message: 'Simulated API call to Microsoft Graph',
      endpoint: 'https://graph.microsoft.com/v1.0/me',
      timestamp: new Date().toISOString(),
    };
    console.log('🔗 Simulated API call');
  }

  clearData(): void {
    this.tokenInfo = null;
    console.log('🧹 Data cleared');
  }

  logout(): void {
    console.log('🚪 Logging out...');
    this.authService.logout();
  }
}
