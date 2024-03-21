import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_model/member';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_model/message';
import { PresenceService } from '../../_services/presence.service';
import { User } from '../../_model/user';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
  imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs? :TabsetComponent
  member: Member  = {} as Member
  images: GalleryItem[] = []
  activeTab?: TabDirective;
  messages: Message[] = []
  user?: User;

  constructor(private accountService: AccountService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService
  ) { 
    accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.user = user
      }
    })
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection()
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member'] //si member sa data[] kay makita sa route
    })


    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    })
     this.getImages()
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data
    console.log(`this is the headings = ${this.activeTab.heading} and this is the user ${this.user}`);
    if (this.activeTab.heading === 'Message' && this.user) {
      console.log("hub connection starting...");
      this.messageService.createHubConnection(this.user, this.member.userName)
      console.log("hub connection started");
    } else {
      this.messageService.stopHubConnection()
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
    this.memberTabs.tabs.find(x =>x.heading === heading)!.active = true;    
    }
  }

    loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (response)=> this.messages = response
      })
    }
  }

  getImages() {
    if (!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
    }

  }
}
