import { Injectable } from '@angular/core';
import {
  BrowserCacheLocation,
  Configuration,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { EnvService } from './env-service';

@Injectable({
  providedIn: 'root',
})
export class MsalConfigService {
  constructor(private env: EnvService) {
    console.log('clientId = ' + env.clientId);
    console.log('tenantId = ' + env.tenantId);
    console.log('scopes = ' + env.scopes);
    console.log('redirectUri = ' + env.redirectUri);
    console.log('authority = ' + env.authority);
  }

  private getMSALConfiguration(): Configuration {
    return {
      auth: {
        clientId: this.env.clientId,
        authority: this.env.authority,
        redirectUri: this.env.redirectUri,
        postLogoutRedirectUri: this.env.redirectUri,
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false,
      },
      system: {
        loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
            if (!containsPii) {
              switch (level) {
                case LogLevel.Error:
                  // console.error('🔴 MSAL Error:', message);
                  break;
                case LogLevel.Warning:
                  // console.warn('🟡 MSAL Warning:', message);
                  break;
                case LogLevel.Info:
                  // console.info('🔵 MSAL Info:', message);
                  break;
                case LogLevel.Verbose:
                  // console.debug('🟣 MSAL Verbose:', message);
                  break;
              }
            }
          },
          logLevel: LogLevel.Info,
        },
      },
    };
  }

  createMSALInstance(): IPublicClientApplication {
    return new PublicClientApplication(this.getMSALConfiguration());
  }
}
