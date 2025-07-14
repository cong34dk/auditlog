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
import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _socialAuthService: SocialAuthService
  ) {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this._socialAuthService.authState.subscribe((user: SocialUser | null) => {
      if (user) {
        console.log('Google user:', user);
        const idToken = user.idToken;

        this._authService.googleLogin(idToken).subscribe({
          next: () => {
            this._router.navigate(['/list']);
          },
          error: (err) => {
            alert(err.message || 'Google login failed');
          }
        });
      }
    })
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    const formData = this.loginForm.value;
    this._authService.login(formData).subscribe({
      next: () => {
      this._router.navigate(['/list']);
      },
      error: (err) => {
        alert(err.message || 'Đăng nhập thất bại');
      }
    });
    this.loginForm.reset();
  }

  goToRegister() {
    this._router.navigate(['/register']);
  }
}
