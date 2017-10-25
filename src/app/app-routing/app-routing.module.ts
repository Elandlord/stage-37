import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { AdviceComponent } from '../crud/advice/advice.component';
import { ArticleComponent } from '../crud/article/article.component';
import { CategoryComponent } from '../crud/category/category.component';
import { CountryComponent } from '../crud/country/country.component';
import { PositionComponent } from '../crud/position/position.component';
import { ProductComponent } from '../crud/product/product.component';
import { ProductLineComponent } from '../crud/product-line/product-line.component';
import { ProductSettingComponent } from '../crud/product-setting/product-setting.component';
import { RoleComponent } from '../crud/role/role.component';
import { SurgeryComponent } from '../crud/surgery/surgery.component';
import { UserComponent } from '../crud/user/user.component';

import { AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'advices', component: AdviceComponent, canActivate: [AuthGuard]},
    { path: 'articles', component: ArticleComponent, canActivate: [AuthGuard]},
    { path: 'categories', component: CategoryComponent, canActivate: [AuthGuard]},
    { path: 'countries', component: CountryComponent, canActivate: [AuthGuard]},
    { path: 'login', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'positions', component: PositionComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductComponent, canActivate: [AuthGuard] },
    { path: 'product-lines', component: ProductLineComponent, canActivate: [AuthGuard] },
    { path: 'product-settings', component: ProductSettingComponent, canActivate: [AuthGuard] },
    { path: 'roles', component: RoleComponent, canActivate: [AuthGuard] },
    { path: 'surgeries', component: SurgeryComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
      [ RouterModule ]
  ]
})
export class AppRoutingModule { }
