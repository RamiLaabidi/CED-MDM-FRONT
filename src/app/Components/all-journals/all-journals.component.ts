import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Journal} from '../../Entities/journal/journal.module';
import {JournalService} from '../../services/journal.service';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {CellTemplateDirective, ColumnComponent, GridComponent} from '@progress/kendo-angular-grid';
import {FormsModule} from '@angular/forms';
import {SwitchComponent} from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-all-journals',
  standalone: true,
  imports: [
    ButtonComponent,
    ColumnComponent,
    FormsModule,
    GridComponent,
    CellTemplateDirective,
    SwitchComponent
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
      journal.jrL_Id?.includes(this.searchTerm)
    );
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/journals', id]);
  }

  addJournal(): void {
    this.router.navigate(['/JRL']);
  }


}
