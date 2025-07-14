import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  fullName: string | null = '';
  avatarUrl: string | null = '';

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {
    this._authService.fullName$.subscribe(name => {
      this.fullName = name;
    });

    this._authService.avatarUrl$.subscribe(url => {
      this.avatarUrl = url;
    });
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
