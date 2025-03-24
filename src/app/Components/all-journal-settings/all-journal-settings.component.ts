import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JournalSetting} from '../../Entities/journal-setting/journal-setting.module';
import {JournalSettingService} from '../../services/journal-setting.service';
import {CellTemplateDirective, ColumnComponent, GridComponent} from '@progress/kendo-angular-grid';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-all-journal-settings',
  standalone: true,
  imports: [

    CellTemplateDirective,
    ColumnComponent,
    GridComponent,
    FormsModule,
  ],
  templateUrl: './all-journal-settings.component.html',
  styleUrl: './all-journal-settings.component.css'
})
export class AllJournalSettingsComponent implements OnInit {
  searchTerm: string = '';
  journalSettings: JournalSetting[] = [];


  constructor(private journalSettingService: JournalSettingService , private router: Router) {}

  ngOnInit(): void {
    this.loadJournalSettings();
  }

  loadJournalSettings(): void {
    this.journalSettingService.getAll().subscribe({
      next: (data) => {
        this.journalSettings = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des Journals', err);
      }
    });
  }

  get filteredJournals(): JournalSetting[] {
    return this.journalSettings.filter((journal) =>
      journal.jlS_Journal_Id?.includes(this.searchTerm) ||
      journal.jlS_Id?.includes(this.searchTerm)

    );
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/journal-setting', id]);
  }




}
