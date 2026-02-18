import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

function loadConfig() {
  return fetch('/assets/config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load config.json');
      }
      return response.json();
    })
    .then(config => {
      (window as any).__env = config;
    });
}

loadConfig()
  .then(() => {
    return bootstrapApplication(AppComponent, appConfig);
  })
  .catch(err => console.error('Bootstrap error:', err));
