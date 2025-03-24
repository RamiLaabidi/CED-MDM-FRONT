import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {DatePipe, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TextBoxComponent} from '@progress/kendo-angular-inputs';
import {JournalSetting} from '../../Entities/journal-setting/journal-setting.module';
import {ActivatedRoute} from '@angular/router';
import {JournalSettingService} from '../../services/journal-setting.service';
import {HttpErrorResponse} from '@angular/common/http';
import {GeneralLedgerService} from '../../services/general-ledger.service';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-journal-setting-update',
  standalone: true,
  imports: [
    ButtonComponent,
    DatePickerComponent,
    DropDownListComponent,
    NgIf,
    ReactiveFormsModule,
    TextBoxComponent,
    DatePipe
  ],
  templateUrl: './journal-setting-update.component.html',
  styleUrl: './journal-setting-update.component.css'
})
export class JournalSettingUpdateComponent implements OnInit{
  @Input() journalData!: FormGroup;
  @Input() jrlId!: string;

  @Output() submit = new EventEmitter<FormGroup>();

  journalSettingInfo!: JournalSetting;
  journalSettingForm!: FormGroup;
  jlsId!: string;
  isSaved = false;
  errorMessage = '';
  isEditing = false;
  defaultGeneralLedger = {displayText: 'Select a General ledger'};
  defaultJournalSettingType = {jlS_JournalSettingType_Id: 'Select '};
  journalSettingTypes: any[] = [];
  generalLedgers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private journalSettingService: JournalSettingService,
    private fb: FormBuilder,
    private generalLedgerService: GeneralLedgerService,

  ) {}



  ngOnInit(): void {

    this.initForm();


    this.jlsId = this.route.snapshot.paramMap.get('id') ?? '';


    this.loadJournalSetting();
    this.loadGeneralLedgers();



  }
   initForm(): void {
    this.journalSettingForm = this.fb.group({
      jlS_LegalEntity_Id: [''],
      jlS_JournalSettingType_Id: [''],
      jlS_Journal_Id: [''],
      jlS_GeneralLedger_Id: [''],
      jlS_EffectiveDate: [null],
      jlS_TerminationDate: [null],
      jlS_ZeroRateForeignTaxCode: [''],
      jlS_EntrySystem: ['']
    });
     this.journalSettingForm.disable(); // ✅ Tous les champs désactivés au début

   }
  private loadJournalSetting(): void {
    if (!this.jlsId) return;

    this.journalSettingService.getById(this.jlsId).subscribe({
      next: (data) => {
        this.journalSettingInfo = data;

        // Mise à jour du formulaire avec les données reçues
        this.journalSettingForm.patchValue({
          ...data,
          jlS_EffectiveDate: data.jlS_EffectiveDate ? new Date(data.jlS_EffectiveDate) : null,
          jlS_TerminationDate: data.jlS_TerminationDate ? new Date(data.jlS_TerminationDate) : null
        });

        // Récupération des valeurs initiales
        const legalEntityId = this.journalSettingForm.get('jlS_LegalEntity_Id')?.value;
        const entrySystem = this.journalSettingForm.get('jlS_EntrySystem')?.value;
        const jlS_JournalSettingType_Id = this.journalSettingForm.get('jlS_JournalSettingType_Id')?.value;

        console.log('✅ Valeur initiale de jlS_EntrySystem :', entrySystem);
        console.log('✅ Valeur initiale de jlS_LegalEntity_Id :', legalEntityId);

        // Charger les JournalSettingTypes si les deux valeurs sont présentes
        if (legalEntityId && entrySystem) {
          this.loadJournalSettingTypes(legalEntityId, entrySystem);
        }

        // Écouter les changements sur jlS_EntrySystem
        this.journalSettingForm.get('jlS_EntrySystem')?.valueChanges
          .pipe(
            debounceTime(500),          // Attendre 500 ms après la dernière frappe
            distinctUntilChanged()      // Éviter les appels si la valeur est identique
          )
          .subscribe((newEntrySystem) => {
            console.log('🔄 Nouvelle valeur de jlS_EntrySystem :', newEntrySystem);

            // Récupérer la dernière valeur de legalEntityId
            const updatedLegalEntityId = this.journalSettingForm.get('jlS_LegalEntity_Id')?.value;

            // Appeler loadJournalSettingTypes avec les nouvelles valeurs
            if (updatedLegalEntityId && newEntrySystem) {
              this.loadJournalSettingTypes(updatedLegalEntityId, newEntrySystem);
            }
          });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du Journal Setting', err);
        this.errorMessage = 'Impossible de charger les données du Journal Setting.';
      }
    });
  }



  loadJournalSettingTypes(legalEntityId: string, entrySystem: string) {
    this.journalSettingService.getAvailableJournalSettingTypes(legalEntityId, entrySystem).subscribe({

      next: (response) => {
        console.log('Données reçues :', response); // Debug ici
        this.journalSettingTypes = response || [];

        if (this.journalSettingTypes.length > 0) {
          this.journalSettingForm.patchValue({ jlS_JournalSettingType_Id: this.journalSettingTypes[0].id });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des types :', error);
        this.errorMessage = 'Impossible de récupérer les types de journal disponibles.';
      }
    });
  }


  private loadGeneralLedgers(): void {
    this.generalLedgerService.getActiveGeneralLedgers().subscribe({
      next: (data) => {
        this.generalLedgers = data.map(generalLedger => ({
          gL_Id: generalLedger.gL_Id,
          displayText: `${generalLedger.gL_Description} - ${generalLedger.gL_ExactGeneralLedger}`
        }));
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des General Ledgers', error);
        this.generalLedgers = [];
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.journalSettingForm.get('jlS_EntrySystem')?.enable();
    this.journalSettingForm.get('jlS_JournalSettingType_Id')?.enable();
    this.journalSettingForm.get('jlS_GeneralLedger_Id')?.enable();
    this.journalSettingForm.get('jlS_ZeroRateForeignTaxCode')?.enable();

  }




  submitForm(): void {
    if (this.journalSettingForm.valid) {
      const updatedData = {
        ...this.journalSettingInfo,
        ...this.journalSettingForm.value,
        jlS_LastModifiedDate: new Date()
      };
      this.journalSettingService.update(this.jlsId, updatedData).subscribe({
        next: () => {
          this.isSaved = true;
          this.isEditing = false;
          this.journalSettingForm.disable(); // ✅ Désactiver après mise à jour
          console.log("Journal Setting mis à jour avec succès !");

          // ✅ Charger les nouvelles données après mise à jour réussie
          this.loadJournalSetting();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour :", err);
          this.errorMessage = "Une erreur est survenue lors de la mise à jour.";
        }
      });    }
  }

}
