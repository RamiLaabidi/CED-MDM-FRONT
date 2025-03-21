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
  @Output() next = new EventEmitter<FormGroup>(); // Événement pour passer à l'étape suivante
  @Output() legalEntityId = new EventEmitter<string>(); // 🔹 Émetteur pour JRL_LegalEntity_Id

  journalForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  legalEntities: any[] = []; // Stores legal entities
  journalTypes: any[] = [];
  generalLedgers: any[] = []; // ✅ Liste des comptes généraux
  currencies: any[] = []; // Liste des devises disponibles

  defaultJournalType = {jrT_Id: 'Select a journal type'};
  defaultLegalEntity = {nomComplet: 'Select a legal entity'};
  defaultGeneralLedger = {displayText: 'Select a General ledger'};

  isSaved = false;

  nextStep() {
   // if (this.journalForm.valid) {
    this.next.emit(this.journalForm);
    // this.legalEntityId.emit(this.journalForm.get('JRL_LegalEntity_Id')?.value); // 🔹 Émet la valeur correctement
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
      JRL_Id: [''],
      JRL_Abbreviation: ['', Validators.required],
      JRL_Description: ['', [Validators.maxLength(30)]],
      JRL_CurrencyCode: ['', Validators.required],
      JRL_JournalType_Id: ['', Validators.required],
      JRL_GeneralLedger_Id: ['', Validators.required],
      JRL_BankAccount_Id: [{value: '', disabled: true}, Validators.required],
      JRL_LegalEntity_Id: ['', Validators.required],
      JRL_ExactAdministration: ['', Validators.required],
      JRL_ExactJournal: ['', Validators.required],
      JRL_Inactive: [false]
    });

    // 🔹 Écoute du changement de LegalEntity pour charger les General Ledgers
    this.journalForm.get('JRL_LegalEntity_Id')?.valueChanges.subscribe(legalEntityId => {
      const journalType = this.journalForm.get('JRL_JournalType_Id')?.value; // Récupère le type de journal

      if (legalEntityId) {
        this.loadGeneralLedgers(legalEntityId);

        // 🔹 Charge l'IBAN seulement si le type de journal est "Bank"
        if (journalType === 'Bank') {
          this.loadBankAccount(legalEntityId);
        }
      } else {
        this.generalLedgers = []; // Réinitialisation si aucun Legal Entity sélectionné
        this.journalForm.patchValue({ JRL_BankAccount_Id: '' }); // Réinitialise
      }
    });
    // Charger toutes les devises
    this.currencyServiceService.getActiveCurrencyIds().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des devises :", err);
      }
    });

// 🔹 Écoute du changement de type de journal
    this.journalForm.get('JRL_LegalEntity_Id')?.valueChanges.subscribe(selectedId => {
      const selectedEntity = this.legalEntities.find(entity => entity.lE_Id === selectedId);
      if (selectedEntity) {
        this.legalEntityTwoService.getCurrencyCode(selectedEntity.leT_ShortName, selectedEntity.leT_LongName)
          .subscribe({
            next: (response) => {
              // Trouver la devise correspondante pour définir la valeur par défaut
              const defaultCurrency = this.currencies.find(c => c.name === response.currencyCode);
              if (defaultCurrency) {
                this.journalForm.patchValue({ JRL_CurrencyCode: defaultCurrency.CRR_Id });
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
    this.journalForm.get('JRL_LegalEntity_Id')?.valueChanges.subscribe(selectedId => {
      const selectedEntity = this.legalEntities.find(entity => entity.lE_Id === selectedId);
      console.log('Entité sélectionnée:', selectedEntity);  // Vérifiez la valeur retournée
      if (selectedEntity) {
        // Appel API pour récupérer JRL_ExactAdministration
        this.legalEntityTwoService.getExactAdministrationById(selectedId).subscribe({
          next: (response) => {
            console.log("Réponse reçue:", response);  // Affiche la structure de l'objet
            if (response && response.lE_ExactAdministration) {
              // Activer temporairement le champ
              this.journalForm.get('lE_ExactAdministration')?.enable();

              // Mettre à jour la valeur de JRL_ExactAdministration
              this.journalForm.patchValue({JRL_ExactAdministration: response.lE_ExactAdministration});

              // Désactiver le champ après mise à jour si nécessaire
              // this.journalForm.get('lE_ExactAdministration')?.disable();
            } else {
              console.error('La réponse ne contient pas la propriété LE_ExactAdministration');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erreur lors de la récupération de JRL_ExactAdministration:', error);
          }
        });


        this.legalEntityTwoService.getCurrencyCode(selectedEntity.leT_ShortName, selectedEntity.leT_LongName)
          .subscribe({
            next: (response) => {
              console.log("Données reçues :", response); // Vérifie la structure des données
              this.journalForm.patchValue({JRL_CurrencyCode: response.currencyCode}); // Utilisation correcte de currencyCode
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur lors de la récupération du code devise', error);
              // Ici, tu pourrais ajouter une gestion des erreurs plus visible pour l'utilisateur
            }
          });
      }
    });
    if (this.isSaved) {
      this.journalForm.get('JRL_BankAccount_Id')?.disable();
    }

  }

  // ✅ Charge les comptes généraux selon l'ID de l'entité légale
  private loadGeneralLedgers(legalEntityId: string): void {
    this.generalLedgerService.getActiveGeneralLedgers(legalEntityId).subscribe({
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
        if (data && data.baC_Id) {
          this.journalForm.patchValue({JRL_BankAccount_Id: data.baC_Id}); // Affiche l'IBAN
          this.journalForm.get('JRL_BankAccount_Id')?.enable(); // Active le champ
        } else {
          this.journalForm.patchValue({JRL_BankAccount_Id: ''}); // Réinitialise si pas d'IBAN
          this.journalForm.get('JRL_BankAccount_Id')?.disable();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement de l’IBAN', error);
        this.journalForm.patchValue({JRL_BankAccount_Id: ''});
        this.journalForm.get('JRL_BankAccount_Id')?.disable();
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
      journalData.JRL_Id = `${journalData.JRL_ExactAdministration}-${journalData.JRL_ExactJournal}`;

      // Récupérer le BAC_Id à partir de l'IBAN
      this.bankAccountService.getBankAccountByLegalEntity(journalData.JRL_LegalEntity_Id ?? '').subscribe({
        next: (data) => {
          if (data && data.baC_Id) {
            journalData.JRL_BankAccount_Id = data.baC_Id; // Remplace l’IBAN par l’ID
          }

          this.journalService.createJournal(journalData).subscribe({
            next: () => {
              alert('Journal créé avec succès !');
              this.journalCreated.emit(journalData);
              this.isSubmitting = false;
               this.isSaved = true;  // ✅ Activation du bouton Next
              this.journalForm.disable();
              this.journalForm.get('JRL_BankAccount_Id')?.disable(); // ✅ Désactive le champ après sauvegarde
              this.journalForm.get('JRL_LegalEntity_Id')?.enable();
            },
            error: (error: HttpErrorResponse) => {
              this.errorMessage = error.error?.title || 'Une erreur est survenue.';
              this.isSubmitting = false;
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors de la récupération du BAC_Id', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
}
