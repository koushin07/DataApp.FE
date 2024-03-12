import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild, type OnInit } from '@angular/core';
import { Message } from '../../_model/message';
import { MessageService } from '../../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
  imports: [CommonModule, TimeagoModule, FormsModule]
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() username?: string
  
  messageContent = ''

  constructor(public messageService: MessageService){}
  ngOnInit(): void {
   
  }
  
  sendMessage() {
    console.log(`${this.username} thi is the username`);
    if(!this.username) return
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset()
    })
  }



}
