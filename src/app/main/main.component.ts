import { Component } from '@angular/core';
import {JournalFormComponent} from '../journal-form/journal-form.component';
import {GeneralInformationComponent} from '../general-information/general-information.component';
import {FormJRLInfoComponent} from '../form-jrlinfo/form-jrlinfo.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    //JournalFormComponent,
    GeneralInformationComponent,
    FormJRLInfoComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  journalData = {
    journalName: '',
    activeDate: '',
    inactiveDate: '',
    jrlId: ''
  };

  updateJournalData(journal: any) {
    const today = new Date(); // Récupère la date du jour
    const formattedDate = this.formatDate(today); // Formate la date en jj/mm/aaaa

    this.journalData = {
      ...this.journalData,
      journalName: journal.JRL_ExactJournal || '',
      jrlId: journal.JRL_Id,
      activeDate: formattedDate,  // Date de création du journal
      inactiveDate: formattedDate // Initialement la même date
    };
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
