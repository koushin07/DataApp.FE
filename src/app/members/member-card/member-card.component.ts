import { Component, OnInit, Input } from '@angular/core';
import { Member } from '../../_model/member';
import { MembersService } from '../../_services/members.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: _ => this.toastr.success(`You Like ${member.knownAs}`)
    })
  }
}
