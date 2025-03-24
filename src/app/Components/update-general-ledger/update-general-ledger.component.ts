import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneralLedger } from '../../Entities/general-ledger/general-ledger.module';
import { GeneralLedgerService } from '../../services/general-ledger.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SwitchComponent, TextAreaComponent, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { ButtonComponent } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-update-general-ledger',
  standalone: true,
  imports: [
    TextBoxComponent,
    ReactiveFormsModule,
    DatePipe,
    SwitchComponent,
    TextAreaComponent,
    ButtonComponent,
    CommonModule
  ],
  templateUrl: './update-general-ledger.component.html',
  styleUrl: './update-general-ledger.component.css' // ✅ Correction ici
})
export class UpdateGeneralLedgerComponent implements OnInit {
  generalLedgerInfo!: GeneralLedger;
  generalLedgerForm!: FormGroup;
  glId!: string;
  isSaved = false;
  errorMessage = '';
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private generalLedgerService: GeneralLedgerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.glId = this.route.snapshot.paramMap.get('id')!;

    this.generalLedgerForm = this.fb.group({
      gL_ExactAdministration: [''],
      gL_ExactGeneralLedger: [''],
      gL_Description: [''],
      gL_Inactive: [false],
      gL_IsSuspenseAccount: [false],
      gL_IsPrimaryProcess: [false],
      gL_IsProfitLossAccount: [false],
      gL_CreatedDate: [null],
      gL_LastModifiedDate: [null]
    });

    this.loadGeneralLedger();
  }

  loadGeneralLedger(): void {
    this.generalLedgerService.getById(this.glId).subscribe({
      next: (data) => {
        this.generalLedgerInfo = data;
        this.initForm();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du General Ledger', err);
        this.errorMessage = "Impossible de charger les données du General Ledger.";
      }
    });
  }


  initForm(): void {
    if (!this.generalLedgerInfo) return;

    this.generalLedgerForm = this.fb.group({
      gL_ExactAdministration: [this.generalLedgerInfo.gL_ExactAdministration || ''],
      gL_ExactGeneralLedger: [this.generalLedgerInfo.gL_ExactGeneralLedger || ''],
      gL_Description: [this.generalLedgerInfo.gL_Description || ''],
      gL_Inactive: [this.generalLedgerInfo.gL_Inactive ],
      gL_IsSuspenseAccount: [this.generalLedgerInfo.gL_IsSuspenseAccount ],
      gL_IsPrimaryProcess: [this.generalLedgerInfo.gL_IsPrimaryProcess ],
      gL_IsProfitLossAccount: [this.generalLedgerInfo.gL_IsProfitLossAccount ],
      gL_CreatedDate: [this.generalLedgerInfo.gL_CreatedDate ? new Date(this.generalLedgerInfo.gL_CreatedDate) : null],
      gL_LastModifiedDate: [this.generalLedgerInfo.gL_LastModifiedDate ? new Date(this.generalLedgerInfo.gL_LastModifiedDate) : null]
    });

    this.generalLedgerForm.disable();
  }

  enableEditing(): void {
    this.isEditing = true;
    this.generalLedgerForm.enable();
    this.generalLedgerForm.get('gL_ExactGeneralLedger')?.disable();
    this.generalLedgerForm.get('gL_ExactAdministration')?.disable();
    this.generalLedgerForm.get('gL_CreatedDate')?.disable();
    this.generalLedgerForm.get('gL_LastModifiedDate')?.disable();

  }

  submitForm(): void {
    if (this.generalLedgerForm.valid) {
      const updatedData = {
        ...this.generalLedgerInfo,
        ...this.generalLedgerForm.value,
        gL_LastModifiedDate: new Date()

      };

      this.generalLedgerService.updateGL(this.glId, updatedData).subscribe({
        next: () => {
          this.isSaved = true;
          this.isEditing = false;
          this.generalLedgerForm.disable();
          console.log("General Ledger mis à jour avec succès !");

          this.loadGeneralLedger();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour :", err);
          this.errorMessage = "Une erreur est survenue lors de la mise à jour.";
        }
      });
    }
  }
}
