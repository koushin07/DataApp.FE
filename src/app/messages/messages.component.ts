import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_model/Pagination';
import { MessageService } from '../_services/message.service';
import { Message } from '../_model/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit  {
  messages: Message[] | undefined
  pagination: Pagination | undefined;
  container = "Inbox";
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService) { }
  
  ngOnInit(): void {
    this.loadMessages()
  
  }

  loadMessages() {
    this.loading  =true
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: (response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
       
      },
       complete: () =>  this.loading = false
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: ()=> this.messages?.splice(this.messages.findIndex(m =>m.messageId === id))
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages()
    }
  }
}
