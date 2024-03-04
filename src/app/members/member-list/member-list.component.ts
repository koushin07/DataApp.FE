import { Component, OnInit } from '@angular/core';
import { Member } from '../../_model/member';
import { MembersService } from '../../_services/members.service';
import { Observable, take } from 'rxjs';
import { Pagination } from '../../_model/Pagination';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { UserParams } from '../../_model/userParams';
import { User } from '../../_model/user';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  genderList = [{ value: "male", display: 'Males' }, { value: "female", display: "Females" }]

  constructor(private membersService: MembersService) {
    this.userParams = membersService.getUserParams()
  }
  ngOnInit(): void {
    // this.members$ = this.membersService.getMembers()
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.membersService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        },
      });
    }
  }

  resetFilters() {
    this.userParams = this.membersService.resetUserParams()
    this.loadMembers()
  }

  pageChanged(event: PageChangedEvent) {
    if (this.userParams && this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.membersService.setUserParams(this.userParams)
      this.loadMembers();
    }
  }
}
