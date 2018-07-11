import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Global } from "../../modules/global";
import { Router } from "@angular/router";
import { Data } from "../../model/schema";
import * as jsPDF from "jspdf";

@Component({
  selector: "app-paymentlist",
  templateUrl: "./paymentlist.component.html",
  styleUrls: ["./paymentlist.component.css"]
})
export class PaymentlistComponent implements OnInit {
  payments: any;
  form: FormGroup;
  search = "";
  filterby = "Filter by:";
  field = "client.`clientName`";
  messageClass;
  message;
  discountedSiPdf;
  previousBal;
  constructor(
    private dbService: DatabaseService,
    public global: Global,
    public router: Router,
    private formbuilder: FormBuilder
  ) {
    this.createForm();

    this.payments = this.global.payments == null ? null : this.global.payments;
    const interval = setInterval(() => {
      this.payments =
        this.global.payments == null ? null : this.global.payments;
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
    switch (filter) {
      case "payment.`id`":
        this.filterby = "S.I. Number";
        break;
      case "payment.`amount`":
        this.filterby = "Amount";
        break;
      case "`purchase`.`id`":
        this.filterby = "D.R. No.";
        break;
      case "client.`clientName`":
        this.filterby = "Client";
        break;
      case "agent.`agentName`":
        this.filterby = "Agent";
        break;
      case "payment.`drDate`":
        this.filterby = "Date";
        break;
    }
    this.field = filter;
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
        function: "searchPayment",
        field: this.field
      };

      this.dbService.post(input).subscribe((data: Data) => {
        if (data.status !== "error") {
          this.payments = data;
        } else {
          this.messageClass = "alert alert-danger";
          this.message = data.message;
          this.payments = [];
          setTimeout(() => {
            this.messageClass = "";
            this.message = "";
          }, 2000);
        }
      });
    }
  }

  getSiPdf(id) {
    const pay = this.payments.filter(p => p.SI === id);
    const total = pay[0].price;
    const discount = Number(pay[0].discount.replace(/,/g, "").split(".")[0]);
    const payment = Number(pay[0].amount.replace(/,/g, "").split(".")[0]);
    const balance = Number(pay[0].balance.replace(/,/g, "").split(".")[0]);

    this.previousBal =
      discount > 0
        ? (payment + balance)
            .toLocaleString("en-us", { minimumFractionDigits: 2 })
            .toString()
        : (payment + balance)
            .toLocaleString("en-us", { minimumFractionDigits: 2 })
            .toString();

    this.dbService.get("siPDF", id).subscribe(data => {
      this.downLoadPDF(data);
    });
  }

  downLoadPDF(data) {
    const doc = new jsPDF();

    const discount = data[0].discount === "0" ? "0.00" : data[0].discount;
    const discountedPrice = data[0].discountedPrice;
    const amount = data[0].amount;
    const balance = data[0].balance;
    const previousBal = this.previousBal;

    const username = data.id;
    const imgData = this.global.pdf["discountedSiPdf"];
    doc.addImage(imgData, "JPEG", 0, 0, 210, 300);
    doc.setFontSize(11);
    doc.setFontStyle("Arial");

    const siNumber = data.id;
    const clientName = data.clientName.toUpperCase();
    const clientAddress = data.clientAddress;
    const siDate = data.date;
    const approved = data.approved;
    const recieved = clientName;
    const idNo = username;
    const date = username;
    const issued = username;
    let engineNo = username;
    let chasis = username;
    let description = username;
    const proccessBy = data.proccessBy;
    let qty;
    let serial;
    let total = 0;
    let unitPrice = 0;
    let subTotal = 0;
    let itemSpacing = 0;
    let endItem = 120;
    let count = 0;
    let start = 110;
    const pageHeight = doc.internal.pageSize.height;
    let engineNumbers;
    const addBottom = 2;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        // console.log(element["price"]);
        if (element["quantity"] !== undefined) {
          const chunks: any[] = [];
          const num = 30;
          const itemstart = start;
          const space = 5;

          // description = element["description"];
          qty = element["quantity"];
          serial = element["serial"];
          engineNo = element["engine"];
          chasis = element["chasis"];
          engineNumbers = serial + "/" + engineNo + "/" + chasis;
          description = element["description"];
          unitPrice = Number(element["price"]);
          subTotal = Number(qty) * unitPrice;
          total += subTotal;
          count++;

          doc.text(13, start, count.toString(), "center");
          doc.text(23, start, qty);
          for (
            let i = 0, charsLength = engineNumbers.length;
            i < charsLength;
            i += num
          ) {
            // chunks.push(engineNumbers.substring(i, i + num));
            doc.text(45, start, engineNumbers.substring(i, 12), "center");
          }

          doc.text(
            147,
            start,
            Number(unitPrice)
              .toLocaleString("en-us", { minimumFractionDigits: 2 })
              .toString(),
            "center"
          );
          doc.text(
            180,
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
            doc.text(62, start, chunks[i]);
            start += space;
            endItem = start;
          }
        }
      }
    }

    itemSpacing = 5;
    endItem += itemSpacing;

    if (endItem < 225) {
      doc.text(62, start, "******* NOTHING FOLLOWS *******");
    }

    doc.text(60, 71, siNumber);
    doc.text(60, 76, clientName);
    doc.text(60, 81.5, clientAddress);
    doc.text(155, 71, siDate);
    doc.text(155, 76, proccessBy);
    doc.text(35, 263, approved.toUpperCase(), "center");
    doc.text(180, 263, recieved, "center");
    doc.setTextColor(255, 0, 0);

    // total || Total Amount
    doc.text(
      195,
      discount === "" ? 240 : 218 + addBottom,
      Number(total)
        .toLocaleString("en-us", { minimumFractionDigits: 2 })
        .toString(),
      "right"
    );

    // discount
    doc.text(
      195,
      223 + addBottom,
      Number(discount)
        .toLocaleString("en-us", { minimumFractionDigits: 2 })
        .toString(),
      "right"
    );

    // previousBal || Remaining Bal
    doc.text(195, 230, previousBal, "right");

    // Payment
    doc.text(
      195,
      232 + addBottom,
      Number(amount)
        .toLocaleString("en-us", { minimumFractionDigits: 2 })
        .toString(),
      "right"
    );

    // Balance
    doc.text(
      195,
      238 + addBottom,
      Number(balance)
        .toLocaleString("en-us", { minimumFractionDigits: 2 })
        .toString(),
      "right"
    );

    doc.save("SI" + "-" + siNumber + "(" + siDate + ").pdf");
  }
}
