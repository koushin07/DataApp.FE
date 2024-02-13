import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../_model/member';
import { map, of } from 'rxjs';
import { Photo } from '../_model/photo';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseurl: string = environment.apiUrl + "User"
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers() {
    if (this.members.length > 0) return of(this.members)
    return this.http.get<Member[]>(this.baseurl).pipe(
      map((members: Member[]) => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseurl + "/" + username)
  }

  updateMember(member: Member) {
    return this.http.put(this.baseurl, member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index] = { ...this.members[index], ...member }

      })
    )
  }

  uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file);
    return this.http.post<Photo>(this.baseurl + "/add-photo", formData)
  }


  setMainPhoto(photoId: number) {
    return this.http.put(this.baseurl + "/set-main-photo/" + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseurl}/delete-photo/${photoId}`)
  }


}
