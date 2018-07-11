import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Purchase } from "../../model/schema";

@Component({
  selector: "app-purchaseshow",
  templateUrl: "./purchaseshow.component.html",
  styleUrls: ["./purchaseshow.component.css"]
})
export class PurchaseshowComponent implements OnInit {
  form: FormGroup;
  messageClass;
  message = false;
  id = this.route.snapshot.params["id"];
  data;
  totalPayment;
  counter;
  total;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private formbuilder: FormBuilder
  ) {
    const data = {
      id: "",
      drNumber: "",
      drDate: "",
      amount: "",
      approved: "",
      received: ""
    };
    this.getInvoice();
  }

  ngOnInit() { }

  getInvoice() {

    this.dbService.get("drDetails", this.id).subscribe(data => {

      if (data[0].id != null) {
        this.message = true;
        this.data = data;
        this.data[0].amount = Number(data[0].amount).toLocaleString("en-us", {minimumFractionDigits: 2});
        this.total = Number(data[0].total).toLocaleString("en-us", {minimumFractionDigits: 2});
      }
    });
  }

  goBack() {
    this.router.navigate(["/admin/purchase/purchase-list"]);
  }
}
