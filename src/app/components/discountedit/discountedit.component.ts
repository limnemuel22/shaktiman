import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Data } from "../../model/schema";

@Component({
  selector: "app-discountedit",
  templateUrl: "./discountedit.component.html",
  styleUrls: ["./discountedit.component.css"]
})
export class DiscounteditComponent implements OnInit {
  model;
  form: FormGroup;
  processing = false;
  messageClass;
  message;
  id = this.route.snapshot.params["id"];

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
    this.model = this.modelScheme();
  }

  ngOnInit() {}

  modelScheme() {
    const val = {
      id: this.id,
      discount: "",
      commission: "",
      remarks: ""
    };

    return val;
  }

  createForm() {
    this.form = this.formbuilder.group({
      discount: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          this.validateNumber
        ])
      ],
      commission: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          this.validateNumber
        ])
      ],
      remarks: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          this.validateLetterNumberSpecialChar
        ])
      ]
    });
  }

  validateLetterNumberSpecialChar(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9\-_():.+!\n\s\u2013\u2014]*$/);

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

  updateDiscount() {
    this.model["function"] = "updateDiscount";
    this.dbService.post(this.model).subscribe((data: Data) => {
      // console.log(data);
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

  goBack() {
    this.router.navigate(["/admin/accounting/discount"]);
  }
}
