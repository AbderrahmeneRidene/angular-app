import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// MSAL imports
import { 
  MSAL_INSTANCE, 
  MsalBroadcastService, 
  MsalGuard, 
  MsalService 
} from '@azure/msal-angular';
import { 
  IPublicClientApplication, 
  PublicClientApplication,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';

// Services
import { environment } from './environments/environment';

// MSAL Instance Factory
export function MSALInstanceFactory(): IPublicClientApplication {
  console.log('🔄 Creating MSAL instance...');
  
  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: environment.azureAd.clientId,
      authority: environment.azureAd.authority,
      redirectUri: environment.azureAd.redirectUri,
      postLogoutRedirectUri: '/login'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
          if (!containsPii) {
            switch (level) {
              case LogLevel.Error:
                console.error('🔴 MSAL Error:', message);
                break;
              case LogLevel.Info:
                console.info('🔵 MSAL Info:', message);
                break;
              case LogLevel.Warning:
                console.warn('🟡 MSAL Warning:', message);
                break;
              case LogLevel.Verbose:
                console.debug('🟣 MSAL Verbose:', message);
                break;
            }
          }
        },
        logLevel: LogLevel.Verbose // Change to Warning in production
      }
    }
  });

  // Initialize MSAL instance
  msalInstance.initialize().then(() => {
    console.log('✅ MSAL initialized successfully');
  }).catch(error => {
    console.error('❌ MSAL initialization failed:', error);
  });

  return msalInstance;
}

// MSAL Initializer Factory - This ensures MSAL is initialized before Angular app starts
export function initializeMSAL(msalService: MsalService) {
  return (): Promise<void> => {
    console.log('🚀 Initializing MSAL service...');
    return msalService.instance.initialize().then(() => {
      console.log('✅ MSAL service initialized');
    }).catch(error => {
      console.error('❌ MSAL service initialization failed:', error);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: 'APP_INITIALIZER',
      useFactory: initializeMSAL,
      deps: [MsalService],
      multi: true
    }
  ]
};