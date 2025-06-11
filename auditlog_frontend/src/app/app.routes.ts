import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product/list/product-list.component';
import { ProductEditComponent } from './components/product/edit/product-edit.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent},
    { path: 'create', component: ProductEditComponent},
    { path: 'edit/:id', component: ProductEditComponent},
];
