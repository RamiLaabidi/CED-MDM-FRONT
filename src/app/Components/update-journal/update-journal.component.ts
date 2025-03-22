import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Journal} from '../../Entities/journal/journal.module';
import {ActivatedRoute} from '@angular/router';
import {JournalService} from '../../services/journal.service';

@Component({
  selector: 'app-update-journal',
  standalone: true,
  imports: [

  ],
  templateUrl: './update-journal.component.html',
  styleUrl: './update-journal.component.css'
})
export class UpdateJournalComponent implements OnInit{
  journalInfo!: Journal;
  journalForm!: FormGroup;
  jrlId!: string;
  isSaved = false;
  errorMessage = '';
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService,
    private fb: FormBuilder
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
      jrL_TimeStamp: [null]
    });

    this.loadJournal();
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
    /*  jrL_Description: this.journalInfo.jrL_Description || '',
      jrL_CurrencyCode: this.journalInfo.jrL_CurrencyCode || '',
      jrL_JournalType_Id: this.journalInfo.jrL_JournalType_Id || '',
      jrL_GeneralLedger_Id: this.journalInfo.jrL_GeneralLedger_Id || '',
      jrL_BankAccount_Id: this.journalInfo.jrL_BankAccount_Id || '',
      jrL_LegalEntity_Id: this.journalInfo.JRL_LegalEntity_Id || '',
      jrL_ExactAdministration: this.journalInfo.JRL_ExactAdministration || '',
      jrL_ExactJournal: this.journalInfo.JRL_ExactJournal || '',
      jrL_Inactive: this.journalInfo.JRL_Inactive*/
    });

    this.journalForm.disable();
  }

  enableEditing(): void {
    this.isEditing = true;
    this.journalForm.enable();
    this.journalForm.get('JRL_ExactJournal')?.disable();
    this.journalForm.get('JRL_ExactAdministration')?.disable();
    this.journalForm.get('JRL_TimeStamp')?.disable();
  }

  submitForm(): void {
    if (this.journalForm.valid) {
      const updatedData = {
        ...this.journalInfo,
        ...this.journalForm.value,
        JRL_TimeStamp: new Date()
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
