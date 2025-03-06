import { Component, OnInit } from '@angular/core';
import { BrandService } from '../services/brand.service';
import {Brand} from '../Entities/brand/brand.module';
import {CommonModule} from '@angular/common';
import {CellTemplateDirective, ColumnComponent, GridComponent} from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  standalone: true,
  imports: [CommonModule, ColumnComponent, CellTemplateDirective, GridComponent], // Ajout
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.brandService.getBrands().subscribe(
      data => {
        console.log('Données reçues:', data);
        this.brands = data;
      },
      error => {
        console.error('Erreur lors de la récupération des marques:', error);
      }
    );
  }
}
