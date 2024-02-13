import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../_model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl("/members"),
     
      complete: () => this.toastr.success('Successfully Sign in', 'Success'),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/")
    this.toastr.success('Logout Successfully');
  }
}
