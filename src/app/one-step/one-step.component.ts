import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextBoxDirective} from '@progress/kendo-angular-inputs';
import {ButtonComponent} from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-one-step',
  standalone: true,
  imports: [
    TextBoxDirective,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './one-step.component.html',
  styleUrl: './one-step.component.css'
})
export class OneStepComponent {
  @Output() next = new EventEmitter<FormGroup>();

  personalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personalForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  nextStep() {
    if (this.personalForm.valid) {
      this.next.emit(this.personalForm);
    }
  }
}
