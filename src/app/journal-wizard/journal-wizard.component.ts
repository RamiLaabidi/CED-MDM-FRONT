import { Component } from '@angular/core';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { FormJRLInfoComponent } from '../form-jrlinfo/form-jrlinfo.component';
import { JournalSettingsComponent} from '../journal-settings/journal-settings.component';
import { FormGroup } from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-journal-wizard',
  standalone: true,
  imports: [
    StepperComponent,
    FormJRLInfoComponent,
    JournalSettingsComponent,
    CommonModule
  ],
  templateUrl: './journal-wizard.component.html',
  styleUrl: './journal-wizard.component.css'
})
export class JournalWizardComponent {
  stepIndex = 1;
  journalData: any; // Données du journal pour passer entre les étapes
  settingsData!: FormGroup;

  nextStep(form: FormGroup) {
    // Sauvegarde les données du formulaire de l'étape 1
    this.journalData = form.value;

    // Passe à l'étape suivante
    this.stepIndex = 2;
  }
  previousStep() {
    this.stepIndex = 1; // Revient à l'étape 1
  }




  submitForm(form: FormGroup) {
    this.settingsData = form;
    console.log("Journal + Settings enregistrés :", {
      ...this.journalData,
      ...this.settingsData.value
    });
    alert('Journal et paramètres enregistrés avec succès ! 🎉');
  }
}
