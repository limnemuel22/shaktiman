import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DatabaseService } from "../../services/database.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Data } from "../../model/schema";

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

  constructor(private dbService: DatabaseService, private router: Router) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.form = new FormGroup({
      agentName: new FormControl(this.model.agentName, [
        Validators.required,
        Validators.minLength(5),
        this.validateLetters
      ]),
      agentBirthday: new FormControl(this.model.agentBirthday, [
        Validators.maxLength(10),
        this.validateDate
      ]),
      agentAge: new FormControl(this.model.agentAge, [
        Validators.maxLength(20),
        this.validateAge
      ]),
      agentAddress: new FormControl(this.model.agentAddress, [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(8)
      ]),
      agentContact: new FormControl(this.model.agentContact, [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        this.validateContact
      ]),
      agentEmail: new FormControl(this.model.agentEmail, [
        Validators.maxLength(100),
        Validators.minLength(11),
        this.validateEmail
      ])
    });
  }

  get agentName() {
    return this.form.get("agentName");
  }

  get agentBirthday() {
    return this.form.get("agentBirthday");
  }

  get agentAge() {
    return this.form.get("agentAge");
  }

  get agentAddress() {
    return this.form.get("agentAddress");
  }

  get agentContact() {
    return this.form.get("agentContact");
  }

  get agentEmail() {
    return this.form.get("agentEmail");
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

  goBack() {
    this.router.navigate(["/admin/agent/agent-list"]);
  }
  addAgent() {
    this.processing = true;
    this.model["function"] = "addAgent";
    //console.table(this.model);
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
