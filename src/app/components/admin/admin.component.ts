import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Global } from "../../modules/global";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  menu;
  users;
  userType;

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    public global: Global,
    private location: PlatformLocation
  ) {
    this.dbService.get("user", localStorage.getItem("id")).subscribe(data => {
      //console.log(data);
      this.userType = this.global.usertype = data[0].usertype;
      this.global.employeeName = data[0].employeeName;
    });

    this.location.onPopState(() => {
      setTimeout(() => {
        var path = this.router.url;
        this.router.navigate([path]);
      }, 100);
    });

    this.router.events.subscribe(event => {
      var url =
        event["url"] == undefined
          ? ""
          : event["url"].replace("/admin", "").split("/")[1];
      this.changeNavbar(url);
    });

    this.global.getPurchases();
    this.global.getItems();
    this.global.getUsers();
    this.global.getAgents();
    this.global.getPayments();
    this.global.getClients();
    this.global.getPDF();
  }

  ngOnInit() { }

  goTo(path) {
    //console.log(this.userType);
    this.userType = this.userType == undefined ? this.global.usertype : this.userType;
    if (
      path == "accounting" &&
      (this.userType == "Admin" || this.userType == "Accounting")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (
      path == "item" &&
      (this.userType == "Admin" ||
        this.userType == "Accounting" ||
        this.userType == "Purchasing" ||
        this.userType == "Marketing")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (
      path == "purchase" &&
      (this.userType == "Admin" ||
        this.userType == "Accounting" ||
        this.userType == "Purchasing" ||
        this.userType == "Marketing")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (
      path == "agent" &&
      (this.userType == "Admin" ||
        this.userType == "Accounting" ||
        this.userType == "Purchasing" ||
        this.userType == "Marketing")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (
      path == "clients" &&
      (this.userType == "Admin" ||
        this.userType == "Accounting" ||
        this.userType == "Purchasing" ||
        this.userType == "Marketing")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (
      path == "deliver" &&
      (this.userType == "Admin" || this.userType == "Purchasing")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (path == "documents" && this.userType == "Admin") {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (
      path == "reports" &&
      (this.userType == "Admin" || this.userType == "Accounting")
    ) {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else if (path == "user" && this.userType == "Admin") {
      this.router.navigate(["/admin/" + path]);
      this.menu = path;
    } else {
      alert("Your account has no privilege to access this menu!");
    }
  }

  goBack() {
    this.menu = "admin";
  }

  logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  changeNavbar(url) {
    if (url == "" || url == undefined || url == null) {
      this.menu = "admin";
    }

    if (url == "item") {
      this.menu = "item";
    }

    if (url == "deliver") {
      this.menu = "deliver";
    }

    if (url == "purchase") {
      this.menu = "purchase";
    }

    if (url == "clients") {
      this.menu = "clients";
    }

    if (url == "user") {
      this.menu = "user";
    }

    if (url == "agent") {
      this.menu = "agent";
    }

    if (url == "accounting") {
      this.menu = "accounting";
    }

    if (url == "documents") {
      this.menu = "documents";
    }

    if (url == "reports") {
      this.menu = "reports";
    }
  }
}
