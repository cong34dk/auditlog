import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    const formData = this.loginForm.value;
    this._authService.login(formData).subscribe((res) => {
      console.log('Login successful', res);
      this._router.navigate(['/list']);
    }),
      (err: any) => {
        console.error('Login failed', err);
      };
    this.loginForm.reset();
  }

  goToRegister() {
    this._router.navigate(['/register']);
  }
}
