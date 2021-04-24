import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminManagementComponent } from './admin-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminManagementComponent,
    data: {
      title: 'AdminManagement'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminManagementRoutingModule {}
