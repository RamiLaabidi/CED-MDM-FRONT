import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormJRLInfoComponent} from '../form-jrlinfo/form-jrlinfo.component';
import {GeneralInformationComponent} from '../general-information/general-information.component';
import {JournalSettingsComponent} from '../journal-settings/journal-settings.component';
import {NextNumberComponent} from '../next-number/next-number.component';
import {NgIf} from '@angular/common';
import {UpdateJournalComponent} from '../update-journal/update-journal.component';
import {JournalSettingUpdateComponent} from '../journal-setting-update/journal-setting-update.component';

@Component({
  selector: 'app-parent-update-jrl',
  standalone: true,
  imports: [
    GeneralInformationComponent,
    NgIf,
    UpdateJournalComponent,
  ],
  templateUrl: './parent-update-jrl.component.html',
  styleUrl: './parent-update-jrl.component.css'
})
export class ParentUpdateJRLComponent implements OnInit {
  stepIndex = 1; // Indicateur de l'étape active
  journalForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.journalForm = this.fb.group({
      journalAbbreviation: [''],
      activeDate: [''],
      inactiveDate: [''],
      jrlId: [''],
      jrL_LegalEntity_Id: [''],

    });
  }



  // Fonction pour mettre à jour les données du journal
  updateJournalData(journal: any) {
    const today = new Date();
    const formattedDate = this.formatDate(today);

    this.journalForm.patchValue({
      journalAbbreviation: journal.jrL_Abbreviation || '',
      jrlId: journal.jrL_Id, // Vérifie que cette ligne est bien exécutée
      activeDate: formattedDate,
      inactiveDate: formattedDate
    });
  }



  // Fonction pour formater la date
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
