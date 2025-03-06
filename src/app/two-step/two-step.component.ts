import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextBoxDirective} from '@progress/kendo-angular-inputs';
import {ButtonComponent} from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-two-step',
  standalone: true,
  imports: [
    TextBoxDirective,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './two-step.component.html',
  styleUrl: './two-step.component.css'
})
export class TwoStepComponent {
  @Output() next = new EventEmitter<FormGroup>();
  @Output() previous = new EventEmitter<void>();

  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  nextStep() {
    if (this.addressForm.valid) {
      this.next.emit(this.addressForm);
    }
  }
}
