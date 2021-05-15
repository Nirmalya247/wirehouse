import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth-services/auth-guard.service';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  {
    path: '',
    //canActivate: [AuthGuardService],
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    //canActivate: [AuthGuardService],
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'transactions',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule)
      },
      {
        path: 'inventory',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./views/inventory/inventory.module').then(m => m.InventoryModule)
      },
      {
        path: 'accounting',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./views/accounting/accounting.module').then(m => m.AccountingModule)
      },
      {
        path: 'purchase',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./views/purchase/purchase.module').then(m => m.PurchaseModule)
      },
      {
        path: 'admin-management',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./views/admin-management/admin-management.module').then(m => m.AdminManagementModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
