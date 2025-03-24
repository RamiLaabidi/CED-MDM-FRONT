import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { GeneralLedgerService } from '../../services/general-ledger.service';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import {SwitchComponent, TextAreaComponent, TextBoxComponent} from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-add-general-ledger',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,

    SwitchComponent,
    TextAreaComponent,
    TextBoxComponent,

  ],
  templateUrl: './add-general-ledger.component.html',
  styleUrls: ['./add-general-ledger.component.css']
})
export class AddGeneralLedgerComponent implements OnInit {
  generalLedgerInfo = {
    GL_Id: '',
    GL_CreatedDate: '',
    GL_LastModifiedDate: ''

  };

  generalLedgerForm!: FormGroup;
  errorMessage: string = '';
  isSaved = false;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private generalLedgerService: GeneralLedgerService) {}

  ngOnInit(): void {
    const today = new Date();
    this.generalLedgerForm = this.fb.group({
      GL_ExactAdministration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      GL_ExactGeneralLedger: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      GL_Description: ['', [Validators.maxLength(30)]],
      GL_Inactive: [false],
      GL_IsSuspenseAccount: [false],
      GL_IsPrimaryProcess: [false],
      GL_IsProfitLossAccount: [false],
      GL_CreatedDate: [today],
      GL_LastModifiedDate: [today]
    });
  }

  submitForm(): void {
    if (this.generalLedgerForm.valid) {
      const formValues = this.generalLedgerForm.value;
      if (!formValues.GL_ExactAdministration || !formValues.GL_ExactGeneralLedger) {
        this.errorMessage = "GL_ExactAdministration et GL_ExactGeneralLedger sont obligatoires.";
        return;
      }
      const GL_Id = `${formValues.GL_ExactAdministration}-${formValues.GL_ExactGeneralLedger}`.toUpperCase();
      const now = new Date();
      const generalLedgerData = {
        ...formValues,
        GL_Id,
        GL_LastModifiedDate: now,
        GL_CreatedDate: now
      };
      this.subscription.add(
        this.generalLedgerService.createGL(generalLedgerData).subscribe({
          next: (response) => {
            console.log('General Ledger created successfully', response);
            this.isSaved = true;
            this.errorMessage = '';
            this.generalLedgerInfo = {
              GL_Id: generalLedgerData.GL_Id,
              GL_CreatedDate:this.formatDate(generalLedgerData.GL_CreatedDate),
              GL_LastModifiedDate:  this.formatDate(generalLedgerData.GL_LastModifiedDate)
            };
            this.generalLedgerForm.disable();

          },
          error: (error) => {
            console.error('Error creating General Ledger:', error);
            this.errorMessage = 'Failed to create General Ledger. Please try again.';
          }
        })
      );
    } else {
      this.generalLedgerForm.markAllAsTouched();
    }
  }
  private formatDate(date: string | Date | null): string {
    if (!date) return '';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';

    return parsedDate.toLocaleDateString('fr-FR');
  }

}
