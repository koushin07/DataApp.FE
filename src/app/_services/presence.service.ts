import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_model/user';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection
  private onlineUsersSource= new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();


  constructor(private toastr: ToastrService) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + "presence", {
      accessTokenFactory: ( )=>user.token
    })
      .withAutomaticReconnect()
    .build()

    this.hubConnection.start().catch(err => console.log(err))
    this.hubConnection.on("UserIsOnline", username => {
      console.log("fire at socket " + username);
      this.toastr.info(`${username} has connected`)
    })

    this.hubConnection.on("UserIsOffline", username => {
      this.toastr.warning(`${username} has disconnected`)
    })
    this.hubConnection.on("GetOnlineUsers", usernames => {
      this.onlineUsersSource.next(usernames)
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(err=>console.log(err))
  }
  
}
