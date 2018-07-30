import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Agent, Data } from "../../model/schema";
import { Router } from "@angular/router";

@Component({
  selector: "app-agentadd",
  templateUrl: "./agentadd.component.html",
  styleUrls: ["./agentadd.component.css"]
})
export class AgentaddComponent implements OnInit {
  processing = false;
  model = {
    agentName: "",
    agentAddress: "",
    agentContact: "",
    agentAge: "",
    agentEmail: "",
    agentBirthday: ""
  };
  form: FormGroup;
  message;
  messageClass;
  userInvalid = false;

  constructor(private dbService: DatabaseService, private formbuilder: FormBuilder, private router: Router) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      agentName: ["" /* Validators.compose([Validators.required,Validators.minLength(5),this.validateLetters]) */],
      agentBirthday: ["", Validators.compose([Validators.maxLength(10), this.validateDate])],
      agentAge: ["", Validators.compose([Validators.maxLength(20), this.validateAge])],
      agentAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(8)])],
      agentContact: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11), this.validateContact])
      ],
      agentEmail: ["", Validators.compose([Validators.maxLength(100), Validators.minLength(11), this.validateEmail])]
    });
  }

  validateDate(controls) {
    const regExp = new RegExp(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/);

    if (regExp.test(controls.value)) {
      const value = controls.value.split("/");
      // console.log(value[2])
      if (((value[0] === "02" && value[1] === "31") || (value[0] === "02" && value[1] === "30")) && Number(value[2]) > 1900) {
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
    const regExp = new RegExp(/^[a-zA-Z_.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

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

  addAgent() {
    this.processing = true;
    this.model["function"] = "addAgent";
    this.dbService.post(this.model).subscribe((data: Data) => {
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
        } else {
          alert(data.message);
        }
      }
    });
  }
}
