import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Http
import { HttpClientModule } from "@angular/common/http";
import { AppRountingModule } from "./modules/app-routing.module";

// Services
import { DatabaseService } from "./services/database.service";

// Material
import { MaterialModule } from "./modules/material.module";

// Global
import { GlobalService } from "./services/global.service";

// Guards
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notauth.guard";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from "./components/about/about.component";
import { ProductsComponent } from "./components/products/products.component";
import { LoginComponent } from "./components/login/login.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MainComponent } from "./components/main/main.component";
import { ItemaddComponent } from "./components/itemadd/itemadd.component";
import { ItemlistComponent } from "./components/itemlist/itemlist.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ItemComponent } from "./components/item/item.component";
import { SubfooterComponent } from "./components/subfooter/subfooter.component";
import { ClientComponent } from "./components/client/client.component";
import { ItemshowComponent } from "./components/itemshow/itemshow.component";
import { ItemeditComponent } from "./components/itemedit/itemedit.component";
import { DeliveryComponent } from "./components/delivery/delivery.component";
import { UserComponent } from "./components/user/user.component";
import { PurchaseComponent } from "./components/purchase/purchase.component";
import { AgentComponent } from "./components/agent/agent.component";
import { ClientsComponent } from "./components/clients/clients.component";
import { ClientsaddComponent } from "./components/clientsadd/clientsadd.component";
import { ClientslistComponent } from "./components/clientslist/clientslist.component";
import { UseraddComponent } from "./components/useradd/useradd.component";
import { UserlistComponent } from "./components/userlist/userlist.component";
import { AgentaddComponent } from "./components/agentadd/agentadd.component";
import { AgenteditComponent } from "./components/agentedit/agentedit.component";
import { AgentlistComponent } from "./components/agentlist/agentlist.component";
import { PaymentaddComponent } from "./components/paymentadd/paymentadd.component";
import { PaymentlistComponent } from "./components/paymentlist/paymentlist.component";
import { UsereditComponent } from "./components/useredit/useredit.component";
import { DeliveryrecieptComponent } from "./components/deliveryreciept/deliveryreciept.component";
import { PurchaselistComponent } from "./components/purchaselist/purchaselist.component";
import { ClienteditComponent } from "./components/clientedit/clientedit.component";
import { ClientshowComponent } from "./components/clientshow/clientshow.component";
import { AgentshowComponent } from "./components/agentshow/agentshow.component";
import { AccountingComponent } from "./components/accounting/accounting.component";
import { PackingaddComponent } from "./components/packingadd/packingadd.component";
import { DocumentsComponent } from "./components/documents/documents.component";
import { DiscountComponent } from "./components/discount/discount.component";
import { DiscounteditComponent } from "./components/discountedit/discountedit.component";
import { ReportsComponent } from "./components/reports/reports.component";
import { SalesComponent } from "./components/sales/sales.component";
import { ProductdetailsComponent } from "./components/productdetails/productdetails.component";
import { ProductlistComponent } from "./components/productlist/productlist.component";
import { ImportComponent } from "./components/import/import.component";
import { PurchaseshowComponent } from "./components/purchaseshow/purchaseshow.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ProductsComponent,
    LoginComponent,
    NavbarComponent,
    MainComponent,
    ItemaddComponent,
    ItemlistComponent,
    AdminComponent,
    ItemComponent,
    SubfooterComponent,
    ClientComponent,
    ItemshowComponent,
    ItemeditComponent,
    DeliveryComponent,
    UserComponent,
    PurchaseComponent,
    AgentComponent,
    ClientsComponent,
    ClientsaddComponent,
    ClientslistComponent,
    UseraddComponent,
    UserlistComponent,
    AgentaddComponent,
    AgentlistComponent,
    AgenteditComponent,
    PaymentaddComponent,
    PaymentlistComponent,
    UsereditComponent,
    DeliveryrecieptComponent,
    PurchaselistComponent,
    ClienteditComponent,
    ClientshowComponent,
    AgentshowComponent,
    AccountingComponent,
    PackingaddComponent,
    DocumentsComponent,
    DiscountComponent,
    DiscounteditComponent,
    ReportsComponent,
    SalesComponent,
    ProductdetailsComponent,
    ProductlistComponent,
    ImportComponent,
    PurchaseshowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRountingModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [DatabaseService, AuthGuard, NotAuthGuard, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule {}
