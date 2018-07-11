import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Data } from "../../model/schema";
import { Global } from "../../modules/global";

@Component({
  selector: "app-delivery",
  templateUrl: "./delivery.component.html",
  styleUrls: ["./delivery.component.css"]
})
export class DeliveryComponent implements OnInit {
  model = {
    item: "",
    quantity: "",
    deliveryDate: "",
    refNo: "",
    supplier: "",
    batch: "",
    serialNo: "",
    chasis: "",
    engine: ""
  };
  form: FormGroup;
  processing = false;
  itemList: any[] = [];
  itemNameList: any[] = [];

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    public global: Global,
    private router: Router
  ) {
    this.createForm();
    this.loadData();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      item: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          this.validateLetterNumberSpecialChar
        ])
      ],
      deliveryDate: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          this.validateDate
        ])
      ],
      refNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLettersNumber
        ])
      ],
      quantity: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          this.validateNumber
        ])
      ],
      supplier: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLetterNumberSpecialChar
        ])
      ],
      batch: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateNumber
        ])
      ],
      serialNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLettersNumber
        ])
      ],
      chasis: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLettersNumber
        ])
      ],
      engine: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          this.validateLettersNumber
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
    const regExp = new RegExp(/^[a-zA-Z0-9\/\-@_(),:.+!\n\s\u2013\u2014]*$/);

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

  validateDate(controls) {
    const regExp = new RegExp(
      /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
    );

    if (regExp.test(controls.value)) {
      const value = controls.value.split("/");
      // console.log(value[2])
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

  validateLettersNumber(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateLettersNumber: true };
    }
  }

  goBack() {
    this.router.navigate(["/admin"]);
  }

  clear() {
    this.form.reset();
  }

  loadData() {
    this.dbService.get("itemsName").subscribe((data: any) => {
      this.itemList = data;
    });
  }

  select(val) {
    this.model.item = val;
  }

  filterByItem() {
    if (this.model.item !== "") {
      this.itemNameList = [];

      for (const key in this.itemList) {
        if (this.itemList.hasOwnProperty(key)) {
          const element = this.itemList[key].name;

          if (
            element.toLowerCase().substr(0, this.model.item.length) ===
            this.model.item.toLowerCase()
          ) {
            let duplicate = false;

            for (const k in this.itemNameList) {
              if (this.itemNameList.hasOwnProperty(k)) {
                const el = this.itemNameList[k];
                if (el === element) {
                  duplicate = true;
                }
              } else {
                duplicate = false;
              }
            }
            if (duplicate === false) {
              this.itemNameList.push(element);
            }
          }
        }
      }
    } else {
      this.itemNameList = [];
    }
  }

  addDelivery() {
    this.processing = true;
    this.model["function"] = "addDelivery";
    this.dbService.post(this.model).subscribe((data: Data) => {
      if (data.status === "success") {
        alert(this.model.item + " is successfully added!");
        this.processing = false;
        this.form.reset();
      } else {
        this.processing = false;
        alert(data.message);
      }
    });
  }
}
