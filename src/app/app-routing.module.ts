import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Guards
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';

//Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { ProductsComponent } from './components/products/products.component';
import { MainComponent } from './components/main/main.component';
import { ItemaddComponent } from './components/itemadd/itemadd.component';
import { ItemlistComponent } from './components/itemlist/itemlist.component';
import { AdminComponent } from './components/admin/admin.component';
import { ItemComponent } from './components/item/item.component';
import { ClientComponent } from './components/client/client.component';
import { ItemshowComponent } from './components/itemshow/itemshow.component';
import { ItemeditComponent } from './components/itemedit/itemedit.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { UserComponent } from './components/user/user.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PurchaseshowComponent } from './components/purchaseshow/purchaseshow.component';
import { AgentComponent } from './components/agent/agent.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientsaddComponent } from './components/clientsadd/clientsadd.component';
import { ClientslistComponent } from './components/clientslist/clientslist.component';
import { UseraddComponent } from './components/useradd/useradd.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { AgentaddComponent } from './components/agentadd/agentadd.component';
import { AgentlistComponent } from './components/agentlist/agentlist.component';
import { PaymentaddComponent } from './components/paymentadd/paymentadd.component';
import { PaymentlistComponent } from './components/paymentlist/paymentlist.component';
import { UsereditComponent } from './components/useredit/useredit.component';
import { DeliveryrecieptComponent } from './components/deliveryreciept/deliveryreciept.component';
import { PurchaselistComponent } from './components/purchaselist/purchaselist.component';
import { ClienteditComponent } from './components/clientedit/clientedit.component';
import { AgenteditComponent } from './components/agentedit/agentedit.component';
import { AgentshowComponent } from './components/agentshow/agentshow.component';
import { ClientshowComponent } from './components/clientshow/clientshow.component';
import { AccountingComponent } from './components/accounting/accounting.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { PackingaddComponent } from './components/packingadd/packingadd.component';
import { DiscountComponent } from './components/discount/discount.component';
import { DiscounteditComponent } from './components/discountedit/discountedit.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SalesComponent } from './components/sales/sales.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { ProductlistComponent } from './components/productlist/productlist.component';
import { ImportComponent } from './components/import/import.component';

const appRoutes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: MainComponent },
      {
        path: 'products', component: ProductsComponent,
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: ProductlistComponent, },
          { path: ':id', component: ProductdetailsComponent, },
        ]
      },
      { path: 'about', component: AboutComponent },
      { path: 'client', component: ClientComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard],/* canActivateChild:[AuthGuard], */
    children: [
      { path: 'deliver', component: DeliveryComponent, },
      {
        path: 'item', component: ItemComponent,
        children: [
          { path: '', redirectTo: 'item-list', pathMatch: 'full' },
          { path: 'item-list', component: ItemlistComponent, },
          { path: 'item-add', component: ItemaddComponent, },
          { path: 'edit/:id', component: ItemeditComponent, },
          { path: 'show/:id', component: ItemshowComponent, },
        ]
      },
      {
        path: 'clients', component: ClientsComponent,
        children: [
          { path: '', redirectTo: 'clients-list', pathMatch: 'full' },
          { path: 'clients-list', component: ClientslistComponent, },
          { path: 'clients-add', component: ClientsaddComponent, },
          { path: 'edit/:id', component: ClienteditComponent, },
          { path: 'show/:id', component: ClientshowComponent, },
        ]
      },
      {
        path: 'agent', component: AgentComponent, children: [
          { path: '', redirectTo: 'agent-list', pathMatch: 'full' },
          { path: 'agent-list', component: AgentlistComponent, },
          { path: 'agent-add', component: AgentaddComponent, },
          { path: 'edit/:id', component: AgenteditComponent, },
          { path: 'show/:id', component: AgentshowComponent, },
        ]
      },
      {
        path: 'user', component: UserComponent, children: [
          { path: '', redirectTo: 'user-list', pathMatch: 'full' },
          { path: 'user-list', component: UserlistComponent, },
          { path: 'user-add', component: UseraddComponent, },
          { path: 'edit/:id', component: UsereditComponent, },
          { path: 'show/:id', component: ItemshowComponent, },
        ]
      },
      {
        path: 'purchase', component: PurchaseComponent, children: [
          { path: '', redirectTo: 'purchase-list', pathMatch: 'full' },
          { path: 'purchase-list', component: PurchaselistComponent, },
          { path: 'purchase-dr', component: DeliveryrecieptComponent },
          { path: 'edit/:id', component: ItemeditComponent, },
          { path: 'show/:id', component: PurchaseshowComponent, },
        ]
      },
      {
        path: 'accounting', component: AccountingComponent, children: [
          { path: '', redirectTo: 'payment-list', pathMatch: 'full' },
          { path: 'payment-list', component: PaymentlistComponent, },
          { path: 'payment-add', component: PaymentaddComponent },
          { path: 'discount', component: DiscountComponent },
          { path: 'edit/:id', component: DiscounteditComponent, },
        ]
      },
      {
        path: 'documents', component: DocumentsComponent, children: [
          { path: '', redirectTo: 'import', pathMatch: 'full' },
          { path: 'packing-list', component: PackingaddComponent, },
          { path: 'import', component: ImportComponent, },
        ]
      },
      {
        path: 'reports', component: ReportsComponent, children: [
          { path: '', redirectTo: 'sales', pathMatch: 'full' },
          { path: 'sales', component: SalesComponent, },
        ]
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRountingModule { }