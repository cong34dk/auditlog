import { Component, OnInit } from '@angular/core';
import { ProductDto } from '../../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  model: ProductDto = { name: '', price: 0, description: '' };
  isEditMode: boolean = false;
  id: number =0;

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this._route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEditMode = true;
      this._productService.getById(this.id).subscribe((res: any) => {
        this.model = {
          name: res.name,
          price: res.price,
          description: res.description
        }
      });
    }
  }

  save(): void {
    if (this.isEditMode) {
      this._productService.update(this.id, this.model).subscribe(() => {
        this._router.navigate(['/list']);
      });
    } else {
      this._productService.create(this.model).subscribe(() => {
        this._router.navigate(['/list']);
      });
    }
  }

  goBack(): void {
    this._router.navigate(['/list']);
  }
}
