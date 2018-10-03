import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DatabaseService } from "../../services/database.service";
import { User, Data } from "../../model/schema";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-useredit",
  templateUrl: "./useredit.component.html",
  styleUrls: ["./useredit.component.css"]
})
export class UsereditComponent implements OnInit {
  model = new User();
  form: FormGroup;
  usertype;
  messageClass;
  message;
  processing;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private dbService: DatabaseService
  ) {
    this.createForm();
    this.getUser();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      employeeName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          this.validateLetters
        ])
      ],
      birthday: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          this.validateDate
        ])
      ],
      position: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          this.validateLetters
        ])
      ],
      usertype: [""]
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

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateUsername: true };
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validatePassword: true };
    }
  }

  getUser() {
    this.dbService
      .get("user", this.route.snapshot.params["id"])
      .subscribe(data => {
        this.model = data[0];
        this.usertype = this.model.usertype;
      });
  }

  goBack() {
    this.router.navigate(["/admin/user/user-list"]);
  }

  updateUser() {
    this.model.usertype = this.usertype;
    this.model["function"] = "updateUser";

    this.dbService.post(this.model).subscribe((data: Data) => {
      if (data.status === "success") {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.processing = false;
        this.form.reset();
        this.goBack();
      } else {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      }
    });
  }

  filterBy(input) {
    this.usertype = input;
  }
}
