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
  username: string | null = '';

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {
    this._authService.currentUser$.subscribe(name => {
      this.username = name;
    });
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
