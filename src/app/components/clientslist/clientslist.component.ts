import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "../../services/global.service";
import { Router } from "@angular/router";
import { Data } from "../../model/schema";

@Component({
  selector: "app-clientslist",
  templateUrl: "./clientslist.component.html",
  styleUrls: ["./clientslist.component.css"]
})
export class ClientslistComponent implements OnInit {
  clients;
  form: FormGroup;
  search = "";
  filterby = "Name";
  caption = "Filter by:";
  field = "clientName";
  userType;
  messageClass;
  message;
  noData = "No Data Found";

  constructor(
    private dbService: DatabaseService,
    public global: GlobalService,
    public router: Router,
    private formbuilder: FormBuilder
  ) {
    this.createForm();

    this.clients = this.global.clients === null ? null : this.global.clients;
    const interval = setInterval(() => {
      this.clients = this.global.clients === null ? null : this.global.clients;
      if (this.router.url !== "/admin/clients/clients-list") {
        clearInterval(interval);
      }
    }, 1000);
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      search: [""]
    });
  }

  filterBy(filter) {
    if (filter === "clientName") {
      this.filterby = "Name";
    }

    if (filter === "clientAddress") {
      this.filterby = "Address";
    }
    this.field = filter;
    this.caption = this.filterby;
  }

  searchPO() {
    if (this.search === "") {
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
      // console.log(input);
      this.dbService.post(input).subscribe((data: Data) => {
        // console.log(data);
        if (data.status !== "error") {
          // console.log(this.transactions);
          this.clients = data;
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
