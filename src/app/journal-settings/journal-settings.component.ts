import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TextAreaComponent, TextBoxComponent} from '@progress/kendo-angular-inputs';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-journal-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropDownListComponent,
    DatePickerComponent,
    TextBoxComponent,
    ButtonComponent,
    CommonModule,

  ],
  templateUrl: './journal-settings.component.html',
  styleUrl: './journal-settings.component.css'
})
export class JournalSettingsComponent implements OnInit  {
  @Input() journalData!: FormGroup;
  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();
  journalSettingForm!: FormGroup;
  errorMessage: string | null = null;
  journalSettingTypes = [
    { id: 'type1', description: 'Type 1' },
    { id: 'type2', description: 'Type 2' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.journalSettingForm = this.fb.group({
      jlsZeroRateForeignTaxCode: [''],
      jlsEffectiveDate: [null, Validators.required],
      jlsTerminationDate: [null],
      jlsJournalSettingTypeId: [null, Validators.required]
    });
  }






  submitForm() {
    this.submit.emit(this.journalSettingForm);
  }

  previousStep() {
    this.previous.emit();
  }
}
