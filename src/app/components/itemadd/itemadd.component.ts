import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Item, Data } from "../../model/schema";

@Component({
  selector: "app-itemadd",
  templateUrl: "./itemadd.component.html",
  styleUrls: ["./itemadd.component.css"]
})
export class ItemaddComponent implements OnInit {
  model = new Item();
  form: FormGroup;
  processing = false;
  messageClass;
  message;

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLetterNumberSpecialChar
        ])
      ],
      model: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLetterNumberSpecialChar
        ])
      ],
      brand: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLetterNumberSpecialChar
        ])
      ],
      price: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateNumber
        ])
      ],
      itemcode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLetterNumberSpecialChar
        ])
      ],
      description: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          this.validateLetterNumberSpecialChar
        ])
      ]
    });
  }

  validateLetters(controls) {
    const regExp = new RegExp(/^[a-zA-Z\s]+$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateLetters: true };
    }
  }

  validateLetterNumberSpecialChar(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9\-,/_()""'':.+!\n\s\u2013\u2014]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateLetterNumberSpecialChar: true };
    }
  }

  validateNumber(controls) {
    const regExp = new RegExp(/^[0-9.]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateNumber: true };
    }
  }

  goBack() {
    this.router.navigate(["/admin/item/item-list"]);
  }

  addItem() {
    this.processing = true;
    this.model["function"] = "addItem";
    this.dbService.post(this.model).subscribe((data: Data) => {
      if (data.status === "success") {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.processing = false;
        setTimeout(() => {
          this.model = new Item();
          this.goBack();
        }, 3000);
      } else {
        this.processing = false;
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        setTimeout(() => {
          this.messageClass = "";
          this.message = "";
        }, 3000);
      }
    });
  }
}
