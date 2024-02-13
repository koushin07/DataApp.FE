import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_model/member';
import { User } from '../../_model/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true
    }
  }
  member: Member | undefined;
  user: User | undefined;

  ngOnInit(): void {
    this.loadMember()
  }

  constructor(private accountService: AccountService, private membersService: MembersService, private toastr: ToastrService) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }


  loadMember() {
    if (!this.user) return;
    this.membersService.getMember(this.user.username).subscribe({
      next: member => {
        this.member = member;
      }
    })
  }

  updateMember() {
    this.membersService.updateMember(this.editForm?.value).subscribe(_ => {
      this.toastr.success("Profile successfully updated")
      this.editForm?.reset(this.member)
    })
  }

}
