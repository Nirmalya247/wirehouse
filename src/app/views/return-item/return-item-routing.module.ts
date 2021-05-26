import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnItemComponent } from './return-item.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnItemComponent,
    data: {
      title: 'Return Item'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnItemRoutingModule {}
