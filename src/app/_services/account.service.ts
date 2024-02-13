import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_model/user';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl + "Account";
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  
  constructor(private http: HttpClient) {}
  login(model: any) {
    return this.http.post<User>(this.baseUrl + '/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }


  register(model:any){
    return this.http.post<User>(this.baseUrl + '/register', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
         this.setCurrentUser(user)
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
