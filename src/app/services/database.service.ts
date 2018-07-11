import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment as envi } from '../../environments/environment';

@Injectable()
export class DatabaseService {
  token = localStorage.getItem('token');
  conn = envi.url;

  constructor(private http: Http) { }

  get(fun, id?) {
    this.token = localStorage.getItem('token');
    const url = id !== undefined ? this.conn + '?function=' + fun + '&token=' + this.token + '&id=' + id :
      this.conn + '?function=' + fun + '&token=' + this.token;
    return this.http.get(url).map(res => this.check(res), err => err.json());
  }

  post(data) {
    return this.http.post(this.conn, { data: data, token: this.token }).map(res => this.check(res), err => err.json());
  }

  getPDF(val?) {
    if (val !== null || val !== undefined) {
      return this.http.get('./assets/pdf/' + val + '.json').map(res => res.json());
    }
    return this.http.get('./assets/pdf/pdf.json').map(res => res.json());
  }

  loggedIn() {
    const data = {
      function: 'checkLogin',
      User: localStorage.getItem('user'),
      Token: localStorage.getItem('token')
    };

    return this.http.post(this.conn, { data: data, token: localStorage.getItem('token') }).map(res => this.check(res), err => err.json());
  }

  userLogin(data) {
    return this.http.post(this.conn, { data: data }).map(res => this.check(res), err => err.json());
  }

  check(res) {
    res !== null ? null : console.log(res);
    return res !== null ? res.json() : {};
  }

}
