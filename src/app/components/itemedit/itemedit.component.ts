import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Item, Data } from "../../model/schema";

@Component({
  selector: "app-itemedit",
  templateUrl: "./itemedit.component.html",
  styleUrls: ["./itemedit.component.css"]
})
export class ItemeditComponent implements OnInit {
  model = new Item();
  form: FormGroup;
  processing = false;
  message;
  messageClass;

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
    this.getItem();
    console.log(this.getItem);
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
          this.validateLetterNumberSpecialChar
        ])
      ]
    });
  }

  validateLetterNumberSpecialChar(controls) {
    const regExp = new RegExp(
      /^[a-zA-Z0-9\-,/''""_():.+!-,\n\s\u2013\u2014\u201D]*$/
    );

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

  getItem() {
    this.dbService
      .get("item", this.route.snapshot.params["id"])
      .subscribe(data => {
        this.model = data[0];
        // console.log(this.model);
      });
  }

  updateItem() {
    this.model["function"] = "updateItem";
    this.dbService.post(this.model).subscribe((data: Data) => {
      if (data.status === "success") {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.processing = false;
        setTimeout(() => {
          this.form.reset();
          this.goBack();
        }, 2000);
      } else {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      }
    });
  }
}
