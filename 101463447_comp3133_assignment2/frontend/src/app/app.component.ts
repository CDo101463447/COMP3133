import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';  // Import RouterModule along with RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],  // Include RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
