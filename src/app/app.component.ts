import { Component } from '@angular/core';


import {MainComponent} from './Components/main/main.component';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
