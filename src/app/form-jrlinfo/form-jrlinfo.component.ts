import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { SwitchComponent, TextAreaComponent, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { JournalService } from '../services/journal.service';
import { Journal } from '../Entities/journal/journal.module';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LegalEntityTypeService } from '../services/legal-entity-type.service';
import { JournalTypeService } from '../services/journal-type.service';
import { LegalEntityService } from '../services/legal-entity.service';

@Component({
  selector: 'app-form-jrlinfo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextBoxComponent,
    ButtonsModule,
    SwitchComponent,
    TextAreaComponent,
    DropDownListComponent,
  ],
  templateUrl: './form-jrlinfo.component.html',
  styleUrl: './form-jrlinfo.component.css'
})
export class FormJRLInfoComponent implements OnInit {
  @Output() journalCreated = new EventEmitter<Journal>();
  @Output() next = new EventEmitter<FormGroup>(); // Événement pour passer à l'étape suivante
  //@Output() journalCreated = new EventEmitter<Journal>();


  nextStep() {

      this.next.emit(this.journalForm); // Émettre les valeurs du formulaire

  }

  journalForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  legalEntities: any[] = []; // Stocker les entités légales
  journalTypes: any[] = [];
  //isSaved = false; // Indique si le journal a été sauvegardé avec succès

  constructor(
    private fb: FormBuilder,
    private journalService: JournalService,
    private legalEntityService: LegalEntityTypeService,
    private journalTypeService: JournalTypeService,
    private legalEntityTwoService: LegalEntityService
  ) {}

  ngOnInit(): void {
    this.journalForm = this.fb.group({
      JRL_Id: [''],
      JRL_Abbreviation: ['', Validators.required],
      JRL_Description: ['', [Validators.maxLength(30)]],
      currencyCode: ['', Validators.required],
      JRL_JournalType_Id: ['', Validators.required],
      JRL_GeneralLedger_Id: ['', Validators.required],
      JRL_BankAccount_Id: ['', Validators.required],
      JRL_LegalEntity_Id: ['', Validators.required],
      JRL_ExactAdministration: ['', Validators.required],
      JRL_ExactJournal: ['', Validators.required],
      JRL_Inactive: [false]
    });

    this.loadLegalEntities();
    this.loadJournalTypes();

    // Mise à jour automatique du code devise lors du changement de Legal Entity
    this.journalForm.get('JRL_LegalEntity_Id')?.valueChanges.subscribe(selectedId => {
      const selectedEntity = this.legalEntities.find(entity => entity.lE_Id === selectedId);
      if (selectedEntity) {
        this.legalEntityTwoService.getCurrencyCode(selectedEntity.leT_ShortName, selectedEntity.leT_LongName)
          .subscribe({
            next: (response) => {
              console.log("Données reçues :", response); // Vérifie la structure des données
              this.journalForm.patchValue({ currencyCode: response.currencyCode }); // Utilisation correcte de currencyCode
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur lors de la récupération du code devise', error);
              // Ici, tu pourrais ajouter une gestion des erreurs plus visible pour l'utilisateur
            }
          });
      }
    });

  }


  private loadLegalEntities(): void {
    this.legalEntityService.getInactiveLegalEntityTypes().subscribe({
      next: (data) => {
        this.legalEntities = data.flatMap(entity =>
          entity.legalEntities?.map(le => ({
            lE_Id: le.lE_Id,
            leT_ShortName: entity.leT_ShortName,
            leT_LongName: entity.leT_LongName,
            nomComplet: `${entity.leT_ShortName ?? 'Nom court manquant'} - ${entity.leT_LongName ?? 'Nom long manquant'}`
          })) || []
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des entités légales', error);
      }
    });
  }

  private loadJournalTypes(): void {
    this.journalTypeService.getAllJournalTypes().subscribe({
      next: (data) => {
        this.journalTypes = data.map(journal => ({ jrT_Id: journal.jrT_Id }));
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur chargement Journal Types', error);
      }
    })

  }

  submitForm(): void {
    if (this.journalForm.valid) {
      this.errorMessage = '';
      this.isSubmitting = true;

      let journalData = this.journalForm.value as Journal;
      journalData.JRL_Id = `${journalData.JRL_ExactAdministration}-${journalData.JRL_ExactJournal}`;

      this.journalService.createJournal(journalData).subscribe({
        next: () => {
          alert('Journal créé avec succès !');
          this.journalCreated.emit(journalData);
          //this.journalForm.reset();
          this.isSubmitting = false;
         // this.isSaved = true;  // ✅ Activation du bouton Next
          this.journalForm.disable(); // Désactiver tous les champs après sauvegarde

        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.title || 'Une erreur est survenue.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
}
