import { ProductService } from './../../../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecord: number = 0;
  pageSize: number = 10;
  searchTerm: string = '';
  
  constructor(private _productService: ProductService, private _router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(page: number = 1): void {
    this._productService.getProducts(this.searchTerm, page, this.pageSize).subscribe((res: any) => {
      this.products = res.products;
      this.currentPage = res.currentPage;
      this.totalPages = res.totalPages;
      this.totalRecord = res.totalRecord;
    });
  }

  goToCreate(): void {
    this._router.navigate(['/create']);
  }

  goToEdit(id: number): void {
    this._router.navigate(['/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Xác nhận xóa sản phẩm này?')) {
      this._productService.delete(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts(page);
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }
}
