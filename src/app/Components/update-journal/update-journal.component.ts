import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Journal} from '../../Entities/journal/journal.module';
import {ActivatedRoute} from '@angular/router';
import {JournalService} from '../../services/journal.service';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {NgIf} from '@angular/common';
import {SwitchComponent, TextAreaComponent, TextBoxComponent} from '@progress/kendo-angular-inputs';
import {HttpErrorResponse} from '@angular/common/http';
import {LegalEntityTypeService} from '../../services/legal-entity-type.service';
import {JournalTypeService} from '../../services/journal-type.service';
import {LegalEntityService} from '../../services/legal-entity.service';
import {GeneralLedgerService} from '../../services/general-ledger.service';
import {BankAccountService} from '../../services/bank-account.service';
import {CurrencyServiceService} from '../../services/currency-service.service';

@Component({
  selector: 'app-update-journal',
  standalone: true,
  imports: [
    ButtonComponent,
    DropDownListComponent,
    NgIf,
    ReactiveFormsModule,
    SwitchComponent,
    TextAreaComponent,
    TextBoxComponent,


  ],
  templateUrl: './update-journal.component.html',
  styleUrl: './update-journal.component.css'
})
export class UpdateJournalComponent implements OnInit{
  @Output() journalCreated = new EventEmitter<Journal>();
  @Output() next = new EventEmitter<FormGroup>(); // Événement pour passer à l'étape suivante
  @Output() legalEntityId = new EventEmitter<string>(); // 🔹 Émetteur pour jrL_LegalEntity_Id

  journalInfo!: Journal;
  journalForm!: FormGroup;
  jrlId!: string;
  isSaved = false;
  errorMessage = '';
  isEditing = false;
  legalEntities: any[] = []; // Stores legal entities
  journalTypes: any[] = [];
  generalLedgers: any[] = []; // ✅ Liste des comptes généraux
  currencies: any[] = []; // Liste des devises disponibles

  defaultJournalType = {jrT_Id: 'Select a journal type'};
  defaultLegalEntity = {nomComplet: 'Select a legal entity'};
  defaultGeneralLedger = {displayText: 'Select a General ledger'};
  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService,
    private fb: FormBuilder,
    private legalEntityService: LegalEntityTypeService,
    private journalTypeService: JournalTypeService,
    private legalEntityTwoService: LegalEntityService,
    private generalLedgerService: GeneralLedgerService,
    private bankAccountService: BankAccountService,
    private currencyServiceService: CurrencyServiceService
  ) {}

  ngOnInit(): void {
    this.jrlId = this.route.snapshot.paramMap.get('id')!;

    this.journalForm = this.fb.group({

      jrL_Abbreviation: [''],
      jrL_Description: [''],
      jrL_CurrencyCode: [''],
      jrL_JournalType_Id: [''],
      jrL_GeneralLedger_Id: [''],
      jrL_BankAccount_Id: [''],
      jrL_LegalEntity_Id: [''],
      jrL_ExactAdministration: [''],
      jrL_ExactJournal: [''],
      jrL_Inactive: [false],
    });

    this.loadJournal();
    this.loadGeneralLedgers();
    this.loadLegalEntities();
    this.loadJournalTypes();
    this.currencyServiceService.getActiveCurrencyIds().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des devises :", err);
      }
    });


  }

  loadJournal(): void {
    this.journalService.getJournalByIdWithSettings(this.jrlId).subscribe({
      next: (data) => {
        this.journalInfo = data;
        this.initForm();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du Journal', err);
        this.errorMessage = "Impossible de charger les données du Journal.";
      }
    });
  }

  initForm(): void {
    if (!this.journalInfo) return;

    this.journalForm.setValue({
      jrL_Abbreviation: this.journalInfo.jrL_Abbreviation || '',
      jrL_Description: this.journalInfo.jrL_Description || '',
      jrL_CurrencyCode: this.journalInfo.jrL_CurrencyCode || '',
      jrL_JournalType_Id: this.journalInfo.jrL_JournalType_Id || '',
      jrL_GeneralLedger_Id: this.journalInfo.jrL_GeneralLedger_Id || '',
      jrL_BankAccount_Id: this.journalInfo.jrL_BankAccount_Id || '',
      jrL_LegalEntity_Id: this.journalInfo.jrL_LegalEntity_Id || '',
      jrL_ExactAdministration: this.journalInfo.jrL_ExactAdministration || '',
      jrL_ExactJournal: this.journalInfo.jrL_ExactJournal || '',
      jrL_Inactive: this.journalInfo.jrL_Inactive
    });

    this.journalForm.disable();
  }

  enableEditing(): void {
    this.isEditing = true;
    this.journalForm.enable();
    this.journalForm.get('jrL_ExactJournal')?.disable();
    this.journalForm.get('jrL_ExactAdministration')?.disable();
    this.journalForm.get('jrL_LegalEntity_Id')?.disable();
    this.journalForm.get('jrL_BankAccount_Id')?.disable();
    this.journalForm.get('jrL_CurrencyCode')?.disable();
    this.journalForm.get('jrL_JournalType_Id')?.disable();
    this.journalForm.get('jrL_GeneralLedger_Id')?.disable();


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

  submitForm(): void {
    if (this.journalForm.valid) {
      const updatedData = {
        ...this.journalInfo,
        ...this.journalForm.value,
      };

      this.journalService.updateJournal(this.jrlId, updatedData).subscribe({
        next: () => {
          this.isSaved = true;
          this.isEditing = false;
          this.journalForm.disable();
          console.log("Journal mis à jour avec succès !");
          this.loadJournal();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour :", err);
          this.errorMessage = "Une erreur est survenue lors de la mise à jour.";
        }
      });
    }
  }
}
