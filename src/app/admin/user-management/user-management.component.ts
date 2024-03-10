import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_model/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit  {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>()
  availableRoles = [
    'Admin','Moderator','Member'
  ]

  constructor(private adminService: AdminService, private modelService: BsModalService) {}
  ngOnInit(): void {
    this.getUsersWithRoles()
  }

  getUsersWithRoles() {
    return this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    });
  }

  openRolesModal(user: User) { 

    /**
     * two ways to pass data to the modal
     * 1.) makeing ModalOptions and passing it to the bsModalRef
     * 2.) by accessing the modal ref itself 
     */
    
    // first option 
    // const initialState: ModalOptions = {
    //   initialState: {
    //     list: [
    //       'Do thing', 'another thing', 'other thing'
    //     ],
    //     title: 'Test modal'
    //   }
    // }
   
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selecredRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.modelService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next: (roles) => user.roles = roles
          })
        }
      }
    })
    // second option
    // this.bsModalRef.content!.closeBtnName ="close"
    
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}
