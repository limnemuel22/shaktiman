import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "../../services/global.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-agentlist",
  templateUrl: "./agentlist.component.html",
  styleUrls: ["./agentlist.component.css"]
})
export class AgentlistComponent implements OnInit {
  agents: any;
  form: FormGroup;
  search = "";
  filterby = "Name";
  caption = "Filter by:";
  field = "agentName";
  userType;
  messageClass;
  message;
  constructor(
    private dbService: DatabaseService,
    public global: GlobalService,
    public router: Router,
    private formbuilder: FormBuilder
  ) {
    this.createForm();

    this.agents = this.global.agents === null ? null : this.global.agents;
    const interval = setInterval(() => {
      this.agents = this.global.agents === null ? null : this.global.agents;
      if (this.router.url !== "/admin/accounting/payment-list") {
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
    if (filter === "agentName") {
      this.filterby = "Name";
    }

    if (filter === "agentAddress") {
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
        field: this.field,
        table: "agent"
      };

      this.dbService.post(input).subscribe((data: any) => {
        if (data.status !== "error") {
          this.agents = data;
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
