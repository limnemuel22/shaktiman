import { Injectable } from "@angular/core";
import { DatabaseService } from "../services/database.service";
import { Data } from "../model/schema";

@Injectable()
export class Global {
  token;
  usertype;
  employeeName;
  purchases;
  items;
  users;
  agents;
  payments;
  clients;
  pdf;

  constructor(private dbService: DatabaseService) {
    this.token = localStorage.getItem("token");
  }

  getPDF() {
    this.dbService.getPDF("pdf").subscribe((data: Data) => {
      this.pdf = data;
    });
  }

  getPurchases() {
    this.dbService.get("purchases").subscribe((data: Data) => {
      if (data.status === undefined) {
        this.purchases = data;
        for (const p of this.purchases) {
          p.discount = Number(p.discount).toLocaleString("en-us", {
            minimumFractionDigits: 2
          });
          p.price = Number(p.price).toLocaleString("en-us", {
            minimumFractionDigits: 2
          });
        }
      }
    });
  }

  getItems() {
    this.dbService.get("items").subscribe((data: Data) => {
      if (data.status === undefined) {
        this.items = data;
        for (const i of this.items) {
          i.price = Number(i.price)
            .toLocaleString("en-us", { minimumFractionDigits: 2 })
            .toString();
        }
      }
    });
  }

  getUsers() {
    this.dbService.get("users", this.token).subscribe((data: Data) => {
      if (data.status === undefined) {
        this.users = data;
      }
    });
  }

  getPayments() {
    this.dbService.get("payments", this.token).subscribe((data: Data) => {
      if (data.status === undefined) {
        this.payments = data;
        Object.entries(this.payments).forEach(([key, value]) => {
          this.payments[key].amount = Number(value["amount"]).toLocaleString(
            "en-us",
            { minimumFractionDigits: 2 }
          );
          this.payments[key].price = Number(value["price"]).toLocaleString(
            "en-us",
            { minimumFractionDigits: 2 }
          );
          this.payments[key].discount = Number(
            value["discount"]
          ).toLocaleString("en-us", { minimumFractionDigits: 2 });
          this.payments[key].discountedPrice = Number(
            value["discountedPrice"]
          ).toLocaleString("en-us", { minimumFractionDigits: 2 });
          this.payments[key].balance = Number(value["balance"]).toLocaleString(
            "en-us",
            { minimumFractionDigits: 2 }
          );
        });
      }
    });
  }

  getAgents() {
    this.dbService.get("agents", this.token).subscribe((data: Data) => {
      if (data.status === undefined) {
        this.agents = data;
      }
    });
  }

  getClients() {
    this.dbService.get("clients", this.token).subscribe((data: Data) => {
      if (data.status === undefined) {
        this.clients = data;
      }
    });
  }
}
