import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GlobalService } from "../../services/global.service";
import { Data } from "../../model/schema";

@Component({
  selector: "app-paymentadd",
  templateUrl: "./paymentadd.component.html",
  styleUrls: ["./paymentadd.component.css"]
})
export class PaymentaddComponent implements OnInit {
  processing = false;
  search = false;
  model;
  form: FormGroup;
  message;
  messageClass;
  drStatus = true;

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    public global: GlobalService,
    private router: Router
  ) {
    this.createForm();
    this.disableFields();
    this.createModel();
  }

  createModel() {
    const fields = {
      id: "",
      drNumber: "",
      client: "",
      agent: "",
      amount: "",
      paymentDate: "",
      approved: "",
      recieved: ""
    };

    this.model = fields;
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      drNumber: ["", Validators.compose([this.validateNumber])],
      client: [""],
      agent: [""],
      amount: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateNumber
        ])
      ],
      paymentDate: [""],
      approved: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.validateLetters
        ])
      ],
      recieved: [""]
    });
  }

  validateDate(controls) {
    const regExp = new RegExp(
      /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
    );

    if (regExp.test(controls.value)) {
      const value = controls.value.split("/");
      if (
        ((value[0] === "02" && value[1] === "31") ||
          (value[0] === "02" && value[1] === "30")) &&
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

  validateEmail(controls) {
    const regExp = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
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

  validateContact(controls) {
    const regExp = new RegExp(/^[0-9]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { AgentContact: true };
    }
  }

  validateAddress(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { AgentAddress: true };
    }
  }

  Clear() {
    this.form.reset();
    this.search = false;
    this.form.controls["drNumber"].enable();
  }

  disableFields() {
    this.form.controls["client"].disable();
    this.form.controls["agent"].disable();
    this.form.controls["amount"].disable();
    this.form.controls["paymentDate"].disable();
    this.form.controls["approved"].disable();
    this.form.controls["recieved"].disable();
  }

  enableFields() {
    this.form.controls["client"].enable();
    this.form.controls["agent"].enable();
    this.form.controls["amount"].enable();
    this.form.controls["paymentDate"].enable();
    this.form.controls["approved"].enable();
    this.form.controls["recieved"].enable();
  }
  searchDR() {
    const id = this.model.drNumber;

    this.dbService.get("dr", id).subscribe((data: Data) => {
      if (data.status === "error") {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        setTimeout(() => {
          this.messageClass = "";
          this.message = "";
        }, 3000);
      } else {
        this.messageClass = "";
        this.message = "";
        this.form.controls["drNumber"].disable();
        this.search = true;
        this.drStatus = false;
        this.model.client = data[0].clientName;
        this.model.agent = data[0].agentName;
        this.model.id = data[0].id;
        this.model.paymentDate = data[0].date;
        this.enableFields();
      }
    });
  }

  addPayment() {
    const data = {
      function: "addDR",
      drNumber: this.model.drNumber,
      drDate: this.model.paymentDate,
      amount: this.model.amount,
      approved: this.model.approved,
      recieved: this.model.recieved
    };

    this.dbService.post(data).subscribe((res: Data) => {
      console.table(res);
      if (res.status === "error") {
        this.messageClass = "alert alert-danger";
        this.message = res.message;
        setTimeout(() => {
          this.messageClass = "";
          this.message = "";
        }, 2000);
      } else {
        this.global.getPayments();
        this.messageClass = "alert alert-success";
        this.message = res.message;
        this.Clear();
        this.model.client = "";
        this.model.agent = "";
        this.model.id = "";
        this.model.paymentDate = "";
        setTimeout(() => {
          this.messageClass = "";
          this.message = "";
          this.router.navigate(["/admin/accounting/payment-list"]);
        }, 2000);
      }
    });
  }
}
