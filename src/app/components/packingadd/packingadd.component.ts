import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PackingList } from "../../model/schema";
import { Image } from "../../model/base64";
import { Router } from "@angular/router";
import * as jsPDF from "jspdf";

@Component({
  selector: "app-packingadd",
  templateUrl: "./packingadd.component.html",
  styleUrls: ["./packingadd.component.css"]
})
export class PackingaddComponent implements OnInit {
  processing = false;
  model = new PackingList();
  form: FormGroup;
  message;
  messageClass;
  userInvalid = false;
  total;
  items: any = [];
  messageClassItem;
  messageItem;
  base64 = new Image();

  totalweight;
  totalmeasurement;

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
    this.createModel();
  }

  ngOnInit() {}

  createModel() {
    if (this.items.length == 0) {
      const value = {
        quantity: "No data",
        description: "No data",
        weight: "No data",
        measurement: "No data",
        totalweight: "No data",
        totalmeasurement: "No data"
      };
      this.items.push(value);
    }
  }

  createForm() {
    this.form = this.formbuilder.group({
      company: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      attention: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(160),
          this.validateNumberAndLettersAndSpecial
        ])
      ],
      date: ["", Validators.compose([Validators.required, this.validateDate])],
      plNo: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      ref: [
        "",
        Validators.compose([
          Validators.maxLength(42),
          Validators.required,
          this.validateNumberAndLetters
        ])
      ],
      blNo: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      loading: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      discharge: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      shipping: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      partial: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      description: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ],
      weight: [
        "",
        Validators.compose([
          Validators.maxLength(20),
          this.validateNumberAndLetters
        ])
      ],
      measurement: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          this.validateNumberAndLetters
        ])
      ],
      totalweight: [
        "",
        Validators.compose([
          Validators.maxLength(20),
          this.validateNumberAndLetters
        ])
      ],
      totalmeasurement: [
        "",
        Validators.compose([
          Validators.maxLength(20),
          this.validateNumberAndLetters
        ])
      ],
      quantity: [
        "",
        Validators.compose([Validators.maxLength(10), this.validateNumber])
      ],
      insurance: [
        "",
        Validators.compose([Validators.required, this.validateNumberAndLetters])
      ]
    });
  }

  validateDate(controls) {
    const regExp = new RegExp(
      /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
    );

    if (regExp.test(controls.value)) {
      const value = controls.value.split("/");
      //console.log(value[2])
      if (
        ((value[0] == "02" && value[1] == "31") ||
          (value[0] == "02" && value[1] == "30")) &&
        Number(value[2]) > 1900
      ) {
        return { validateDate: true };
      } else {
        return null;
      }
    } else {
      return { validateDate: true };
    }
  }

  validateLetters(controls) {
    const regExp = new RegExp(/^[a-zA-Z\s]+$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateLetters: true };
    }
  }

  validateNumberAndLetters(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9\s]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateNumberAndLetters: true };
    }
  }

  validateNumberAndLettersAndSpecial(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9\-@_():.+\n\s\u2013\u2014]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateNumberAndLettersAndSpecial: true };
    }
  }

  validateNumber(controls) {
    const regExp = new RegExp(/^[0-9]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateNumber: true };
    }
  }

  Clear() {
    this.items = [];
    this.form.reset();
    this.totalmeasurement = "";
    this.totalweight = "";
  }

  addItem() {
    if (
      (this.model.weight === undefined &&
        this.model.measurement === undefined &&
        this.model.quantity === undefined) ||
      (this.model.weight === "" &&
        this.model.measurement === "" &&
        this.model.quantity === "")
    ) {
      this.messageClassItem = "alert alert-danger";
      this.messageItem = "Fields are empty!";
    } else {
      if (this.model.weight === undefined || this.model.weight === "") {
        this.messageClassItem = "alert alert-danger";
        this.messageItem = "Weight is empty!";
      } else {
        if (
          this.model.measurement === undefined ||
          this.model.measurement === ""
        ) {
          this.messageClassItem = "alert alert-danger";
          this.messageItem = "Measurement is empty!";
        } else {
          if (this.model.quantity === undefined || this.model.quantity === "") {
            this.messageClassItem = "alert alert-danger";
            this.messageItem = "Quantity is empty!";
          } else {
            if (
              this.model.description === undefined ||
              this.model.description === ""
            ) {
              this.messageClassItem = "alert alert-danger";
              this.messageItem = "Description is empty!";
            } else {
              this.messageClassItem = "";
              this.messageItem = "";

              if (this.items.length == 0) {
                this.items = [];
              } else if (this.items[0].quantity == "No data") {
                this.items = [];
              }

              const value = {
                quantity: this.model.quantity,
                description: this.model.description,
                weight: this.model.weight,
                measurement: this.model.measurement
              };
              this.items.push(value);
              this.form.controls["quantity"].setValue("");
              this.form.controls["weight"].setValue("");
              this.model.description = "";
              this.model.measurement = "";
            }
          }
        }
      }
    }
  }

  addTotal() {
    if (
      this.model.totalmeasurement === undefined ||
      this.model.totalmeasurement === ""
    ) {
      this.messageClassItem = "alert alert-danger";
      this.messageItem = "Total Measurement is empty!";
    } else {
      if (
        this.model.totalweight === undefined ||
        this.model.totalweight === ""
      ) {
        this.messageClassItem = "alert alert-danger";
        this.messageItem = "Total Weight is empty!";
      } else {
        this.messageClassItem = "";
        this.messageItem = "";

        const val1 = {
          totalWeight: this.model.totalweight
        };

        const val2 = {
          totalWeight: this.model.totalmeasurement
        };

        this.totalmeasurement = this.model.totalmeasurement;
        this.totalweight = this.model.totalweight;

        this.model.totalmeasurement = "";
        this.model.totalweight = "";
      }
    }
  }

  deleteItem(input) {
    // removes ITEM on CART
    //console.log(input);
    //console.log(this.items);
    if (this.items.length > 0) {
      for (var key in this.items) {
        if (this.items.hasOwnProperty(key)) {
          if (this.items[key].description == input) {
            //this.items.splice(key,1);
            this.items.splice(this.items.indexOf(key), 1);
            if (this.items.length == 0) {
              this.totalmeasurement = "";
              this.totalweight = "";
            }
            break;
          }
        }
      }
    }
  }

  addPackingList() {
    this.processing = true;

    //console.log(this.model);
  }

  downLoadPDF() {
    const doc = new jsPDF();
    //console.log(this.base64.getPackingList());
    var imgData = "data:image/jpeg;base64," + this.base64.getPackingList();
    doc.addImage(imgData, "JPEG", 0, 0, 210, 300);
    doc.setFontSize(12);
    doc.setFontStyle("Arial");
    var num;
    var chunks: any = [];
    var itemSpacing = 5;
    var endItem = 122;
    var start = 65;
    var space = 5;
    var company = this.model.company;
    var to = "COMBUSTION RETROFITTING CO. INC";
    var add =
      "No. 916, Bantug Norte, Cabanatuan City 3100,\nNueva Ecija, Philippines";
    var attn = this.model.attention;
    var date = this.model.date;
    var plNo = this.model.plNo;
    var ref = this.model.ref;
    var qty = this.model.quantity;
    var description;
    var weight;
    var mesurement;
    var subweight = this.totalweight;
    var submesurement = this.totalmeasurement;
    var blNo = this.model.blNo;
    var portOfLoading = this.model.loading;
    var portOfDischarge = this.model.discharge;
    var shippingMark = this.model.shipping;
    var partialShipment = this.model.partial;
    var insurance = this.model.insurance;

    chunks = [];
    num = 58;

    for (var i = 0, c = attn.length; i < c; i += num) {
      chunks.push(attn.substring(i, i + num));
    }

    for (var i = 0; i < chunks.length; i += 1) {
      doc.text(27, start, chunks[i]);
      start += space;
    }

    chunks = [];
    num = 14;

    for (var i = 0, c = ref.length; i < c; i += num) {
      chunks.push(ref.substring(i, i + num));
    }

    for (var i = 0; i < chunks.length; i += 1) {
      doc.text(165, start, chunks[i]);
      start += space;
    }

    start = 122;

    for (var key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        var element = this.items[key];

        description = element.description;
        weight = element.weight;
        mesurement = element.measurement;
        qty = element.quantity;

        doc.text(15, start, qty);
        doc.text(130, start, weight);

        chunks = [];
        num = 18;

        for (
          var i = 0, charsLength = mesurement.length;
          i < charsLength;
          i += num
        ) {
          chunks.push(mesurement.substring(i, i + num));
        }

        for (var i = 0; i < chunks.length; i += 1) {
          doc.text(160, start, chunks[i]);
          start += space;
        }

        start = endItem;
        chunks = [];
        num = 39;

        for (
          var i = 0, charsLength = description.length;
          i < charsLength;
          i += num
        ) {
          chunks.push(description.substring(i, i + num));
        }

        for (var i = 0; i < chunks.length; i += 1) {
          doc.text(48, start, chunks[i]);
          start += space;
        }

        start += itemSpacing;
        endItem = start;
      }
    }

    doc.text(27, 53, add);
    doc.text(165, 46, date);
    doc.text(165, 55, plNo);
    doc.text(32, 238, blNo);
    doc.text(45, 246.5, portOfLoading);
    doc.text(49, 255, portOfDischarge);
    doc.text(43, 263, shippingMark);
    doc.text(47, 271.5, partialShipment);
    doc.text(35, 280, insurance);
    doc.setFontType("bold");
    doc.setFontSize(20);
    doc.text(27, 25, company);
    doc.setFontSize(14);
    doc.text(27, 46, to);
    doc.text(130, 229, subweight);
    doc.text(160, 229, submesurement);
    doc.save("packinglist.pdf");
    this.Clear();
  }
}
