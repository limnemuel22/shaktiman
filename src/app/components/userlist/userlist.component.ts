import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Global } from "../../modules/global";

@Component({
  selector: "app-userlist",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.css"]
})
export class UserlistComponent implements OnInit {
  users: any;
  form: FormGroup;
  search = "";
  filterby = "Name";
  caption = "Filter by:";
  field = "employeeName";
  messageClass;
  message;
  panelOpenState = false;

  constructor(
    private dbService: DatabaseService,
    public router: Router,
    public global: Global,
    private formbuilder: FormBuilder
  ) {
    this.createForm();
    this.users = this.global.users == null ? null : this.global.users;
    const getpurchase = setInterval(() => {
      this.users = this.global.users == null ? null : this.global.users;
      this.router.url != "/admin/purchase/purchase-list"
        ? clearInterval(getpurchase)
        : null;
    }, 1000);
  }

  ngOnInit() {
    this.caption;
  }

  createForm() {
    this.form = this.formbuilder.group({
      search: [""]
    });
  }

  filterBy(filter) {
    if (filter == "employeeName") {
      this.filterby = "Employee Name";
    }

    if (filter == "username") {
      this.filterby = "Username";
    }
    this.field = filter;
    this.caption = this.filterby;
  }

  searchPO() {
    if (this.search == "") {
      this.messageClass = "alert alert-danger";
      this.message = "Search field is empty!";
      setTimeout(() => {
        this.messageClass = "";
        this.message = "";
      }, 2000);
    } else {
      const input = {
        value: this.search,
        function: "searchAll",
        field: this.field
      };
      this.dbService.post(input).subscribe(data => {
        if (data.status !== "error") {
          this.users = data;
        } else {
          this.messageClass = "alert alert-danger";
          this.message = data.message;
          setTimeout(() => {
            this.messageClass = "";
            this.message = "";
          }, 2000);
        }
      });
    }
  }
}
