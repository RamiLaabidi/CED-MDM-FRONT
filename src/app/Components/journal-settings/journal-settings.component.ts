import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {JournalSettingService } from '../../services/journal-setting.service';
import {debounceTime, distinctUntilChanged } from 'rxjs';
import {TextBoxComponent} from '@progress/kendo-angular-inputs';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {NgIf} from '@angular/common';
import {DialogActionsComponent, DialogComponent} from '@progress/kendo-angular-dialog';
import {HttpErrorResponse} from '@angular/common/http';
import {GeneralLedgerService} from '../../services/general-ledger.service';
import {LabelComponent} from '@progress/kendo-angular-label';
import {Router} from '@angular/router';

@Component({
  selector: 'app-journal-settings',
  standalone: true,
  templateUrl: './journal-settings.component.html',
  imports: [
    TextBoxComponent,
    DropDownListComponent,
    ReactiveFormsModule,
    DatePickerComponent,
    ButtonComponent,
    NgIf,
    DialogActionsComponent,
    DialogComponent,
    LabelComponent
  ],
  styleUrl: './journal-settings.component.css'
})
export class JournalSettingsComponent implements OnInit {
  @Input() journalData!: FormGroup;
  @Input() jrlId!: string;
  @Input() legalEntityId!: string;
  @Output() next = new EventEmitter<FormGroup>();
  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();



  journalSettingForm!: FormGroup;
  errorMessage: string | null = null;
  journalSettingTypes: any[] = [];
  showDialog = false;
  generalLedgers: any[] = [];
  defaultGeneralLedger = {displayText: 'Select a General ledger'};


  constructor(
    private fb: FormBuilder  ,
    private journalSettingService: JournalSettingService,
    private generalLedgerService: GeneralLedgerService,
    private router: Router

) {}

  ngOnInit(): void {
    const savedData = this.journalSettingService.getFormData();

    this.journalSettingForm = this.fb.group({
      jlS_LegalEntity_Id: [this.legalEntityId, Validators.required],
      jlS_JournalSettingType_Id: [null, Validators.required],
      jlS_Journal_Id: [this.jrlId, Validators.required],
      jlS_EffectiveDate: [new Date(), Validators.required],
      jlS_TerminationDate: [null],
      jlS_ZeroRateForeignTaxCode: [null],
      jlS_EntrySystem:  [null, Validators.required],
      jlS_GeneralLedger_Id: [null, Validators.required],
    });
    this.loadGeneralLedgers();

    if (savedData) {
      this.journalSettingForm.patchValue(savedData);
      this.journalSettingForm.disable(); // Désactiver tous les champs après chargement des données

    }
    // Détecter les changements sur  jlS_EntrySystem avec un délai pour éviter les appels inutiles
    this.journalSettingForm.get('jlS_EntrySystem')?.valueChanges
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
          this.journalSettingForm.patchValue({jlS_JournalSettingType_Id: this.journalSettingTypes[0].id});
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des types:', error);
        this.errorMessage = 'Impossible de récupérer les types de journal disponibles.';
      }
    });
  }
  private loadGeneralLedgers(): void {
    this.generalLedgerService.getActiveGeneralLedgers().subscribe({
      next: (data) => {
        this.generalLedgers = data.map(generalLedger => ({
          gL_Id: generalLedger.gL_Id, // Ajout de l'ID
          gL_ExactGeneralLedger: generalLedger.gL_ExactGeneralLedger,
          gL_Description: generalLedger.gL_Description ,//
          displayText: `${generalLedger.gL_Description} - ${generalLedger.gL_ExactGeneralLedger}` // 🔥 Formatage

        }));

      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des General Ledgers', error);
        this.generalLedgers = [];
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
          //this.next.emit(this.journalSettingForm); // 🔹 Émet également l'événement next
          //Désactiver tous les champs après l'enregistrement réussi
          this.journalSettingForm.disable();
        },
        error: (error) => {
          console.error('Error creating journal setting:', error);
          this.errorMessage = 'An error occurred while saving the journal setting.';
        }
      });
    }
  }
  nextStep() {
    // this.next.emit(this.journalSettingForm);
    this.showDialog = true;  // Affiche la popup
    this.journalSettingService.saveFormData(this.journalSettingForm.value);
    this.journalSettingForm.disable();
  }

  previousStep() {
    this.journalSettingService.saveFormData(this.journalSettingForm.value);
    this.journalSettingForm.disable();
    this.previous.emit();
  }

  onDialogClose(choice: boolean) {
    this.showDialog = false;

    if (choice) {
      this.journalSettingForm.reset({
         jlS_EffectiveDate: new Date(),
         jlS_LegalEntity_Id: this.legalEntityId,
         jlS_Journal_Id: this.jrlId
      });

      this.journalSettingForm.enable();
    } else {
      this.next.emit(this.journalSettingForm);
    }
  }

  navigateToJournalSettings() {
    this.router.navigate(['/journalSettings']);
  }

}
