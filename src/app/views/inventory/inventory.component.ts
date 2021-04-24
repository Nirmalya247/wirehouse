import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select'; 

@Component({
    templateUrl: 'inventory.component.html'
})
export class InventoryComponent implements OnInit {

    isCollapsed: boolean = false;
    iconCollapse: string = 'icon-arrow-up';

    collapsed(event: any): void {
        // console.log(event);
    }

    expanded(event: any): void {
        // console.log(event);
    }

    toggleCollapse(): void {
        this.isCollapsed = !this.isCollapsed;
        this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
    }

    ngOnInit(): void {
        // generate random values for mainChart
    }
}