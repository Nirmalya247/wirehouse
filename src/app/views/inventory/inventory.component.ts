import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import { ItemDataService } from '../../services/item-data.service';
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Item } from '../../data/item';

@Component({
    templateUrl: 'inventory.component.html'
})
export class InventoryComponent implements OnInit {
    items: Array<Item>;
    itemLimit = 10;
    itemOrderBy = 'itemcode';
    itemOrder = 'asc';
    itemSearch = '';
    constructor(
        public authService: AuthService,
        public router: Router,
        private itemDataService: ItemDataService
    ) { }

    ngOnInit(): void {
        // generate random values for mainChart
    }

    getItemTable() {
        console.log(this.itemLimit, this.itemOrderBy, this.itemOrder, this.itemSearch);
    }

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

    addItem(f: NgForm) {
        if (f.valid) {
            this.itemDataService.addItem(f.value).subscribe (
                res=> {
                    console.log(res);
                }
            );
        }
        //console.log(f.value, f.valid);
    }
}