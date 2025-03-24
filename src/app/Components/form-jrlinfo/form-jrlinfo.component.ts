import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { SwitchComponent, TextAreaComponent, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { JournalService } from '../../services/journal.service';
import { Journal } from '../../Entities/journal/journal.module';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LegalEntityTypeService } from '../../services/legal-entity-type.service';
import { JournalTypeService } from '../../services/journal-type.service';
import { LegalEntityService } from '../../services/legal-entity.service';
import {GeneralLedgerService} from '../../services/general-ledger.service';
import {BankAccountService} from '../../services/bank-account.service';
import {CurrencyServiceService} from '../../services/currency-service.service';

@Component({
  selector: 'app-form-jrlinfo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextBoxComponent,
    ButtonsModule,
    SwitchComponent,
    TextAreaComponent,
    DropDownListComponent,
  ],
  templateUrl: './form-jrlinfo.component.html',
  styleUrl: './form-jrlinfo.component.css'
})
export class FormJRLInfoComponent implements OnInit {
  @Output() journalCreated = new EventEmitter<Journal>();
  @Output() next = new EventEmitter<FormGroup>();
  @Output() legalEntityId = new EventEmitter<string>();

  journalForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  legalEntities: any[] = [];
  journalTypes: any[] = [];
  generalLedgers: any[] = [];
  currencies: any[] = [];

  defaultJournalType = {jrT_Id: 'Select a Journal Type'};
  defaultLegalEntity = {nomComplet: 'Select a Legal Entity'};
  defaultGeneralLedger = {displayText: 'Select a General Ledger'};

  isSaved = false;

  nextStep() {
   // if (this.journalForm.valid) {
    this.next.emit(this.journalForm);
    // this.legalEntityId.emit(this.journalForm.get('jrL_LegalEntity_Id')?.value); // 🔹 Émet la valeur correctement
    //}
  }


  constructor(
    private fb: FormBuilder,
    private journalService: JournalService,
    private legalEntityService: LegalEntityTypeService,
    private journalTypeService: JournalTypeService,
    private legalEntityTwoService: LegalEntityService,
    private generalLedgerService: GeneralLedgerService,
    private bankAccountService: BankAccountService,
    private currencyServiceService: CurrencyServiceService

  ) {
  }

  ngOnInit(): void {

    this.journalForm = this.fb.group({
      jrL_Id: [''],
      jrL_Abbreviation: ['', Validators.required],
      jrL_Description: ['', [Validators.maxLength(30)]],
      jrL_CurrencyCode: ['', Validators.required],
      jrL_JournalType_Id: ['', Validators.required],
      jrL_GeneralLedger_Id: ['', Validators.required],
      jrL_BankAccount_Id: [{value: '', disabled: true}, Validators.required],
      jrL_LegalEntity_Id: ['', Validators.required],
      jrL_ExactAdministration: ['', Validators.required],
      jrL_ExactJournal:  ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      jrL_Inactive: [false]
    });

    this.journalForm.get('jrL_LegalEntity_Id')?.valueChanges.subscribe(legalEntityId => {
      const journalType = this.journalForm.get('jrL_JournalType_Id')?.value;

      if (legalEntityId) {

        if (journalType === 'Bank') {
          this.loadBankAccount(legalEntityId);
        }
      } else {
        this.journalForm.patchValue({ jrL_BankAccount_Id: '' }); // Réinitialise
      }
    });
    this.loadGeneralLedgers();
    this.currencyServiceService.getActiveCurrencyIds().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des devises :", err);
      }
    });

