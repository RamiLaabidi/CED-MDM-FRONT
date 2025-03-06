import { Component } from '@angular/core';

import {NavbarComponent} from './navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {BrandComponent} from './brand/brand.component';
import {JournalFormComponent} from './journal-form/journal-form.component';
import {MainComponent} from './main/main.component';
import {ParentComponent} from './parent/parent.component';
import {JournalSettingsComponent} from './journal-settings/journal-settings.component';
import {FormJRLInfoComponent} from './form-jrlinfo/form-jrlinfo.component';
import {OneStepComponent} from './one-step/one-step.component';
import {JournalWizardComponent} from './journal-wizard/journal-wizard.component';
import {GeneralInformationComponent} from './general-information/general-information.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    BrandComponent,
    JournalFormComponent,
    MainComponent,
    ParentComponent,
    JournalSettingsComponent,
    FormJRLInfoComponent,
    OneStepComponent,
    JournalWizardComponent,
    GeneralInformationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
