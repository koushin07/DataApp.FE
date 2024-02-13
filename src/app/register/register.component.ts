import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {}

  constructor(private accountService: AccountService, private toastr: ToastrService) {
    
  }


  ngOnInit(): void {
  }


  register(){
    this.accountService.register(this.model).subscribe({
      next: response=>{
        console.log(response);
        this.toastr.success(`${this.model.username} Successfully Registered`)
      },
      error: err=> this.toastr.error(err.error.errors.title),
      complete: () =>this.cancel(),
    })
  }

  cancel(){
    this.cancelRegister.emit(false)
  }

}
