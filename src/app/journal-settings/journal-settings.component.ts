import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TextBoxComponent} from '@progress/kendo-angular-inputs';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {CommonModule} from '@angular/common';
import {JournalSettingService} from '../services/journal-setting.service';

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
  @Input() jrlId!: string;  // Ajout de l'input pour recevoir l'ID du journal

  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();
  journalSettingForm!: FormGroup;
  errorMessage: string | null = null;
  journalSettingTypes = [
    { id: 'CostOfSalesExternalDebit', description: 'CostOfSalesExternalDebit' },
    { id: 'type2', description: 'Type 2' }
  ];

  constructor(private fb: FormBuilder  ,  private journalSettingService: JournalSettingService  // Inject the service here
) {}

  ngOnInit(): void {
    this.journalSettingForm = this.fb.group({
      //JLS_Id:[''],
      JLS_LegalEntity_Id:[null, Validators.required],
      JLS_JournalSettingType_Id: [null, Validators.required],
      JLS_Journal_Id: [this.jrlId, Validators.required], // Initialisation automatique avec jrlId
      JLS_EffectiveDate: [null, Validators.required],
      JLS_TerminationDate: [null, Validators.required],
      JLS_ZeroRateForeignTaxCode: [''],
    });
  }


  submitForm() {
    if (this.journalSettingForm.valid) {
      const formValues = this.journalSettingForm.value;
      const journalSetting = {
        ...formValues,
        JLS_JournalSettingType_Id: formValues.JLS_JournalSettingType_Id,  // Extraire l'id
      };
      this.journalSettingService.createJournalSetting(journalSetting).subscribe({
        next: (response) => {
          console.log('Journal Setting Created:', response);
          this.submit.emit(this.journalSettingForm); // Emit the form value if needed
        },
        error: (error) => {
          console.error('Error creating journal setting:', error);
          this.errorMessage = 'An error occurred while saving the journal setting.';
        }
      });
    }
  }


  previousStep() {
    this.previous.emit();
  }
}
