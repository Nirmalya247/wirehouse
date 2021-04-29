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
    pages: Array<number>;
    itemPage = 1;
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
        this.getItemTable(null);
    }

    getItemTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.itemPage - 1;
            if (pageNo == -2) pageNo = this.itemPage + 1;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.itemPage = pageNo;
        }
        else this.itemPage = 1;
        let query = {
            itemLimit: this.itemLimit,
            itemOrderBy: this.itemOrderBy,
            itemOrder: this.itemOrder,
            itemSearch: this.itemSearch,
            itemPage: this.itemPage
        }
        this.itemDataService.getItemsCount(query).subscribe (
            resCount => {
                console.log(resCount);
                this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.itemLimit)}, (_, i) => i + 1);
                this.itemDataService.getItems(query).subscribe (
                    res => {
                        console.log(res);
                        this.items = res;
                    }
                );
            }
        );
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
                res => {
                    console.log(res);
                }
            );
        }
        //console.log(f.value, f.valid);
    }
}