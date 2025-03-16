import {Component, OnInit} from '@angular/core';
import {GeneralLedger} from '../../Entities/general-ledger/general-ledger.module';
import {GeneralLedgerService} from '../../services/general-ledger.service';
import {ColumnComponent, GridComponent} from '@progress/kendo-angular-grid';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
  selector: 'app-all-general-ledgers',
  standalone: true,
  imports: [
    GridComponent,
    ColumnComponent,
    ButtonComponent,
    FormsModule,
  ],
  templateUrl: './all-general-ledgers.component.html',
  styleUrl: './all-general-ledgers.component.css'
})
export class AllGeneralLedgersComponent implements OnInit {
  searchTerm: string = '';
  generalLedgers: GeneralLedger[] = [];


  constructor(private generalLedgerService: GeneralLedgerService , private router: Router) {}

  ngOnInit(): void {
    this.loadGeneralLedgers();
  }

  loadGeneralLedgers(): void {
    this.generalLedgerService.getAllGeneralLedgers().subscribe({
      next: (data) => {
        this.generalLedgers = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des General Ledgers', err);
      }
    });
  }

  get filteredGeneralLedgers(): GeneralLedger[] {
    return this.generalLedgers.filter((ledger) =>
      ledger.gL_Id?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ledger.gL_Description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onRowSelect(event: any): void {
    const selectedLedger: GeneralLedger = event.selectedRows[0].dataItem;
    this.router.navigate(['/general-ledgers', selectedLedger.gL_Id]);
  }

}
