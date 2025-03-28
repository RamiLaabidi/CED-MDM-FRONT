import { Routes } from '@angular/router';
import {MainComponent} from './Components/main/main.component';
import {AddGeneralLedgerComponent} from './Components/add-general-ledger/add-general-ledger.component';
import {AllGeneralLedgersComponent} from './Components/all-general-ledgers/all-general-ledgers.component';
import {UpdateGeneralLedgerComponent} from './Components/update-general-ledger/update-general-ledger.component';
import {UpdateJournalComponent} from './Components/update-journal/update-journal.component';
import {AllJournalsComponent} from './Components/all-journals/all-journals.component';
import {ParentUpdateJRLComponent} from './Components/parent-update-jrl/parent-update-jrl.component';
import {NavbarComponent} from './navbar/navbar.component';
import {AllJournalSettingsComponent} from './Components/all-journal-settings/all-journal-settings.component';
import {JournalSettingUpdateComponent} from './Components/journal-setting-update/journal-setting-update.component';


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
    component: UpdateGeneralLedgerComponent
  },

  { path: 'journals',
    component: AllJournalsComponent
  },
  { path: 'journals/:id',
    component: UpdateJournalComponent
  },
  { path: 'journalSettings',
    component: AllJournalSettingsComponent
  },
  { path: 'journal-setting/:id',
    component: JournalSettingUpdateComponent
  },






];