// 🔹 Écoute du changement de type de journal
    this.journalForm.get('jrL_LegalEntity_Id')?.valueChanges.subscribe(selectedId => {
      const selectedEntity = this.legalEntities.find(entity => entity.lE_Id === selectedId);
      if (selectedEntity) {
        this.legalEntityTwoService.getCurrencyCode(selectedEntity.leT_ShortName, selectedEntity.leT_LongName)
          .subscribe({
            next: (response) => {
              const defaultCurrency = this.currencies.find(c => c.name === response.currencyCode);
              if (defaultCurrency) {
                this.journalForm.patchValue({ jrL_CurrencyCode: defaultCurrency.CRR_Id });
              }
            },
            error: (error) => {
              console.error('Erreur lors de la récupération du code devise', error);
            }
          });
      }
    });
    this.loadLegalEntities();
    this.loadJournalTypes();

    // Mise à jour automatique du code devise lors du changement de Legal Entity
    this.journalForm.get('jrL_LegalEntity_Id')?.valueChanges.subscribe(selectedId => {
      const selectedEntity = this.legalEntities.find(entity => entity.lE_Id === selectedId);
      console.log('Entité sélectionnée:', selectedEntity);  // Vérifiez la valeur retournée
      if (selectedEntity) {
        // Appel API pour récupérer jrL_ExactAdministration
        this.legalEntityTwoService.getExactAdministrationById(selectedId).subscribe({
          next: (response) => {
            console.log("Réponse reçue:", response);
            if (response && response.lE_ExactAdministration) {
              this.journalForm.get('lE_ExactAdministration')?.enable();
              this.journalForm.patchValue({jrL_ExactAdministration: response.lE_ExactAdministration});

            } else {
              console.error('La réponse ne contient pas la propriété LE_ExactAdministration');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erreur lors de la récupération de jrL_ExactAdministration:', error);
          }
        });


        this.legalEntityTwoService.getCurrencyCode(selectedEntity.leT_ShortName, selectedEntity.leT_LongName)
          .subscribe({
            next: (response) => {
              console.log("Données reçues :", response);
              this.journalForm.patchValue({jrL_CurrencyCode: response.currencyCode});
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur lors de la récupération du code devise', error);
            }
          });
      }
    });
    if (this.isSaved) {
      this.journalForm.get('jrL_BankAccount_Id')?.disable();
    }

  }

  // ✅ Charge les comptes généraux selon l'ID de l'entité légale
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

  private loadLegalEntities(): void {
    this.legalEntityService.getInactiveLegalEntityTypes().subscribe({
      next: (data) => {
        this.legalEntities = data.flatMap(entity =>
          entity.legalEntities?.map(le => ({
            lE_Id: le.lE_Id,
            leT_ShortName: entity.leT_ShortName,
            leT_LongName: entity.leT_LongName,
            nomComplet: `${entity.leT_ShortName ?? 'Nom court manquant'} - ${entity.leT_LongName ?? 'Nom long manquant'}`
          })) || []
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des entités légales', error);
      }
    });
  }

  private loadBankAccount(legalEntityId: string): void {
    this.bankAccountService.getBankAccountByLegalEntity(legalEntityId).subscribe({
      next: (data) => {
        if (data && data.baC_Id && !this.isSaved) { // ✅ Ne réactive pas après sauvegarde
          this.journalForm.patchValue({ jrL_BankAccount_Id: data.baC_Id });
          this.journalForm.get('jrL_BankAccount_Id')?.enable();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement de l’IBAN', error);
        this.journalForm.patchValue({ jrL_BankAccount_Id: '' });
        this.journalForm.get('jrL_BankAccount_Id')?.disable();
      }
    });
  }


  private loadJournalTypes(): void {
    this.journalTypeService.getAllJournalTypes().subscribe({
      next: (data) => {
        this.journalTypes = data.map(journal => ({jrT_Id: journal.jrT_Id}));
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur chargement Journal Types', error);
      }
    })

  }

  submitForm(): void {
    if (this.journalForm.valid) {
      this.errorMessage = '';
      this.isSubmitting = true;

      let journalData = this.journalForm.value as Journal;
      journalData.jrL_Id = `${journalData.jrL_ExactAdministration}-${journalData.jrL_ExactJournal}`;

      this.journalService.createJournal(journalData).subscribe({
        next: () => {
          alert('Journal created successfully !');
          this.journalCreated.emit(journalData);
          this.isSubmitting = false;
          this.isSaved = true;
          this.journalForm.disable();
          this.journalForm.get('jrL_LegalEntity_Id')?.enable();

        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.title || 'Une erreur est survenue.';
          this.isSubmitting = false;
        }
      });

    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }

}
