import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment as envi } from "../../environments/environment";

@Injectable()
export class DatabaseService {
  token = localStorage.getItem("token");
  conn = envi.url;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  get(fun, id?) {
    this.token = localStorage.getItem("token");
    const url =
      id !== undefined
        ? this.conn + "?function=" + fun + "&token=" + this.token + "&id=" + id
        : this.conn + "?function=" + fun + "&token=" + this.token;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  post(data) {
    return this.http
      .post(this.conn, { data: data, token: this.token })
      .pipe(catchError(this.handleError));
  }

  getPDF(val?) {
    if (val !== null || val !== undefined) {
      return this.http
        .get("./assets/pdf/" + val + ".json")
        .pipe(catchError(this.handleError));
    }
    return this.http
      .get("./assets/pdf/pdf.json")
      .pipe(catchError(this.handleError));
  }

  loggedIn() {
    const data = {
      function: "checkLogin",
      User: localStorage.getItem("user"),
      Token: localStorage.getItem("token")
    };

    return this.http
      .post(this.conn, { data: data, token: localStorage.getItem("token") })
      .pipe(catchError(this.handleError));
  }

  userLogin(data) {
    return this.http
      .post(this.conn, { data: data })
      .pipe(catchError(this.handleError));
  }

  check(res) {
    return res !== null ? res.json() : {};
  }
}
