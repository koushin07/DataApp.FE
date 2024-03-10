import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent implements OnInit {
  username = '';
  availableRoles: any[] = [];
  selectRoles: any[] = [];

  constructor(public bsModalRef: BsModalRef){}
  ngOnInit(): void {

  }

  updateChecked(checkValue: string) {
    const index = this.selectRoles.indexOf(checkValue);
    
    index !== -1 ? this.selectRoles.splice(index, 1) : this.selectRoles.push(checkValue);
    
  }

}
