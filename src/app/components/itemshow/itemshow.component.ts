import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Item, Delivery } from "../../model/schema";
import * as jsPDF from "jspdf";

@Component({
  selector: "app-itemshow",
  templateUrl: "./itemshow.component.html",
  styleUrls: ["./itemshow.component.css"]
})
export class ItemshowComponent implements OnInit {
  transactions: any;
  transaction: Item;
  delivery: Delivery;
  id = this.route.snapshot.params["id"];
  form: FormGroup;
  textarea = true;
  token = localStorage.getItem("token");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private formbuilder: FormBuilder
  ) {
    this.createForm();
    this.getItem();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      name: [""],
      dtPO: [""],
      POnumber: [""],
      endUser: [""],
      purpose: [""],
      amount: [""]
    });
  }

  getItem() {
    this.dbService.get("item", this.id).subscribe(data => {
      this.transaction = data[0];
    });

    this.dbService.get("delivery", this.id).subscribe((data: any) => {
      this.delivery = data;
    });

    this.dbService.get("itemSale", this.id).subscribe(data => {
      this.transactions = data;
    });
  }

  goBack() {
    this.router.navigate(["/admin/item/item-list"]);
  }

  downLoadPDF() {
    this.dbService.getPDF("pdf").subscribe(data => {
      this.getItemDetailsPDF(data["itemDetails"]);
    });
  }

  getItemDetailsPDF(img) {
    const doc = new jsPDF();
    doc.addImage(img, "JPEG", 0, 0, 210, 300);

    doc.setFontSize(12);
    doc.setFontStyle("Arial");

    const date = "";
    const itemName = this.transaction.name;
    const stocks = this.transaction.stocks;
    const model = this.transaction.model;
    const Price = this.transaction.price;
    const descripton = this.transaction.description;

    doc.text(174, 53.5, date);
    doc.text(35, 52, itemName);
    doc.text(35, 58, stocks);
    doc.text(35, 63, model);
    doc.text(35, 67.7, Price);
    doc.text(35, 72.8, descripton);

    let start = 95;
    const space = 7;

    for (const key in this.delivery) {
      if (this.delivery.hasOwnProperty(key)) {
        const element = this.delivery[key];
        const deliveryDate = element.deliveryDate;
        const batchNo = element.batch;
        const serialNo = element.serialNo;
        const referenceNo = element.refNo;
        const chasisNo = element.chasis;
        const engineNo = element.engine;
        const supplier = element.supplier;

        doc.text(12, start, deliveryDate);
        doc.text(42, start, batchNo);
        doc.text(58, start, serialNo);
        doc.text(92, start, referenceNo);
        doc.text(120, start, chasisNo);
        doc.text(145, start, engineNo);
        doc.text(175, start, supplier);
        start += space;
      }
    }

    doc.save(itemName + ".pdf");
  }
}
