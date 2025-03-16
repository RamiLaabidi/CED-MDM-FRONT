import { Routes } from '@angular/router';
import {MainComponent} from './Components/main/main.component';
import {AddGeneralLedgerComponent} from './Components/add-general-ledger/add-general-ledger.component';
import {AllGeneralLedgersComponent} from './Components/all-general-ledgers/all-general-ledgers.component';
import {UpdateGeneralLedgerComponent} from './Components/update-general-ledger/update-general-ledger.component';


export const routes: Routes = [
  { path: '',
    redirectTo: 'JRL',
    pathMatch: 'full'
  },
  { path: 'JRL',
    component: MainComponent
  },
  { path: 'GL',
    component: AddGeneralLedgerComponent
  },
  { path: 'GLs',
    component: AllGeneralLedgersComponent
  },
  { path: 'general-ledgers/:id',
    component: UpdateGeneralLedgerComponent }
];
