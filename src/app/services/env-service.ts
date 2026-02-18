import { Injectable } from '@angular/core';

export interface MsalConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  private readonly config: MsalConfig;

  constructor() {
    const rawConfig = (window as any).__env;

    if (!rawConfig) {
      throw new Error('Configuration Azure AD non chargée');
    }

    this.config = {
      clientId: rawConfig.clientId,
      tenantId: rawConfig.tenantId,
      redirectUri: rawConfig.redirectUri,
      scopes: this.parseScopes(rawConfig.scopes)
    };
  }

  private parseScopes(scopes: string | string[]): string[] {
    if (Array.isArray(scopes)) {
      return scopes;
    }
    if (!scopes) {
      return [];
    }
    return scopes.split(',').map(s => s.trim());
  }

  // 🔹 Getters publics

  get clientId(): string {
    return this.config.clientId;
  }

  get tenantId(): string {
    return this.config.tenantId;
  }

  get redirectUri(): string {
    return this.config.redirectUri;
  }

  get scopes(): string[] {
    return this.config.scopes;
  }

  // 🔹 Helpers utiles MSAL

  get authority(): string {
    return `https://login.microsoftonline.com/${this.tenantId}`;
  }
}
