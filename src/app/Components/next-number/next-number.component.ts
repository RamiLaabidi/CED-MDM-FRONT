import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NextNumberService } from '../../services/next-number.service';
import { NextNumber} from '../../Entities/next-number/next-number.module';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import {
  SwitchComponent,
  TextAreaComponent,
  TextBoxComponent
} from '@progress/kendo-angular-inputs';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-next-number',
  standalone: true,
  imports: [
    DatePickerComponent,
    TextBoxComponent,
    TextAreaComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    SwitchComponent,

  ],
  templateUrl: './next-number.component.html',
  styleUrl: './next-number.component.css'
})
export class NextNumberComponent implements OnInit{
  nextNumberForm!: FormGroup;
  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormGroup>();
  formSaved: boolean = false; // Initialement désactivé



  constructor(private fb: FormBuilder, private nextNumberService: NextNumberService) {}


  ngOnInit() {
    this.initForm();


    // Désactive les champs au chargement si NEX_OurRef_EntryNumber est true
    if (this.nextNumberForm.get('NEX_OurRef_EntryNumber')?.value) {
      this.disableOurRefFields();
    }

    // Écoute les changements de la checkbox et active/désactive les champs en conséquence
    this.nextNumberForm.get('NEX_OurRef_EntryNumber')?.valueChanges.subscribe(value => {
      if (value) {
        this.disableOurRefFields();
      } else {
        this.enableOurRefFields();
      }
    });
  }
  // Fonction pour désactiver les champs OurRef
  private disableOurRefFields() {
    this.nextNumberForm.get('NEX_StartRangeOurRef')?.disable();
    this.nextNumberForm.get('NEX_EnRangeOurRef')?.disable();
    this.nextNumberForm.get('NEX_NumberOurRef')?.disable();
  }

// Fonction pour activer les champs OurRef
  private enableOurRefFields() {
    this.nextNumberForm.get('NEX_StartRangeOurRef')?.enable();
    this.nextNumberForm.get('NEX_EnRangeOurRef')?.enable();
    this.nextNumberForm.get('NEX_NumberOurRef')?.enable();
  }


  // Initialisation du formulaire
  private initForm() {
    this.nextNumberForm = this.fb.group({
      NEX_Name: [null, Validators.required],
      NEX_Description: [''],
      neX_Number: [null],
      NEX_StartRange: [null, [Validators.required, Validators.min(0)]],
      NEX_EndRange: [null, [Validators.required, Validators.min(0)]],
      NEX_StartDate: [null, Validators.required],
      NEX_EndDate: [null],
      NEX_CreatedDate: [new Date()],
      NEX_LastModifiedDate: [new Date()],
      NEX_LastModifiedBy: [''],
      NEX_StartRangeOurRef: [null],
      NEX_EnRangeOurRef: [null],
      NEX_NumberOurRef: [null],
      NEX_OurRef_EntryNumber: [true]
    });
  }

  // Charger un NextNumber par ID
  private loadNextNumber(id: number) {
    this.nextNumberService.getNextNumber(id).subscribe({
      next: (data) => {
        this.nextNumberForm.patchValue(data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du NextNumber:', err);
      }
    });
  }

  // Soumission du formulaire
  submitForm() {
    if (this.nextNumberForm.valid) {
      const formData: Partial<NextNumber> = { ...this.nextNumberForm.getRawValue() };

      // Suppression de NEX_Number pour permettre sa génération côté backend
      delete formData.neX_Number;

      console.log('Données envoyées:', formData);

      this.nextNumberService.addNextNumber(formData as NextNumber).subscribe({
        next: (response) => {
          console.log('NextNumber ajouté avec succès:', response);

          // Mise à jour du champ NEX_Number avec la valeur générée côté backend
          if (response.neX_Number !== undefined) {
            this.nextNumberForm.patchValue({ neX_Number: response.neX_Number });
          }
          this.nextNumberForm.disable();

        },
        error: (err) => {
          console.error("Erreur lors de l'ajout de NextNumber:", err);
        }
      });
      this.formSaved = true;  // Active le bouton Add NEX après la sauvegarde

    } else {
      console.warn('Formulaire invalide:', this.nextNumberForm.value);
    }
  }
  resetForm() {
    this.nextNumberForm.reset();  // Réinitialise le formulaire
    this.initForm(); // Réinitialise les valeurs par défaut
    this.nextNumberForm.enable(); // Réactive les champs
    this.formSaved = false; // Active "Save" et désactive "Add NEX"

  }

}
