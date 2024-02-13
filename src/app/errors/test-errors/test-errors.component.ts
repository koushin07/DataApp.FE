import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css',
})
export class TestErrorsComponent implements OnInit {
  baseUrl = 'http://localhost:5013/api';
  validationErrors: string[] = []
  constructor(private http: HttpClient) { }
  ngOnInit(): void { }

  get404Error() {
    this.http.get(this.baseUrl + '/Buggy/not-found').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }
  get400Error() {
    this.http.get(this.baseUrl + '/Buggy/bad-request').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }
  get500Error() {
    this.http.get(this.baseUrl + '/Buggy/server-error').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }
  get401Error() {
    this.http.get(this.baseUrl + "/Buggy/auth").subscribe({
      next: res => console.log(res),
      error: err => console.log(err),
      complete: () => console.log("complete"),
    })
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + "/Account/register", {}).subscribe({
      next: res => console.log(res),
      error: err => {
        console.log(err);
        this.validationErrors =err;
      },
      complete: () => console.log("complete"),
    })
  }
}
