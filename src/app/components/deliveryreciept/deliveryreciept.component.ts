import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { Purchase, Data } from "../../model/schema";
import { GlobalService } from "../../services/global.service";
import { log } from "util";

@Component({
  selector: "app-deliveryreciept",
  templateUrl: "./deliveryreciept.component.html",
  styleUrls: ["./deliveryreciept.component.css"]
})
export class DeliveryrecieptComponent implements OnInit {
  messageItem;
  messageClassItem;
  message;
  messageClass;
  total;
  quantity;
  query;
  drNo;
  employeeName;
  itemName;
  items: any;
  itemClick = false;
  itemNameList: any[] = [];
  serialNo;
  serialNoList: any[] = [];
  itemList: any[] = [];
  clientList: any[] = [];
  agentList: any[] = [];
  agent: any[] = [];
  agentName: any[] = [];
  client: any[] = [];
  clientName: any[] = [];
  delivery: any;
  approved;
  price;
  comments;
  picker;

  model = new Purchase();

  nameClient;
  clientAddress: string;
  clientContact: string;
  agentContact: string;
  agentAddress: string;

  form: FormGroup;
  processing = false;
  hasItem;
  hasQuantity;

  constructor(
    private dbService: DatabaseService,
    private formbuilder: FormBuilder,
    public global: GlobalService,
    private router: Router
  ) {
    this.createForm();
    this.loadCart();
    this.computeTotal();
    this.loadData();
    this.checkCart();
    this.form.controls["serialNo"].disable();
    this.form.controls["quantity"].disable();
  }

  ngOnInit() {
    this.model = {
      client: "",
      agent: "",
      date: "",
      items: {
        itemID: "",
        quantity: "",
        price: "",
        total: ""
      }
    };
    this.itemName = "";
  }

  createForm() {
    this.form = this.formbuilder.group(
      {
        client: [
          "",
          Validators.compose([Validators.required, this.validateLetters])
        ],
        agent: [
          "",
          Validators.compose([Validators.required, this.validateLetters])
        ],
        approved: [
          "",
          Validators.compose([Validators.required, this.validateLetters])
        ],
        itemName: [""],
        quantity: ["", Validators.compose([this.validateNumbers])],
        serialNo: [""],
        comments: [""],
        date: ["", Validators.compose([Validators.required])]
      },
      { updateOn: "blur" }
    );
  }

