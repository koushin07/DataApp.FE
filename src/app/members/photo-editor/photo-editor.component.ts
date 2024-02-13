import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_model/member';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MembersService } from '../../_services/members.service';
import { Photo } from '../../_model/photo';
import { User } from '../../_model/user';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined
  img: string | undefined
  file: File | undefined
  user: User | undefined

  constructor(private toastr: ToastrService, private http: HttpClient, private memberService: MembersService, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  ngOnInit(): void {
  }

  fileUploading(event: any) {

    console.log(event.files[0]);
    const ext: string | undefined = event.files[0].name.split('.').pop()

    if (event.files[0]) {
      console.log('object');
      if (ext) {
        console.log('object1');
        if (!['png', 'jpg', 'jpeg'].includes(ext.toLocaleLowerCase())) {
          console.log('object2');
          this.toastr.error("Invalid file type")
          return;
        }
      } else {
        this.toastr.error("Invalid file type")
        return;
      }

      this.img = URL.createObjectURL(event.files[0])
      this.file = event.files[0];
    }
  }

  uploadFile() {

    if (this.file) {

      this.memberService.uploadFile(this.file).subscribe(photo => {
        if (this.member) {

          this.member.photos.push(photo)
          this.toastr.success("Successfully uploaded")
        }
      })
    }
  }

  setMainPhoto(photo: Photo) {
    if (this.member) {
      this.memberService.setMainPhoto(photo.id).subscribe({
        next: () => {
          if (this.user && this.member) {
            this.user.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user)
            this.member.photoUrl = photo.url;
            this.member.photos.forEach(p => {
              if (p.isMain) p.isMain = false;
              if (p.id == photo.id) p.isMain = true
            })
          }

        },
        complete: () => this.toastr.success("Successfully set as main photo")
      })
    }
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(p => p.id !== photoId)
        }
      },
      complete: () => this.toastr.success("Successfully deleted the photo")
    })
  }



}
