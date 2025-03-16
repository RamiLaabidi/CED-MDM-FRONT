import { Component, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NextNumberService } from '../../services/next-number.service';
import { NextNumber} from '../../Entities/next-number/next-number.module';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import {
  NumericTextBoxComponent,
  RadioButtonComponent, SwitchComponent,
  TextAreaComponent,
  TextBoxComponent
} from '@progress/kendo-angular-inputs';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-next-number',
  standalone: true,
  imports: [
    DatePickerComponent,
    TextBoxComponent,
    TextAreaComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    NumericTextBoxComponent,

  ],
  templateUrl: './next-number.component.html',
  styleUrl: './next-number.component.css'
})
export class NextNumberComponent {
  nextNumberForm: FormGroup;

  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder, private nextNumberService: NextNumberService) {
    this.nextNumberForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      number: [null, [Validators.required, Validators.min(1)]],
      startRange: [null, [Validators.required, Validators.min(0)]],
      endRange: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      createdDate: [new Date()],
      createdBy: ['', Validators.required],
      lastModifiedDate: [new Date()],
      lastModifiedBy: [''],
    });
  }

  submitForm() {
    if (this.nextNumberForm.valid) {
      let formData: NextNumber = { ...this.nextNumberForm.value };


      console.log('Données envoyées:', formData); // Debugging

      this.nextNumberService.addNextNumber(formData).subscribe({
        next: (response) => {
          console.log('NextNumber ajouté avec succès:', response);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de NextNumber:', err);
        }
      });
    } else {
      console.warn('Formulaire invalide:', this.nextNumberForm.value);
    }
  }



}
