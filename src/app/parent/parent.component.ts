import { Component } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {StepperComponent} from '@progress/kendo-angular-layout';
import {TwoStepComponent} from '../two-step/two-step.component';
import {ThirdStepComponent} from '../third-step/third-step.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [
    StepperComponent,
    TwoStepComponent,
    ThirdStepComponent,
   [CommonModule] // ✅ Import pour *ngIf

],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
  stepIndex = 0;
  personalData!: FormGroup;
  addressData!: FormGroup;
  paymentData!: FormGroup;

  nextStep(form: FormGroup) {
    if (this.stepIndex === 0) {
      this.personalData = form;
    } else if (this.stepIndex === 1) {
      this.addressData = form;
    }
    this.stepIndex++;
  }

  previousStep() {
    this.stepIndex--;
  }

  submitForm(form: FormGroup) {
    this.paymentData = form;
    console.log('Données soumises :', {
      ...this.personalData.value,
      ...this.addressData.value,
      ...this.paymentData.value
    });
    alert('Formulaire soumis avec succès ! 🎉');
  }
}
