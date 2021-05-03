import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ItemDataService } from '../../services/item-data.service';
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Item } from '../../data/item';

@Component({
    templateUrl: 'inventory.component.html'
})
export class InventoryComponent implements OnInit {
    @ViewChild('itemForm') public itemForm: ModalDirective;
    @ViewChild('itemUpdateForm') public itemUpdateForm: ModalDirective;
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
        private itemDataService: ItemDataService,
        private toastr: ToastrService
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

    //***********

    itemI: number = -1;
    itemName: string = '';
    itemCode: string = '';
    itemQTY: string = '';
    itemUnitPrice: string = '';
    itemDescription: string = '';
    itemUpdateType: string = 'add';
    itemUpdateTotalPrice: string = '';
    itemDealerName: string = '';
    itemDealerPhone: string = '';

    itemFormShow(i) {
        this.itemI = i;
        this.itemName = this.items[i].itemname.toString();
        this.itemCode = this.items[i].itemcode.toString();
        this.itemUnitPrice = this.items[i].price.toString();
        this.itemDescription = this.items[i].description.toString();
        this.itemForm.show();
    }

    itemFormHide() {
        this.itemI = -1;
        this.itemName = '';
        this.itemCode = '';
        this.itemQTY = '';
        this.itemUnitPrice = '';
        this.itemDescription = '';
        this.itemForm.hide();
    }

    itemFormSave() {
        let data = {
            oldcode: this.items[this.itemI].itemcode.toString(),
            itemcode: this.itemCode,
            itemname: this.itemName,
            price: this.itemUnitPrice,
            description: this.itemDescription
        }
        this.itemDataService.edit(data).subscribe (
            res => {
                if (!res.err) {
                    this.getItemTable(this.itemPage);
                    this.toastr.success('item edited', 'Done!');
                    this.itemFormHide();
                } else {
                    this.toastr.error(res.msg, 'Attention');
                }
                console.log(res);
            }
        );
    }

    itemUpdateFormShow(i) {
        this.itemI = i;
        this.itemName = this.items[i].itemname.toString();
        this.itemCode = this.items[i].itemcode.toString();
        this.itemUnitPrice = this.items[i].price.toString();
        this.itemDescription = '';
        this.itemUpdateType = 'add';
        this.itemQTY = '';
        this.itemDealerName = '';
        this.itemDealerPhone = '';
        this.itemUpdateForm.show();
    }

    itemUpdateTypeChange() {
        if (this.itemUpdateType == 'sub') {
            this.itemDealerName = '';
            this.itemDealerPhone = '';
        }
    }

    itemUpdateFormHide() {
        this.itemI = -1;
        this.itemName = '';
        this.itemCode = '';
        this.itemQTY = '';
        this.itemUnitPrice = '';
        this.itemDescription = '';
        this.itemUpdateForm.hide();
    }

    itemUpdateFormSave() {
        let data = {
            itemcode: this.itemCode,
            itemname: this.itemName,
            qty: this.itemQTY,
            price: this.itemUpdateTotalPrice,
            dealername: this.itemDealerName,
            dealerphone: this.itemDealerPhone,
            type: this.itemUpdateType,
            description: this.itemDescription
        }
        this.itemDataService.update(data).subscribe (
            res => {
                if (!res.err) {
                    this.getItemTable(this.itemPage);
                    this.toastr.success('item updated', 'Done!');
                    this.itemUpdateFormHide();
                } else {
                    this.toastr.error('could not update item', 'Attention');
                }
                console.log(res);
            }
        );
    }

    //***********

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
                    if (!res.err) {
                        this.getItemTable(this.itemPage);
                        this.toastr.success('item added', 'Done!');
                        f.resetForm();
                    } else {
                        this.toastr.error('could not add item', 'Attention');
                    }
                    console.log(res);
                }
            );
        }
        //console.log(f.value, f.valid);
    }
    cancelItemAdd() {
    }
}