import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../services/auditlog/auditlog.service';
import { AuditLog } from '../../models/auditlog';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auditlog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditlog.component.html',
  styleUrl: './auditlog.component.css'
})
export class AuditLogComponent implements OnInit {
  data: AuditLog[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecord: number = 0;
  pageSize: number = 10;
  searchTerm: string = '';
  objectKeys = Object.keys;
  
  constructor(private _auditlogService: AuditLogService , private _router: Router, private _authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(page: number = 1): void {
    this._auditlogService.getAuditLogs(this.searchTerm, page, this.pageSize).subscribe((res: any) => {
      this.data = res.data.map((item: AuditLog) => {
        return {
          ...item,
          parsedOldValues: item.oldValues ? JSON.parse(item.oldValues) : null,
          parsedNewValues: item.newValues ? JSON.parse(item.newValues) : null
        };
      })
      this.currentPage = res.currentPage;
      this.totalPages = res.totalPages;
      this.totalRecord = res.totalRecord;
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadData();
  }
}
