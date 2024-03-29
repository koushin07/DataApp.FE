import { Member } from './../_model/member';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, of, take } from 'rxjs';
import { Photo } from '../_model/photo';
import { PaginatedResult } from '../_model/Pagination';
import { UserParams } from '../_model/userParams';
import { AccountService } from './account.service';
import { User } from '../_model/user';
import { getPaginatedResults, getPaginationHeaders } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseurl: string = environment.apiUrl
  members: Member[] = [];
  memberCache = new Map();
   user: User | undefined
   userParams: UserParams | undefined
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>

  constructor(private http: HttpClient, private accountService: AccountService) {
      accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        console.log(user);
        this.userParams = new UserParams(user);
        this.user = user;
      }
    });
   }

  getUserParams() {
    return this.userParams
  }

  setUserParams(params: UserParams) {
    this.userParams = params
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user)
      return this.userParams
    }
    return;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response) return of(response)
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);


    return getPaginatedResults<Member[]>(this.baseurl+"User", params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response)
        return response
      })
    )

  }

 

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) =>member.userName === username)
    // const member = this.members.find(x => x.userName === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseurl + "User/" + username)
  }

  updateMember(member: Member) {
    return this.http.put(this.baseurl+ "User", member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index] = { ...this.members[index], ...member }

      })
    )
  }

  uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file);
    return this.http.post<Photo>(this.baseurl + "User/add-photo", formData)
  }


  setMainPhoto(photoId: number) {
    return this.http.put(this.baseurl + "User/set-main-photo/" + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseurl}User/delete-photo/${photoId}`)
  }

  addLike(username: string) {
    return this.http.post(`${this.baseurl}Likes/${username}`,{})
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
  let params = getPaginationHeaders(pageNumber, pageSize)

    params = params.append('predicate', predicate)
    
    return getPaginatedResults<Member[]>(this.baseurl+ "Likes", params, this.http)
    // return this.http.get<Member[]>(`${this.baseurl}Likes?predicate=`+ predicate)
  }


}
