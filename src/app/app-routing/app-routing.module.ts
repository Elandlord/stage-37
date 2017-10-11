import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { ProductComponent } from '../crud/product/product.component';

import { AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: ''}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
      [ RouterModule ]
  ]
})
export class AppRoutingModule { }
