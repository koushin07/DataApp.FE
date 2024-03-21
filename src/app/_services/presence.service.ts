import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_model/user';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection
  private onlineUsersSource= new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();


  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + "presence", {
      accessTokenFactory: ( )=>user.token
    })
      .withAutomaticReconnect()
    .build()

    this.hubConnection.start().catch(err => console.log(err))
    this.hubConnection.on("UserIsOnline", username => {
      this.onlineUsers$.pipe(take(1))
        .subscribe(usernames => this.onlineUsersSource.next([...usernames, username]))
      // this.toastr.info(`${username} has connected`)
    })

    this.hubConnection.on("UserIsOffline", username => {
      this.onlineUsers$.pipe(take(1))
        .subscribe(usernames => this.onlineUsersSource.next(usernames.filter(u=>u !== username)))
      // this.toastr.warning(`${username} has disconnected`)
    })

    this.hubConnection.on("GetOnlineUsers", usernames => {
      this.onlineUsersSource.next(usernames)
    })

    this.hubConnection.on("NewMessageReceived", ({ username, knownAs }) => {
      this.toastr.info(`${knownAs} has send a new message! Click here to see it.`)
        .onTap
        .pipe(take(1)).subscribe({
        next: () =>this.router.navigateByUrl(`/members/${username}?tab=Message`)
      })
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(err=>console.log(err))
  }
  
}
