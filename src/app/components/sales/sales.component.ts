import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as jsPDF from "jspdf";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent implements OnInit {
  purchases: any;
  form: FormGroup;
  yearFilter = "Year";
  monthFilter = "Month";
  search = "";
  userType;
  messageClass;
  message;
  generate = false;
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  Months = {
    January: [1],
    February: [2],
    March: [3],
    April: [4],
    May: [5],
    June: [6],
    July: [7],
    August: [8],
    September: [9],
    October: [10],
    November: [11],
    December: [12]
  };
  years: any = [];

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder
  ) {
    this.createForm();
    this.genYears();
  }

  ngOnInit() { }

  genYears() {
    var val = 1999;
    for (var i = 0; i <= 50; i++) {
      val++;
      this.years.push(val);
    }
  }

  createForm() {
    this.form = this.formbuilder.group({
      search: [""]
    });
  }

  filterBy(filter, value) {
    if (filter == "Month") {
      this.monthFilter = value;
    }

    if (filter == "Year") {
      this.yearFilter = value;
    }
  }

  getPurchases() {
    
    if (this.monthFilter != "Month" && this.yearFilter != "Year") {
      var month;
      if (this.Months[this.monthFilter][0] < 10) {
        month = "0" + String(this.Months[this.monthFilter][0]);
      } else {
        month = String(this.Months[this.monthFilter][0]);
      }
      var date = {
        function: "sales",
        month: month,
        year: this.yearFilter
      };

      this.dbService.post(date).subscribe(data => {

        var row: any = [];
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var element = data[key];
            var price = Number(element.price);
            var disc = Number(element.discount);
            var disc5 = Number(element.discountPercent);
            data[key].price = Number(element.price).toLocaleString("en-us", {
              minimumFractionDigits: 2
            });
            data[key].discount = Number(element.discount).toLocaleString(
              "en-us",
              { minimumFractionDigits: 2 }
            );
            data[key].discountPercent = Number(
              element.discountPercent
            ).toLocaleString("en-us", { minimumFractionDigits: 2 });
            data[key].balance = Number(element.balance).toLocaleString(
              "en-us",
              { minimumFractionDigits: 2 }
            );
            data[key].commission = Number(element.commission).toLocaleString(
              "en-us",
              { minimumFractionDigits: 2 }
            );
            data[key].downpayment = Number("0").toLocaleString("en-us", {
              minimumFractionDigits: 2
            });
            data[key].amount = Number(price - disc - disc5).toLocaleString(
              "en-us",
              { minimumFractionDigits: 2 }
            );
          }
        }

        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var element = data[key];
            var date = element.drDate.split("/");
            var month = "";
            //console.log(date[0]+" "+date[2]);

            if (this.Months[this.monthFilter][0] < 10) {
              month = "0" + String(this.Months[this.monthFilter][0]);
            } else {
              month = String(this.Months[this.monthFilter][0]);
            }

            if (month == date[0] && this.yearFilter == date[2]) {
              row.push(data[key]);
            }
          }
        }

        //console.log(month+ " " + this.yearFilter);
        if (row.length > 0) {
          this.generate = true;
        } else {
          this.messageClass = "alert alert-danger";
          this.message = "No sales found in this date!";
          setTimeout(() => {
            this.messageClass = "";
            this.message = "";
          }, 2000);
          this.generate = false;
        }

        this.purchases = row;

      });


    } else {
      if (this.monthFilter == "Month") {
        this.messageClass = "alert alert-danger";
        this.message = "Month is empty!";
        setTimeout(() => {
          this.messageClass = "";
          this.message = "";
        }, 2000);
      } else {
        if (this.yearFilter == "Year") {
          this.messageClass = "alert alert-danger";
          this.message = "Year is empty!";
          setTimeout(() => {
            this.messageClass = "";
            this.message = "";
          }, 2000);
        }
      }
    }
  }

  // print sales report

  print() {
    if (this.generate == false) {
      this.messageClass = "alert alert-danger";
      this.message = "Please generate sales first before printing!";
      setTimeout(() => {
        this.messageClass = "";
        this.message = "";
      }, 2000);
    } else {
      this.downLoadPDF();
    }
  }

  downLoadPDF() {
    this.dbService.getPDF('pdf').subscribe(data => {
      this.getSalesReportPDF(data["salesReportPDF"]);
    });
  }

  getSalesReportPDF(imageData) {
    const doc = new jsPDF("landscape");

    var pageHeight = doc.internal.pageSize.height;
    //console.log(this.purchases);

    doc.addImage(imageData, "JPEG", -1, 0, 300, 210);
    doc.setFontSize(14);
    doc.setFontStyle("Arial");
    var date = this.monthFilter + "-" + this.yearFilter;
    doc.text(246, 22, date);

    var orderDate;
    var particular;
    var client;
    var price;
    var discount;
    var amount;
    var discountPercent;
    var DP;
    var RemainingBal;
    var commission;
    var remarks;
    doc.setFontSize(10);
    var qty;
    var start = 55;
    var spacing = 5;
    var space = 5;
    var count = 1;
    var counts;

    for (var key in this.purchases) {
      if (this.purchases.hasOwnProperty(key)) {
        var element = this.purchases[key];
        orderDate = element.drDate;
        particular = element.items;
        client = element.clientName;
        price = element.price;
        discount = element.discount;
        amount = element.amount;
        discountPercent = element.discountPercent;
        DP = element.downpayment;
        RemainingBal = element.balance;
        commission = element.commission;
        remarks = element.remarks;
        qty = element.qty;
        counts = Number(count++);
        //console.log(counts);
        counts = counts.toString();
        doc.text(12, start, counts, "center");
        doc.text(26, start, orderDate, "center");
        doc.text(43, start, qty, "center");
        doc.text(112, start, price, "center");
        doc.text(138, start, discount, "center");
        doc.text(159, start, amount, "center");
        doc.text(190, start, DP, "center");
        doc.text(217, start, RemainingBal, "center");
        doc.text(253, start, commission, "center");
        doc.text(271, start, remarks);

        var chunks: any = [];
        var num = 24;

        for (
          var i = 0, charsLength = particular.length;
          i < charsLength;
          i += num
        ) {
          chunks.push(particular.substring(i, i + num));
        }

        for (var i = 0; i < chunks.length; i += 1) {
          doc.text(50, start, chunks[i]);
          start += space;
        }

        doc.text(50, start, client);
        start += 5;
        start += spacing;

        if (start >= pageHeight - 10) {
          doc.addPage();
          doc.addImage(imageData, "JPEG", -1, 0, 300, 210);
          doc.setFontSize(14);
          doc.setFontStyle("Arial");
          var date = this.monthFilter + "-" + this.yearFilter;
          doc.text(250, 22, date, "center");
          doc.setFontSize(10);
          start = 55; // Restart height position
        }
      }
    }

    doc.save(this.monthFilter + "-" + this.yearFilter + ".pdf");
  }
}
