import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Collection } from '../../models/collection';
import { CollectionService } from '../../services/collection/collection.service';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css'
})
export class CollectionListComponent implements OnInit {

  collections: Collection[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecord: number = 0;
  pageSize: number = 10;
  searchTerm: string = '';
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  
  constructor(private _collectionService: CollectionService, private _router: Router, private _notification: ToastrService) {}

  ngOnInit(): void {
    this.loadCollections();
  }
  
  loadCollections(page: number = 1): void {
    this._collectionService.getCollections(this.searchTerm, page, this.pageSize).subscribe((res: any) => {
      this.collections = res.data;
      this.currentPage = res.currentPage;
      this.totalPages = res.totalPages;
      this.totalRecord = res.totalRecord;
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCollections(page);
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCollections();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadCollections();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this._notification.error('Vui lòng chọn tệp hình ảnh hợp lệ (JPEG, PNG, GIF)', 'Lỗi');
      return;
    }

    this.selectedFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this._notification.warning('Vui lòng chọn ảnh để tải lên', 'Cảnh báo');
      return;
    }
    else {
      this._collectionService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this._notification.success('Ảnh đã được tải lên thành công', 'Thành công');
          this.previewUrl = null;
          this.selectedFile = null;
          this.loadCollections();
        },
        error: (err) => {
          this._notification.error('Tải ảnh lên thất bại', 'Lỗi');
        }
      })
    }
  }
}
