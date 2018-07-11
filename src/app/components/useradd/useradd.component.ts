import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User, Data } from "../../model/schema";
import { Router } from "@angular/router";

@Component({
  selector: "app-useradd",
  templateUrl: "./useradd.component.html",
  styleUrls: ["./useradd.component.css"]
})
export class UseraddComponent implements OnInit {
  usertype = "Admin";
  processing = false;
  model = new User();
  form: FormGroup;
  message;
  messageClass;
  userInvalid = false;

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group(
      {
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
        usertype: [""],
        username: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(8),
            this.validateUsername
          ])
        ],
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(8),
            this.validatePassword
          ])
        ],
        confirm: ["", Validators.compose([Validators.required])]
      },
      { validator: this.matchPassword() }
    );
  }

  filterBy(input) {
    this.usertype = input;
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

  matchPassword() {
    return (group: FormGroup) => {
      if (
        group.controls["password"].value === group.controls["confirm"].value
      ) {
        return null;
      } else {
        return { matchPassword: true };
      }
    };
  }

  Clear() {
    this.form.reset();
  }

  addUser() {
    this.processing = true;
    this.model.usertype = this.usertype;
    this.model["function"] = "addUser";
    this.dbService.post(this.model).subscribe((data: Data) => {
      // console.log(data);
      if (data.status === "success") {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.processing = false;
        this.form.reset();
      } else {
        this.processing = false;
        if (data.status === "error") {
          this.messageClass = "alert alert-danger";
          this.message = data.message;
          this.userInvalid = true;
          this.form.controls["username"].reset();
        } else {
          alert(data.message);
        }
      }
    });
  }
}
