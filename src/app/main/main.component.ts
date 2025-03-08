import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralInformationComponent } from '../general-information/general-information.component';
import { FormJRLInfoComponent } from '../form-jrlinfo/form-jrlinfo.component';
import { JournalSettingsComponent } from '../journal-settings/journal-settings.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    GeneralInformationComponent,
    FormJRLInfoComponent,
    JournalSettingsComponent,
    CommonModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  stepIndex = 1; // Indicateur de l'étape active
  journalForm!: FormGroup;
  settingsData!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.journalForm = this.fb.group({
      journalAbbreviation: [''],
      activeDate: [''],
      inactiveDate: [''],
      jrlId: ['']
    });
  }

  // Fonction pour passer à l'étape suivante (Journal Settings)
  nextStep(form: FormGroup) {
    this.journalForm.patchValue(form.value);
    this.stepIndex = 2; // Passe à l'étape 2
  }

  // Fonction pour revenir à l'étape précédente (General Information)
  previousStep() {
    this.stepIndex = 1; // Revient à l'étape 1
  }

  // Fonction pour mettre à jour les données du journal
  updateJournalData(journal: any) {
    const today = new Date();
    const formattedDate = this.formatDate(today);

    this.journalForm.patchValue({
      journalAbbreviation: journal.JRL_Abbreviation || '',
      jrlId: journal.JRL_Id, // Vérifie que cette ligne est bien exécutée
      activeDate: formattedDate,
      inactiveDate: formattedDate
    });
  }

  // Fonction pour soumettre le formulaire
  submitForm(form: FormGroup) {
    this.settingsData = form;
    console.log("Journal + Settings enregistrés :", {
      ...this.journalForm.value,
      ...this.settingsData.value
    });
    alert('Journal et paramètres enregistrés avec succès ! 🎉');
  }

  // Fonction pour formater la date
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
