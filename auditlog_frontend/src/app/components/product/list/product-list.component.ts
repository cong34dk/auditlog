import { ProductService } from './../../../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

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
  
  selectedFile: File | null = null;
  
  constructor(private _productService: ProductService, private _router: Router, private _notification: ToastrService) {}

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

  downloadTemplate() {
    this._productService.downloadTemplate().subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'ProductTemplate.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    })
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onImportTemplate(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this._productService.importTemplate(formData).subscribe({
      next: (res: any) => {
        this._notification.success(`Đã nhập ${res.count} sản phẩm thành công!`, 'Thành công');
        this.loadProducts();
      },
      error: () => {
        this._notification.error('Lỗi khi nhập file!', 'Lỗi');
      }
    })
  }

  // Xuất file excel
  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sản phẩm': worksheet },
      SheetNames: ['Sản phẩm']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileName = 'DanhSachSanPham.xlsx';
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(data, fileName);
  }
}
