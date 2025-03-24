import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralInformationComponent } from '../general-information/general-information.component';
import { FormJRLInfoComponent } from '../form-jrlinfo/form-jrlinfo.component';
import { JournalSettingsComponent } from '../journal-settings/journal-settings.component';
import {NextNumberComponent} from '../next-number/next-number.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    GeneralInformationComponent,
    FormJRLInfoComponent,
    JournalSettingsComponent,
    CommonModule,
    NextNumberComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  stepIndex = 1; // Indicateur de l'étape active
  journalForm!: FormGroup;
  settingsData!: FormGroup;
  nextNumberData!: FormGroup;

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

  // Fonction pour passer à l'étape suivante (Journal Settings)
  nextStep(form: FormGroup) {
    if (this.stepIndex === 1) {
      this.journalForm.patchValue(form.value);
      this.stepIndex = 2;
    } else if (this.stepIndex === 2) {
      this.settingsData = form;
      this.stepIndex = 3; // Ajout de l'étape 3
    }
  }

  // Fonction pour revenir à l'étape précédente (General Information)
  previousStep() {
    if (this.stepIndex > 1) {
      this.stepIndex--;
    }
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

  submitNextNumber(form: FormGroup) {
    this.nextNumberData = form;
    console.log("Journal + Settings + NextNumber enregistrés :", {
      ...this.journalForm.value,
      ...this.settingsData.value,
      ...this.nextNumberData.value
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
