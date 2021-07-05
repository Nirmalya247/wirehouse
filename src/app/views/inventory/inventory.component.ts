import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ItemDataService } from '../../services/item-data.service';
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Item } from '../../data/item';
import { getJSDocThisTag } from 'typescript';

@Component({
    templateUrl: 'inventory.component.html'
})
export class InventoryComponent implements OnInit {
    @ViewChild('itemForm') public itemForm: ModalDirective;
    @ViewChild('itemUpdateForm') public itemUpdateForm: ModalDirective;
    @ViewChild('deleteConfirmForm') public deleteConfirmForm: ModalDirective;
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;

    racks = [];
    items: Array<Item> = [];
    pages: Array<number> = [];
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
        this.getRacks();
        this.getItemTable(null);
        this.itemTypeSearch({ term: '' });
        let now = new Date();
        let nowYear = now.getFullYear();
        for (let i = 0; i < this.years.length; i++) this.years[i] += nowYear;
    }
    getRacks() {
        this.itemDataService.getRacks({ }).subscribe(res => {
            this.racks = res;
        })
    }

    getTablePages(pageNo, pages) {
        var start = pageNo - 4;
        var end = pageNo + 4 + (start < 1 ? 1 - start : 0);
        start = (end > pages.length ? start - (end - pages.length) : start);
        start = start < 1 ? 1 : start;
        end = end > pages.length ? pages.length : end;
        var p = [];
        for (var i = start; i <= end; i++) p.push(i);
        return p;
    }

    getItemTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.itemPage - 1;
            if (pageNo == -2) pageNo = this.itemPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.pages.length;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.itemPage = pageNo;
        } else this.itemPage = 1;
        let query = {
            itemLimit: this.itemLimit,
            itemOrderBy: this.itemOrderBy,
            itemOrder: this.itemOrder,
            itemSearch: this.itemSearch,
            itemPage: this.itemPage
        }
        this.itemDataService.getItemsCount(query).subscribe(
            resCount => {
                console.log(resCount);
                this.pages = Array.from({ length: Math.ceil(parseInt(resCount.toString()) / this.itemLimit) }, (_, i) => i + 1);
                this.itemDataService.getItems(query).subscribe(
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
    itemRack: string = '';
    itemDescription: string = '';
    itemLowLimit: string = '0';

    years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    months = [['01', 'JAN'], ['02', 'FEB'], ['03', 'MAR'], ['04', 'APR'], ['05', 'MAY'], ['06', 'JUN'], ['07', 'JUL'], ['08', 'AUG'], ['09', 'SEP'], ['10', 'OCT'], ['11', 'NOV'], ['12', 'DEC']];

    itemFormShow(i) {
        this.itemI = i;
        this.itemName = this.items[i].itemname.toString();
        this.itemCode = this.items[i].itemcode.toString();
        this.itemUnitPrice = this.items[i].price.toString();
        this.itemDescription = this.items[i].description.toString();
        this.itemLowLimit = this.items[i].lowlimit.toString();
        this.itemForm.show();
    }

    itemFormHide() {
        this.itemI = -1;
        this.itemName = '';
        this.itemCode = '';
        this.itemQTY = '';
        this.itemUnitPrice = '';
        this.itemDescription = '';
        this.itemLowLimit = '0';
        this.itemForm.hide();
    }

    itemFormSave() {
        let data = {
            oldcode: this.items[this.itemI].itemcode.toString(),
            itemcode: this.itemCode,
            itemname: this.itemName,
            price: this.itemUnitPrice,
            description: this.itemDescription,
            lowlimit: this.itemLowLimit
        }
        this.itemDataService.edit(data).subscribe(
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

    itemUpdateId = '';
    itemUpdateData = {
        qty: '',
        qtystock: '',
        price: '',
        discount: '',
        discountamount: '',
        vat: '',
        cost: '',
        totalcost: '',
        mfg: null,
        expiry: null,
        rack: '',
        description: ''
    };

    itemUpdateFormShow(i) {
        this.itemI = i;
        this.itemName = this.items[i].itemname.toString();
        this.itemCode = this.items[i].itemcode.toString();
        this.itemUnitPrice = this.items[i].price.toString();
        this.itemQTY = '';
        this.itemDescription = '';
        this.itemUpdateId = '';
        this.itemUpdateData = {
            qty: '',
            qtystock: '',
            price: '',
            discount: '',
            discountamount: '',
            vat: '',
            cost: '',
            totalcost: '',
            mfg: null,
            expiry: null,
            rack: '',
            description: ''
        };
        this.itemUpdateForm.show();
    }

    itemUpdateGetData() {
        this.itemDataService.getItemUpdate({ id: this.itemUpdateId, itemcode: this.itemCode }).subscribe(res => {
            if (!res.err) {
                this.itemUpdateData = {
                    qty: res.data.qty,
                    qtystock: res.data.qtystock,
                    price: res.data.price,
                    discount: res.data.discount,
                    discountamount: res.data.discountamount,
                    vat: res.data.vat,
                    cost: res.data.cost,
                    totalcost: res.data.totalcost,
                    mfg: res.data.mfg,
                    expiry: res.data.expiry,
                    rack: res.data.rack,
                    description: res.data.description
                };
            }
        });
    }

    itemUpdateFormHide() {
        this.itemI = -1;
        this.itemName = '';
        this.itemCode = '';
        this.itemQTY = '';
        this.itemUnitPrice = '';
        this.itemRack = '';
        this.itemDescription = '';
        this.itemUpdateData = {
            qty: '',
            qtystock: '',
            price: '',
            discount: '',
            discountamount: '',
            vat: '',
            cost: '',
            totalcost: '',
            mfg: null,
            expiry: null,
            rack: '',
            description: ''
        };
        this.itemUpdateForm.hide();
    }

    itemUpdateFormSave() {
        this.itemDataService.update({ itemcode: this.itemCode, id: this.itemUpdateId, itemupdate: this.itemUpdateData }).subscribe(
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

    deleteI = -1;
    deleteItem(i) {
        this.deleteI = i;
        this.deleteConfirmForm.show();
    }

    deleteConfirmFormHide() {
        this.deleteI = -1;
        this.deleteConfirmForm.hide();
    }

    deleteConfirmFormSave() {
        this.itemDataService.delete({ itemcode: this.items[this.deleteI].itemcode }).subscribe(res => {
            if (!res.err) {
                this.toastr.success('item deleted', 'Deleted!');
                this.getItemTable(this.itemPage);
            } else {
                this.toastr.error('item could not be deleted', 'Delete');
            }
            this.deleteConfirmFormHide();
        });
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




    selectedItemType: any = null;
    selectedItemTypeID = null;
    selectedItemTypeName
    addItemQty = '0';

    newItemData = {
        itemcode: '',
        itemname: '',
        manufacturer: '',
        price: '',
        hsn: '',
        lowlimit: '',
        qty: '0',
        description: '',
        itemtypeid: '',
        itemtypename: ''
    };

    itemTypesList: Array<any> = [];
    itemTypeSearch(event) {
        let query = { itemTypeSearch: event.term }
        //this.itemTypesList = [{ id: 0, itemtypename: event.term }];
        this.selectedItemTypeName = event.term;
        this.itemDataService.getItemTypes(query).subscribe(res => {
            this.itemTypesList = res;
            let tadd = true;
            for (let i = 0; i < res.length; i++) {
                if (res[i].itemtypename.toLowerCase() == event.term.toLowerCase()) {
                    tadd = false;
                    break;
                }
            }
            if (event.term != '' && tadd) this.itemTypesList.unshift({ id: 0, itemtypename: event.term });
        });
    }
    searchFn(term: string, item: any) {
        return true;
    }
    itemTypeChange(event) {
        console.log(event);
        let tList = this.itemTypesList;
        this.itemTypesList = [];
        if (event == undefined) {
            this.itemTypeSearch({ term: '' });
            this.selectedItemType = null;
        } else {
            for (let i = 0; i < tList.length; i++) {
                if (tList[i].id != 0) {
                    this.itemTypesList.push(tList[i]);
                    break;
                }
            }
            this.selectedItemType = event;
        }
    }
    addItem() {
        if (this.newItemData.lowlimit == null || this.newItemData.lowlimit == '') this.newItemData.lowlimit = '0';
        this.newItemData.itemtypeid = this.selectedItemType.id;
        this.newItemData.itemtypename = this.selectedItemType.itemtypename;
        this.itemDataService.addItem(this.newItemData).subscribe(
            res => {
                if (!res.err) {
                    this.getItemTable(this.itemPage);
                    this.toastr.success('item added', 'Done!');
                    
                    this.cancelItemAdd();
                } else {
                    this.toastr.error('could not add item', 'Attention');
                }
                console.log(res);
            }
        );
    }
    cancelItemAdd() {
        this.selectedItemType = null;
        this.selectedItemTypeID = null;
        this.itemTypesList = [];
        this.newItemData = {
            itemcode: '',
            itemname: '',
            manufacturer: '',
            price: '',
            hsn: '',
            lowlimit: '',
            qty: '0',
            description: '',
            itemtypeid: '',
            itemtypename: ''
        };
        this.ngSelectComponent.clearModel();
        this.itemTypeSearch({ term: null });
    }
}