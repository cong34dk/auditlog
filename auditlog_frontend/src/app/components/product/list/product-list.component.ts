import { ProductService } from './../../../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  
  constructor(private _productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts() {
    this._productService.getProducts().subscribe((res: any) => {
      this.products = res.products;
    });
  }

  goToCreate(): void {
    this.router.navigate(['/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Xác nhận xóa sản phẩm này?')) {
      this._productService.delete(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
