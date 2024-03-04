import { Component } from '@angular/core';
import { Member } from '../_model/member';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {
  members: Member[] | undefined
  predicate = 'liked'

  constructor(private memberService: MembersService){}

  loadLikes() {
    this.memberService.getLikes(this.predicate).subscribe({
      next: response => this.members = response
    })
  }
}
