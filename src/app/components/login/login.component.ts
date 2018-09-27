import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { DatabaseService } from "../../services/database.service";
import { User, Data } from "../../model/schema";
import { Router } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { GlobalService } from "../../services/global.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  message;
  messageClass;
  processing = false;
  form: FormGroup;
  user = new User();
  data;
  isLogin = true;
  constructor(
    private formbuilder: FormBuilder,
    private dbService: DatabaseService,
    private router: Router,
    public global: GlobalService,
    private authGuard: AuthGuard
  ) {
    this.dbService.loggedIn().subscribe(data => {
      if (!data) {
        this.isLogin = false;
        localStorage.clear();
      } else {
        this.router.navigate(["admin"]);
      }
    });

    this.createForm();
    this.data = {
      username: "",
      password: ""
    };
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formbuilder.group({
      username: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          this.ValidateUsername
        ])
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          this.ValidatePassword
        ])
      ]
    });
  }

  ValidateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { ValidateUsername: true };
    }
  }

  ValidatePassword(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_.-@!]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { ValidatePassword: true };
    }
  }

  disableForm() {
    this.form.controls["username"].disable();
    this.form.controls["password"].disable();
  }

  enableForm() {
    this.form.controls["username"].enable();
    this.form.controls["password"].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    this.data["function"] = "userLogin";

    this.dbService.userLogin(this.data).subscribe((data: any) => {
      if (data.status === "error") {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.global.usertype = data.usertype;
        localStorage.setItem("username", data.username);
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        this.user = new User();
        setTimeout(() => {
          this.form.reset();
          this.router.navigate(["/admin"]);
        }, 2000);
      }
    });
  }
}
