import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product/list/product-list.component';
import { ProductEditComponent } from './components/product/edit/product-edit.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuditLogComponent } from './components/auditlog/auditlog.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'list', component: ProductListComponent },
            { path: 'create', component: ProductEditComponent },
            { path: 'edit/:id', component: ProductEditComponent },
            { path: 'auditlog', component: AuditLogComponent }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
