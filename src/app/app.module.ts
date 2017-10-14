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

import { AuthenticateService } from './login/services/authenticate.service';
import { ApiService } from './core/api.service';
import { AlertService} from './services/alert.service';
import { ReadComponent } from './core/components/read/read.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductComponent,
    AlertComponent,
    ReadComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [ AuthGuard, AuthenticateService, AlertService, ApiService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
