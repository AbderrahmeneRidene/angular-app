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

  private config!: MsalConfig;

  constructor() {}

  /**
   * Charger dynamiquement la config depuis config.json
   */
  async loadConfig(url: string = '/assets/config.json'): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load config.json');
    }
    const rawConfig = await response.json();

    this.config = {
      clientId: rawConfig.clientId,
      tenantId: rawConfig.tenantId,
      redirectUri: rawConfig.redirectUri,
      scopes: this.parseScopes(rawConfig.scopes)
    };

    // Injecter dans window pour compatibilité globale
    (window as any).__env = this.config;
  }

  private parseScopes(scopes: string | string[]): string[] {
    if (Array.isArray(scopes)) return scopes;
    if (!scopes) return [];
    return scopes.split(',').map(s => s.trim());
  }

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

  get authority(): string {
    return `https://login.microsoftonline.com/${this.tenantId}`;
  }
}
