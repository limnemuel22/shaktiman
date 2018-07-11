import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { DatabaseService } from "../services/database.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  redirectURL;
  data;

  constructor(private dbService: DatabaseService, private router: Router) {}

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.data = this.dbService.loggedIn().pipe(map(data => {
      if (data === true) {
        return true;
      } else {
        localStorage.clear();
        this.router.navigate([""]);
        return false;
      }
    })));
  }

  canActivateChild(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.data = this.dbService.loggedIn().pipe(map(data => {
      if (data === true) {
        return true;
      } else {
        localStorage.clear();
        this.router.navigate([""]);
        return false;
      }
    })));
  }
}
