import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextBoxDirective} from '@progress/kendo-angular-inputs';
import {ButtonComponent} from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-third-step',
  standalone: true,
  imports: [
    TextBoxDirective,
    ButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './third-step.component.html',
  styleUrl: './third-step.component.css'
})
export class ThirdStepComponent {
  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      category: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.paymentForm.valid) {
      this.submit.emit(this.paymentForm);
    }
  }
}
