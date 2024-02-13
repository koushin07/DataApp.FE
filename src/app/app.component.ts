import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Miko';

  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
    this.setCUrrentUser();
  }

  setCUrrentUser() {
    const userString = localStorage.getItem('user');

    if (!userString) {
      return;
    }
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
