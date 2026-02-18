import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { EnvService } from './app/services/env-service';

async function initApp() {
  try {
    const envService = new EnvService();
    await envService.loadConfig(); // fetch config.json avant bootstrap

    console.log('✅ Configuration loaded:', (window as any).__env);

    // Bootstrap Angular après que la config soit chargée
    await bootstrapApplication(AppComponent, appConfig);
    console.log('✅ Angular app bootstrapped successfully');
  } catch (err) {
    console.error('❌ Bootstrap error:', err);
  }
}

initApp();
