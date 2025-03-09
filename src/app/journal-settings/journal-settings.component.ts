import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TextBoxComponent} from '@progress/kendo-angular-inputs';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {CommonModule} from '@angular/common';
import {JournalSettingService} from '../services/journal-setting.service';
import {debounceTime, distinctUntilChanged} from 'rxjs';

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
  @Input() legalEntityId!: string; // 🔹 Réception de JRL_LegalEntity_Id

  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();
  journalSettingForm!: FormGroup;
  errorMessage: string | null = null;
  journalSettingTypes: any[] = []; // Stocker les types récupérés depuis l'API


  constructor(private fb: FormBuilder  ,  private journalSettingService: JournalSettingService
) {}

  ngOnInit(): void {
    this.journalSettingForm = this.fb.group({
      //JLS_Id:[''],
      JLS_LegalEntity_Id: [this.legalEntityId, Validators.required],
      JLS_JournalSettingType_Id: [null, Validators.required],
      JLS_Journal_Id: [this.jrlId, Validators.required],
      JLS_EffectiveDate: [new Date(), Validators.required],
      JLS_TerminationDate: [null],
      JLS_ZeroRateForeignTaxCode: [null],
      JLS_EntrySystem:  [null, Validators.required],

    });

    // Détecter les changements sur JLS_EntrySystem avec un délai pour éviter les appels inutiles
    this.journalSettingForm.get('JLS_EntrySystem')?.valueChanges
      .pipe(
        debounceTime(500), // Attendre 500ms après la dernière frappe
        distinctUntilChanged() // Éviter les appels répétés si la valeur n'a pas changé
      )
      .subscribe(entrySystem => {
        if (this.legalEntityId && entrySystem) {
          this.loadJournalSettingTypes(this.legalEntityId, entrySystem);
        }
      });

  }
  loadJournalSettingTypes(legalEntityId: string, entrySystem: string) {
    this.journalSettingService.getAvailableJournalSettingTypes(legalEntityId, entrySystem).subscribe({
      next: (response) => {
        this.journalSettingTypes = response || [];
        if (this.journalSettingTypes.length > 0) {
          this.journalSettingForm.patchValue({ JLS_JournalSettingType_Id: this.journalSettingTypes[0].id });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des types:', error);
        this.errorMessage = 'Impossible de récupérer les types de journal disponibles.';
      }
    });
  }

  submitForm() {
    if (this.journalSettingForm.valid) {
      const formValues = this.journalSettingForm.value;
      this.journalSettingService.createJournalSetting(formValues).subscribe({
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
