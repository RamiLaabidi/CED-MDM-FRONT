import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {KENDO_TEXTAREA, KENDO_TEXTBOX, SwitchComponent} from '@progress/kendo-angular-inputs';
import {ButtonComponent} from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-journal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropDownListComponent,
    SwitchComponent,
    KENDO_TEXTBOX,
    KENDO_TEXTAREA,
    ButtonComponent
  ],
  templateUrl: './journal-form.component.html',
  styleUrl: './journal-form.component.css'
})
export class JournalFormComponent {
  form: FormGroup;
  ibanList = ["IBAN 1", "IBAN 2", "IBAN 3"];
  typeList = ["type 1", "type 2", "type 3"];
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      jrlAbbreviation: [''],
      iban: ['', Validators.required],
      glJournal: [''],
      currencyCode: [''],
      administrationExact: ['', Validators.required],
      legalEntity: ['', Validators.required],
      systemGlJournal: ['', Validators.required],
      jrlDescription: [''],
      status: [true]
    });
  }

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
