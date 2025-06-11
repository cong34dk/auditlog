import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductDto } from '../../models/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(search: string = '', page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize);
      return this.http.get(`${this.apiUrl}/product/get`, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/GetById?id=${id}`);
  }

  create(product: ProductDto): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/Create`, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product/Update?id=${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/Delete?id=${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/DeleteAll`);
  }
}
