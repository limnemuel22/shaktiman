import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as jsPDF from "jspdf";
import { Global } from "../../modules/global";
import { Router } from "@angular/router";
import { Data } from "../../model/schema";
declare const $;

@Component({
  selector: "app-purchaselist",
  templateUrl: "./purchaselist.component.html",
  styleUrls: ["./purchaselist.component.css"]
})
export class PurchaselistComponent implements OnInit {
  purchases;
  form: FormGroup;
  search = "";
  filterby = "Name";
  caption = "Filter by:";
  field = "client.`clientName`";
  data = false;
  messageClass;
  message;
  discountedDr;
  noData = "No Data Found";
  purchasedIsLoaded = false;

  constructor(
    private dbService: DatabaseService,
    public global: Global,
    public router: Router,
    private formbuilder: FormBuilder
  ) {
    this.createForm();
    this.purchases =
      this.global.purchases === null ? null : this.global.purchases;
    const getpurchase = setInterval(() => {
      this.purchases =
        this.global.purchases === null ? null : this.global.purchases;
      if (this.router.url !== "/admin/purchase/purchase-list") {
        clearInterval(getpurchase);
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
      this.dbService.post(input).subscribe((data: Data) => {
        if (data.status !== "error") {
          this.purchases = data;
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

  getDrPdf(id) {
    this.dbService.get("drPDF", id).subscribe((data: Data) => {
      if (data.status === undefined) {
        this.downLoadPDF(data.id, this.global.pdf["drPDF"], data);
      }
    });
  }

  downLoadPDF(val, image, data) {
    const items = data;
    const drNumber = val;
    let serial;
    const clientName = data.clientName;
    const clientAddress = data.clientAddress;
    const drDate = data.date;
    let qty;
    let engineNo = "";
    let description = "";
    let unitPrice = 0;
    let subTotal;
    let total = 0;
    const approved = data.approved;
    const recieved = clientName;
    const processedBy = data.processedBy;
    const discount = data[0].discount === "0" ? "" : data[0].discount;
    const discountedPrice =
      data[0].discount === "0" ? "" : data[0].discountedPrice;
    let count = 0;
    const comments = data.comments;
    const doc = new jsPDF();
    const imgData =
      data[0].discount === "0" ? image : this.global.pdf["discountedDrPdf"];
    doc.addImage(imgData, "JPEG", 0, 0, 210, 300);
    doc.setFontSize(11);
    doc.setFontStyle("Arial");

    const space = 5;
    let itemSpacing = 0;
    let start = 115;
    const endItem = 125;

    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const element = items[key];

        if (element["drDate"] !== undefined) {
          const chunks: any = [];
          const num = 25;
          description = element["description"];
          serial = element["serial"];
          qty = element["quantity"];
          engineNo = element["engine"] + " / " + element["chasis"];
          description = element["description"];
          unitPrice = Number(element["price"]);
          count++;
          subTotal = Number(qty) * unitPrice;
          total += subTotal;

          doc.text(13, start, count.toString(), "center");
          doc.text(23, start, qty, "center");
          doc.text(29, start, engineNo);
          doc.text(29, start + 5, serial);
          doc.text(
            145,
            start,
            Number(unitPrice)
              .toLocaleString("en-us", { minimumFractionDigits: 2 })
              .toString(),
            "center"
          );
          doc.text(
            183,
            start,
            Number(subTotal)
              .toLocaleString("en-us", { minimumFractionDigits: 2 })
              .toString(),
            "center"
          );

          for (
            let i = 0, charsLength = description.length;
            i < charsLength;
            i += num
          ) {
            chunks.push(description.substring(i, i + num));
          }

          for (let i = 0; i < chunks.length; i += 1) {
            doc.text(63, start, chunks[i]);
            start += space;
          }

          itemSpacing = 5;
          start += itemSpacing;
          //  count += 1;
        }
      }
    }

    if (start < 240) {
      doc.text(
        20,
        start,
        "*********************************** Nothing Follows ***********************************"
      );
    }

    doc.text(60, 75, drNumber);
    doc.text(60, 80, clientName.toUpperCase());
    doc.text(60, 85, clientAddress);
    doc.text(155, 75, drDate);
    doc.text(155, 80, processedBy);
    doc.text(20, 230, comments);
    doc.setTextColor(255, 0, 0);
    doc.text(
      200,
      discount === "" ? 215 : 202,
      Number(total)
        .toLocaleString("en-us", { minimumFractionDigits: 2 })
        .toString(),
      "right"
    );
    doc.text(
      200,
      207,
      discount === ""
        ? ""
        : Number(discount)
            .toLocaleString("en-us", { minimumFractionDigits: 2 })
            .toString(),
      "right"
    );
    doc.text(
      200,
      discount === "" ? 202 : 215,
      discountedPrice === ""
        ? ""
        : Number(discountedPrice)
            .toLocaleString("en-us", { minimumFractionDigits: 2 })
            .toString(),
      "right"
    );
    doc.setTextColor(0, 0, 0);
    doc.text(13, 275, approved.toUpperCase());
    doc.text(178, 275, recieved.toUpperCase(), "center");
    doc.save("DR" + "-" + drNumber + "(" + drDate + ").pdf");
  }
}
