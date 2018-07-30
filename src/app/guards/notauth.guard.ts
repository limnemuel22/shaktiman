import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { DatabaseService } from "../services/database.service";

@Injectable()
export class NotAuthGuard implements CanActivate {
  redirectURL;

  constructor(private dbService: DatabaseService, private router: Router) {}

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.dbService.loggedIn()) {
      this.router.navigate(["/admin"]);
      return false;
    } else {
      return true;
    }
  }
}
