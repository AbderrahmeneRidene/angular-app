import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container mt-5">
      <div class="alert alert-info">
        <h4>Azure AD Bootstrap Demo</h4>
        <p>Application is loading...</p>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Azure AD Bootstrap Demo';
}