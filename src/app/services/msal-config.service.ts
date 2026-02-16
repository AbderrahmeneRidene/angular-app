import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { 
  BrowserCacheLocation, 
  Configuration, 
  IPublicClientApplication, 
  LogLevel, 
  PublicClientApplication 
} from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class MsalConfigService {
  
  private getMSALConfiguration(): Configuration {
    return {
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
          loggerCallback: (level, message, containsPii) => {
            if (!containsPii) {
              switch (level) {
                case LogLevel.Error:
                  //console.error('🔴 MSAL Error:', message);
                  break;
                case LogLevel.Info:
                  //console.info('🔵 MSAL Info:', message);
                  break;
                case LogLevel.Warning:
                  //console.warn('🟡 MSAL Warning:', message);
                  break;
                case LogLevel.Verbose:
                  //console.debug('🟣 MSAL Verbose:', message);
                  break;
              }
            }
          },
          logLevel: environment.production ? LogLevel.Warning : LogLevel.Info
        }
      }
    };
  }
  
  createMSALInstance(): IPublicClientApplication {
    return new PublicClientApplication(this.getMSALConfiguration());
  }
}