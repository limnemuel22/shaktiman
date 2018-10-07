import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "../../services/global.service";
import { Router } from "@angular/router";
declare const $;

@Component({
  selector: "app-discount",
  templateUrl: "./discount.component.html",
  styleUrls: ["./discount.component.css"]
})
export class DiscountComponent implements OnInit {
  purchases: any;
  form: FormGroup;
  search = "";
  filterby = "Item Name";
  caption = "Filter by:";
  field = "client.`clientName`";
  data = false;
  messageClass;
  message;
  discounted = false;
  noData = "No Data Found";

  constructor(
    private dbService: DatabaseService,
    public global: GlobalService,
    public router: Router,
    private formbuilder: FormBuilder
  ) {
    this.createForm();
    this.purchases =
      this.global.purchases === undefined ? null : this.global.purchases;
    const interval = setInterval(() => {
      this.purchases =
        this.global.purchases === undefined ? null : this.global.purchases;

      if (this.purchases !== undefined) {
        if (this.search.length <= 0) {
          this.purchases = this.purchases
            .filter(p => Number(p.discount.replace(/,/g, "")) <= 0)
            .filter(p => p.price !== p.balance);
        }
      }
      if (this.router.url !== "/admin/accounting/discount") {
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
        function: "searchPurchase",
        field: this.field
      };

      console.log(input);
      this.dbService.post(input).subscribe((data: any) => {
        if (data.status !== "error") {
          for (const p of data) {
            p.discount = Number(p.discount).toLocaleString("en-us", {
              minimumFractionDigits: 2
            });
            p.price = Number(p.price).toLocaleString("en-us", {
              minimumFractionDigits: 2
            });
          }
          this.global.purchases = this.purchases = data;
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

  filterBy(filter) {
    if (filter === "client.`clientName`") {
      this.filterby = "Client Name";
    }

    if (filter === "purchase.`id`") {
      this.filterby = "D.R. Number";
    }

    if (filter === "purchase.`drDate`") {
      this.filterby = "Date Purchase";
    }

    if (filter === "agent.`agentName`") {
      this.filterby = "Agent";
    }

    this.field = filter;
    this.caption = this.filterby;
  }
}
