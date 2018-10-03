import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DatabaseService } from "../../services/database.service";
import { Client } from "../../model/schema";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Data } from "../../model/schema";

@Component({
  selector: "app-clientedit",
  templateUrl: "./clientedit.component.html",
  styleUrls: ["./clientedit.component.css"]
})
export class ClienteditComponent implements OnInit {
  model = new Client();
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
    this.getClient();
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
          this.clientsContact
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

  validateEmail(controls) {
    const regExp = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

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

  clientsContact(controls) {
    const regExp = new RegExp(/^[0-9]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { clientsContact: true };
    }
  }

  clientsAddress(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { clientsAddress: true };
    }
  }

  getClient() {
    this.dbService
      .get("client", this.route.snapshot.params["id"])
      .subscribe((data: Data) => {
        this.model = data[0];
      });
  }

  goBack() {
    this.router.navigate(["/admin/clients/clients-list"]);
  }

  updateClient() {
    this.model["function"] = "updateClient";
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
