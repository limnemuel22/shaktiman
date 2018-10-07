import { Component, OnInit, ViewChild } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as jsPDF from "jspdf";
import { GlobalService } from "../../services/global.service";
import { Router } from "@angular/router";
import { Data } from "../../model/schema";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";

@Component({
  selector: "app-itemlist",
  templateUrl: "./itemlist.component.html",
  styleUrls: ["./itemlist.component.css"]
})
export class ItemlistComponent implements OnInit {
  items: any;
  form: FormGroup;
  search = "";
  filterby = "Item Name";
  caption = "Filter by:";
  field = "name";
  userType;
  messageClass;
  message;
  data: Object;
  noData = "No Date Found";
  itemListPDF;

  panelOpenState = false;
  hasLoaded = false;
  dataSource;
  displayedColumns = [
    "no",
    "name",
    "stocks",
    "price",
    "itemcode",
    "description",
    "action"
  ];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(
    private dbService: DatabaseService,
    public global: GlobalService,
    public router: Router,
    private formbuilder: FormBuilder
  ) {
    this.createForm();
    this.items = this.global.items === null ? null : this.global.items;
    const getitems = setInterval(() => {
      this.items = this.global.items === null ? null : this.global.items;
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (this.router.url !== "/admin/item/item-list") {
        clearInterval(getitems);
      }
    }, 1000);
    /*  console.log(this.dataSource);
    console.log(getitems); */
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      search: [""]
    });
  }

  filterBy(filter) {
    if (filter === "name") {
      this.filterby = "Item Name";
    }

    if (filter === "price") {
      this.filterby = "Price";
    }

    if (filter === "itemcode") {
      this.filterby = "Item Code";
    }

    if (filter === "stocks") {
      this.filterby = "Stocks";
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
        table: "item"
      };
      // console.log(input);
      this.dbService.post(input).subscribe((data: Data) => {
        console.log(input);
        if (data.status !== "error") {
          // console.log(this.transactions);
          this.items = this.global.items = data;
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

  downLoadPDF() {
    this.dbService.getPDF("pdf").subscribe(data => {
      this.getItemListPDF(data["itemList"]);
    });
  }

  getItemListPDF(imageData) {
    const doc = new jsPDF();
    doc.addImage(imageData, "JPEG", 0, 0, 210, 300);
    doc.setFontSize(11);
    doc.setFontStyle("Arial");

    let itemName;
    let stocks;
    let price;
    let itemCode;
    let description;
    let start = 65;
    const spacing = 5;
    let count = 0;
    const pageHeight = doc.internal.pageSize.height;
    for (const key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        const element = this.items[key];
        itemName = element.name;
        stocks = element.stocks;
        price = element.price;
        itemCode = element.itemcode;
        description = element.description;
        count++;

        let chunks: string[] = [];
        let itemstart = start;
        let num = 24;
        const space = 4;

        for (
          let i = 0, charsLength = itemName.length;
          i < charsLength;
          i += num
        ) {
          chunks.push(itemName.substring(i, i + num));
        }

        for (let i = 0; i < chunks.length; i += 1) {
          doc.text(18, itemstart, chunks[i]);
          itemstart += space;
        }

        chunks = [];
        itemstart = start;
        num = 9;

        for (
          let i = 0, charsLength = itemCode.length;
          i < charsLength;
          i += num
        ) {
          chunks.push(itemCode.substring(i, i + num));
        }

        for (let i = 0; i < chunks.length; i += 1) {
          doc.text(107, itemstart, chunks[i]);
          itemstart += space;
        }

        chunks = [];
        itemstart = start;
        num = 35;

        for (
          let i = 0, charsLength = description.length;
          i < charsLength;
          i += num
        ) {
          chunks.push(description.substring(i, i + num));
        }

        for (let i = 0; i < chunks.length; i += 1) {
          doc.text(136, itemstart, chunks[i]);
          itemstart += space;
        }

        doc.text(11, start, count.toString(), "center");
        doc.text(73, start, stocks);
        doc.text(85, start, price);

        start = itemstart;
        start += spacing;

        if (start >= pageHeight - 10) {
          doc.addPage();
          doc.addImage(imageData, "JPEG", 0, 0, 210, 300);
          doc.setFontSize(11);
          doc.setFontStyle("Arial");
          start = 65; // Restart height position
        }
      }
    }
    doc.text(
      20,
      start,
      "*********************************** Nothing Follows ***********************************"
    );
    doc.save("Item-List.pdf");
  }
}
