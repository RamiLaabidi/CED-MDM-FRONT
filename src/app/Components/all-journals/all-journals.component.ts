import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Journal} from '../../Entities/journal/journal.module';
import {JournalService} from '../../services/journal.service';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {ColumnComponent, GridComponent} from '@progress/kendo-angular-grid';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-all-journals',
  standalone: true,
  imports: [
    ButtonComponent,
    ColumnComponent,
    FormsModule,
    GridComponent
  ],
  templateUrl: './all-journals.component.html',
  styleUrl: './all-journals.component.css'
})
export class AllJournalsComponent implements OnInit {
  searchTerm: string = '';
  journals: Journal[] = [];


  constructor(private journalService: JournalService , private router: Router) {}

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getAllJournals().subscribe({
      next: (data) => {
        this.journals = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des Journals', err);
      }
    });
  }

  get filteredJournals(): Journal[] {
    return this.journals.filter((journal) =>
      journal.JRL_Id?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      journal.jrL_JournalType_Id?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onRowSelect(event: any): void {
    const selectedJournal: Journal = event.selectedRows[0].dataItem;
      this.router.navigate(['/journals', selectedJournal.JRL_Id]);
  }

}
