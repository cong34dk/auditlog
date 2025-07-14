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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.registerForm = this._formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.passwordsMatchValidator,});
  }

  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (!this.registerForm.valid) return;

    const { fullname, username, password } = this.registerForm.value;
    const payload = { fullname, username, password };
    this._authService.register(payload).subscribe(
      (res) => {
        console.log('Registration successful', res);
        this._router.navigate(['/login']);
      },
      (err: any) => {
        console.error('Registration failed', err);
      }
    )
    this.registerForm.reset();
  }

  goToLogin() {
    this._router.navigate(['/login']);
  }
}
