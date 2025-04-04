import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Employee Management System';

  private authService = inject(AuthService); // Angular 14+ inject syntax

  ngOnInit(): void {
    window.addEventListener('unload', () => {
      this.authService.logout(); // call your logout function here
    });
  }
}
