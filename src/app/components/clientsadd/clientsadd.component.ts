import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Client, Data } from "../../model/schema";
import { Router } from "@angular/router";

@Component({
  selector: "app-clientsadd",
  templateUrl: "./clientsadd.component.html",
  styleUrls: ["./clientsadd.component.css"]
})
export class ClientsaddComponent implements OnInit {
  processing = false;
  model = new Client();
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
    this.form = this.formbuilder.group({
      clientName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          this.validateLetters
        ])
      ],
      clientAddress: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(8)
        ])
      ],
      clientContact: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          this.validateContact
        ])
      ],
      clientEmail: [
        "",
        Validators.compose([Validators.maxLength(100), this.validateEmail])
      ]
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
    const regExp = new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
    }
  }

  validateAge(controls) {
    const regExp = new RegExp(/^[0-9]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateAge: true };
    }
  }

  validateContact(controls) {
    const regExp = new RegExp(/^[0-9]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateContact: true };
    }
  }

  validateAddress(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateAddress: true };
    }
  }

  Clear() {
    this.form.reset();
  }

  addClient() {
    this.processing = true;
    this.model["function"] = "addClient";
    this.dbService.post(this.model).subscribe((data: Data) => {
      if (data.status === "success") {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.processing = false;
        setTimeout(() => {
          this.form.reset();
          this.router.navigate(["/admin/clients/clients-list"]);
        }, 2000);
      } else {
        this.processing = false;
        if (data.status === "error") {
          this.messageClass = "alert alert-danger";
          this.message = data.message;
          this.userInvalid = true;
        } else {
          alert(data.message);
        }
      }
    });
  }
}
