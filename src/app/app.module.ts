import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './crud/product/product.component';
import { AlertComponent } from './directives/alert/alert.component';

import {AuthGuard} from './guards/auth.guard';

import { LoginService } from './login/services/login.service';
import {ProductService} from './crud/product/services/product.service';
import { AlertService} from './services/alert.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [ AuthGuard, LoginService, ProductService, AlertService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
