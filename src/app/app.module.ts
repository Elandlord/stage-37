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
import { CountryComponent } from './crud/country/country.component';
import { OverlayComponent } from './core/components/overlay/overlay.component';
import { ProductLineComponent } from './crud/product-line/product-line.component';

import { BooleanToYesnoPipe } from './pipes/boolean-to-yesno.pipe';
import { ProductLineIdToNamePipe } from './pipes/product-line-id-to-name.pipe';
import { ArticleComponent } from './crud/article/article.component';
import { CategoryComponent } from './crud/category/category.component';
import { RoleComponent } from './crud/role/role.component';
import { UserComponent } from './crud/user/user.component';
import { ProductSettingComponent } from './crud/product-setting/product-setting.component';
import { SurgeryComponent } from './crud/surgery/surgery.component';
import { PositionComponent } from './crud/position/position.component';
import { AdviceComponent } from './crud/advice/advice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductComponent,
    AlertComponent,
    ReadComponent,
    CountryComponent,
    OverlayComponent,
    ProductLineComponent,
    BooleanToYesnoPipe,
    ProductLineIdToNamePipe,
    ArticleComponent,
    CategoryComponent,
    RoleComponent,
    UserComponent,
    ProductSettingComponent,
    SurgeryComponent,
    PositionComponent,
    AdviceComponent,
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