  validateLetters(controls) {
    const regExp = new RegExp(/^[a-zA-Z\s]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateLetters: true };
    }
  }

  validateNumbers(controls) {
    const regExp = new RegExp(/^[0-9.,\s\-]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateNumbers: true };
    }
  }

  validateLettersAndNumbers(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9.,\s\-]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateNumbers: true };
    }
  }

  loadData() {
    this.dbService.get("purchaseData").subscribe((data: any) => {
      for (const i of data) {
        if (i["agentName"]) {
          this.agentName.push(i["agentName"]);
          this.agent.push(i);
        }
        if (i["clientName"]) {
          this.clientName.push(i["clientName"]);
          this.client.push(i);
        }
        if (i["drNo"]) {
          this.drNo = i["drNo"];
        }
      }
      this.loadAgent();
      this.loadClient();

      this.approved =
        localStorage.getItem("approved") !== "undefined" &&
        localStorage.getItem("approved") !== null
          ? localStorage.getItem("approved")
          : "";
      this.form.controls["approved"].setErrors(null);
    });

    this.dbService.get("itemsData").subscribe((data: any) => {
      this.itemList = data;
    });
  }

  loadAgent() {
    let agent = this.people();
    if (
      localStorage.getItem("agent") !== "undefined" &&
      localStorage.getItem("agent") !== null
    ) {
      agent = JSON.parse(
        JSON.parse(JSON.stringify(localStorage.getItem("agent")))
      );
    }

    this.model.agent = agent.name;
    this.agentAddress = agent.address;
    this.agentContact = agent.contact;
    this.form.controls["agent"].setErrors(null);
  }

  loadClient() {
    let client = this.people();
    if (
      localStorage.getItem("client") !== "undefined" &&
      localStorage.getItem("client") !== null
    ) {
      client = JSON.parse(
        JSON.parse(JSON.stringify(localStorage.getItem("client")))
      );
    }
    this.model.client = client.name;
    this.clientAddress = client.address;
    this.clientContact = client.contact;
    this.form.controls["client"].setErrors(null);
    console.table(this.model.client);
  }

  people() {
    return { name: "", address: "", contact: "" };
  }

  filterByItem() {
    if (this.itemName !== "") {
      this.itemClick = false;
      for (const key in this.itemList) {
        if (this.itemList.hasOwnProperty(key)) {
          const element = this.itemList[key].name;
          this.serialNoList = [];
          if (
            element.toLowerCase().substr(0, this.itemName.length) ===
            this.itemName.toLowerCase()
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

  filterBySerial() {
    this.serialNoList = [];

    if (this.serialNo !== "") {
      for (const key in this.itemList) {
        if (this.itemList.hasOwnProperty(key)) {
          const name = this.itemList[key].name;

          if (name === this.itemName) {
            const element = this.itemList[key].serialNo;

            if (
              element.toLowerCase().substr(0, this.serialNo.length) ===
              this.serialNo.toLowerCase()
            ) {
              this.serialNoList.push(element);
            }
          }
        }
      }
    }
  }

  filterByClient() {
    let name;
    if (
      localStorage.getItem("client") !== "undefined" &&
      localStorage.getItem("client") !== null
    ) {
      name = JSON.parse(localStorage["client"]);
      name.name = this.model.client;
    }
    this.clientList = [];

    if (this.model.client !== "") {
      for (const key in this.clientName) {
        if (this.clientName.hasOwnProperty(key)) {
          const element = this.clientName[key];

          if (
            element.toLowerCase().substr(0, this.model.client.length) ===
            this.model.client.toLowerCase()
          ) {
            this.clientList.push(element);

            if (this.clientName[key] === this.model.client) {
              this.clientAddress = this.client[key].clientAddress;
              this.clientContact = this.client[key].clientContact;
            }
          } else {
            this.clientAddress = "";
            this.clientContact = "";
            if (
              localStorage.getItem("client") !== null &&
              localStorage.getItem("client") !== "undefined"
            ) {
              name.contact = "";
              name.address = "";
            } else {
              name = {};
            }
          }
        }
      }
    } else {
      this.clientAddress = "";
      this.clientContact = "";

      if (
        localStorage.getItem("client") !== null &&
        localStorage.getItem("client") !== "undefined"
      ) {
        name.contact = "";
        name.address = "";
      } else {
        name = {};
      }
    }

    localStorage.setItem("client", JSON.stringify(name));
  }

  filterByAgent() {
    let name;

    if (
      localStorage.getItem("agent") !== "undefined" &&
      localStorage.getItem("agent") !== null
    ) {
      name = JSON.parse(localStorage["agent"]);
      name.name = this.model.agent;
    }
    this.agentList = [];
    if (this.model.agent !== "") {
      for (const key in this.agentName) {
        if (this.agentName.hasOwnProperty(key)) {
          const element = this.agentName[key];

          if (
            element.toLowerCase().substr(0, this.model.agent.length) ===
            this.model.agent.toLowerCase()
          ) {
            this.agentList.push(element);
            if (this.agentName[key] === this.model.agent) {
              this.agentAddress = this.agent[key].agentAddress;
              this.agentContact = this.agent[key].agentContact;
            }
          } else {
            this.agentAddress = "";
            this.agentContact = "";

            if (
              localStorage.getItem("agent") !== null &&
              localStorage.getItem("agent") !== "" &&
              localStorage.getItem("agent") !== undefined
            ) {
              name.contact = "";
              name.address = "";
            } else {
              name = {};
            }
          }
        }
      }
    } else {
      this.agentAddress = "";
      this.agentContact = "";

      if (
        localStorage.getItem("agent") !== null &&
        localStorage.getItem("agent") !== "" &&
        localStorage.getItem("agent") !== undefined
      ) {
        name.contact = "";
        name.address = "";
      } else {
        name = {};
      }
    }

    localStorage.setItem("agent", JSON.stringify(name));
  }
  select(item, action) {
    if (action === "client") {
      this.model.client = item;
      for (const key in this.client) {
        if (this.client.hasOwnProperty(key)) {
          const element = this.client[key].clientName;

          if (element === item) {
            this.clientAddress = this.client[key].clientAddress;
            this.clientContact = this.client[key].clientContact;

            const client = {
              id: this.client[key].id,
              name: this.model.client,
              address: this.clientAddress,
              contact: this.clientContact
            };

            localStorage.setItem("client", JSON.stringify(client));
          }
        }
      }
    }

    if (action === "agent") {
      this.model.agent = item;
      for (const key in this.client) {
        if (this.agent.hasOwnProperty(key)) {
          const element = this.agent[key].agentName;

          if (element === item) {
            this.agentAddress = this.agent[key].agentAddress;
            this.agentContact = this.agent[key].agentContact;

            const agent = {
              id: this.agent[key].id,
              name: this.model.agent,
              address: this.agentAddress,
              contact: this.agentContact
            };

            localStorage.setItem("agent", JSON.stringify(agent));
          }
        }
      }
    }

    if (action === "item") {
      this.clear();
      this.itemName = item;
      this.serialNoList = [];
      for (const key in this.itemList) {
        if (this.itemList.hasOwnProperty(key)) {
          const element = this.itemList[key].name;
          if (element === this.itemName) {
            this.serialNoList.push(this.itemList[key].serialNo);
            this.form.controls["serialNo"].enable();
          }
        }
      }
      const duplicate: any = [];
      const arr = this.serialNoList.filter(function(el) {
        // If it is not a duplicate, return true
        if (duplicate.indexOf(el) === -1) {
          duplicate.push(el);
        }
      });
      this.serialNoList = duplicate;
    }

    if (action === "serial") {
      this.serialNo = item;
      this.hasQuantity = true;
      this.form.controls["quantity"].enable();
    }
  }

  addItem() {
    if (
      (this.itemName === undefined &&
        this.serialNo === undefined &&
        this.quantity === undefined) ||
      (this.itemName === "" && this.serialNo === "" && this.quantity === "")
    ) {
      this.messageClassItem = "alert alert-danger";
      this.messageItem = "Item Name, Serial No. and Quantity are empty!";
    } else {
      if (this.itemName === undefined || this.itemName === "") {
        this.messageClassItem = "alert alert-danger";
        this.messageItem = "Item Name is empty!";
      } else {
        if (this.serialNo === undefined || this.serialNo === "") {
          this.messageClassItem = "alert alert-danger";
          this.messageItem = "Serial No. is empty!";
        } else {
          if (this.quantity === undefined || this.quantity === "") {
            this.messageClassItem = "alert alert-danger";
            this.messageItem = "Quantity is empty!";
          } else {
            this.messageClassItem = "";
            this.messageItem = "";
            if (this.checkSerial(this.serialNo) === false) {
              if (this.quantity > 0) {
                const val = {
                  serial: this.serialNo
                };
                const data = {
                  function: "itemDR",
                  serial: this.serialNo,
                  quantity: this.quantity
                };
                console.table(data);
                this.dbService.post(data).subscribe((res: Data) => {
                  if (res.status === "error") {
                    this.messageClassItem = "alert alert-danger";
                    this.messageItem = res.message;
                  } else {
                    console.log(res);
                    this.addCart(res);

                    this.loadCart();
                    this.checkCart();
                    this.itemName = "";
                    this.serialNo = "";
                    this.quantity = "";
                    this.form.controls["serialNo"].disable();
                    this.form.controls["quantity"].disable();
                  }
                });
              } else {
                this.messageClassItem = "alert alert-danger";
                this.messageItem = "Quantity can't be zero!";
              }
            } else {
              this.messageClassItem = "alert alert-danger";
              this.messageItem = "Serial Number is already added in cart!";
            }
          }
        }
      }
    }
  }

  checkSerial(serial) {
    const items = this.items;
    let val = false;
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const element = items[key];
        if (serial === element.serial) {
          val = true;
        }
      }
    }

    return val;
  }

  addCart(object) {
    const totalPrice = Number(object[0].price) * Number(object[0].quantity);

    const cart = {
      id: object[0].id,
      item: object[0].item,
      quantity: object[0].quantity,
      description: object[0].description,
      price: Number(object[0].price).toLocaleString("en-us", {
        minimumFractionDigits: 2
      }),
      total: totalPrice.toLocaleString("en-us", { minimumFractionDigits: 2 }),
      engine: object[0].engine,
      chasis: object[0].chasis,
      serial: object[0].serialNo
    };
    if (this.items === undefined || this.items === "null") {
      this.items = [cart];
    } else {
      this.items.push(cart);
    }
    this.saveCart(this.items);
  }

  computeTotal() {
    let sum = 0;

    Object.entries(this.items).forEach(([key, value]) => {
      sum += Number(value["total"].replace(/,/g, "").split(".")[0]);
    });

    this.total = sum.toLocaleString("en-us", { minimumFractionDigits: 2 });
    this.price = sum;
  }

  deleteItem(serial) {
    // removes ITEM on CART
    for (const key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        if (this.items[key].serialNo === serial) {
          this.items.splice(this.items.indexOf(key), 1);
          break;
        }
      }
    }
    this.saveCart(this.items);
    this.loadCart();
    this.checkCart();
  }
  saveCart(object) {
    localStorage.setItem("cart", JSON.stringify(object));
    this.computeTotal();
  }

  loadCart() {
    const jsonCart = localStorage.getItem("cart");
    const value = jsonCart !== null ? JSON.parse(jsonCart) : [];
    this.items = value;
    this.computeTotal();
  }

  clear() {
    this.serialNo = "";
  }

  clearCart() {
    this.items = [];
    this.saveCart(this.items);
  }

  clearAll() {
    localStorage.removeItem("agent");
    localStorage.removeItem("client");
    localStorage.removeItem("cart");
    this.clearCart();
    this.loadAgent();
    this.loadCart();
    this.loadClient();
  }

  updateApproved() {
    localStorage.setItem("approved", this.approved);
  }

  saveDR() {
    this.processing = true;
    const clientJson = localStorage.getItem("client");
    const agentJson = localStorage.getItem("agent");
    const idJson = localStorage.getItem("id");
    const client = clientJson !== null ? JSON.parse(clientJson) : [];
    const agent = agentJson !== null ? JSON.parse(agentJson) : [];
    const processedBy = idJson !== null ? JSON.parse(idJson) : [];
    let drItems = "";
    for (const key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        const id = this.items[key].id;
        const item = this.items[key].item;
        const qty = this.items[key].quantity;
        drItems += id + "," + item + "," + qty + "-";
      }
    }
    const date = new Date(this.model.date);
    const ndate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const info = {
      function: "addPurchase",
      agent: agent.id,
      client: client.id,
      approved: this.approved,
      items: drItems,
      processedBy: processedBy,
      total: this.price,
      comments: this.comments,
      date: ndate
    };

    this.dbService.post(info).subscribe((data: Data) => {
      if (data.status === "success") {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        setTimeout(() => {
          this.clearAll();
          this.global.getPurchases();
          this.router.navigate(["/admin/purchase/purchase-list"]);
          alert(data.message);
        }, 2000);
      } else {
        this.processing = true;
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      }
    });
  }

  checkCart() {
    this.loadCart();

    if (this.items === null || this.items.length === 0) {
      this.hasItem = true;
    } else {
      this.hasItem = false;
    }
  }

  checkQuantity() {
    if (
      this.form.controls["quantity"].value === "" ||
      this.form.controls["quantity"].value === undefined
    ) {
      this.hasQuantity = true;
    } else if (this.form.controls["quantity"].value.length > 0) {
      this.hasQuantity = false;
    } else {
      this.hasQuantity = true;
    }
    console.log(this.form.controls["quantity"].value.length);
  }
}
