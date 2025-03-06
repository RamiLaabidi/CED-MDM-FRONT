import {Component, OnInit} from '@angular/core';
import { KENDO_BUTTON} from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [

    KENDO_BUTTON
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
