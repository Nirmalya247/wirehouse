import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ItemDataService } from '../../services/item-data.service';
import { SaleDataService } from '../../services/sale-data.service';
import { environment } from '../../../environments/environment';
import { Item, ItemSale, ItemUpdate } from '../../data/item';
import { Sale, Purchase } from '../../data/transaction';

@Component({
    templateUrl: 'purchase.component.html'
})

export class PurchaseComponent implements OnInit {
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;

    serverPath = environment.PATH;

    racks = [];

    items: Array<ItemUpdate> = [];
    billID: string;
    dueDate: string;
    totalAmount: string;
    totalDiscount: string;
    taxable: string;
    paymentMode: string = 'cash';
    cumulativeAmount: string;
    totalTendered: string;
    changeDue: string;
    dueAmount: string;
    addDue: boolean = false;

    vendorID: string = '';
    vendorFName: string = '';
    vendorLName: string = '';
    vendorCompany: string = '';
    vendorPhone: string = '';
    vendorEmail: string = '';
    vendorVatno: string = '';
    vendorDue: string;
    vendorData: any = { };
    vendorNew: boolean = true;


    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private itemDataService: ItemDataService,
        private saleDataService: SaleDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.itemSearch({ term: null });
        this.getPurchaseTable(null);
        this.getRacks();
        // generate random values for mainChart
    }
    getRacks() {
        this.itemDataService.getRacks({ }).subscribe(res => {
            this.racks = res;
        })
    }
    addItem() {
        if (this.selectedItem != null || this.selectedItem != undefined) {
            this.saleDataService.getLastSaleItem({ itemcode: this.selectedItem.itemcode }).subscribe(res => {
                console.log('@@@@@@@@@@@', res);
                let newItem = <ItemUpdate> {
                    id: null,
                    purchaseId: null,
                    itemcode: this.selectedItem.itemcode,
                    itemname: this.selectedItem.itemname,
                    qty: 1,
                    qtystock: this.selectedItem.qty,
                    price: (res.err ? '' : res.price),
                    discount: (res.err ? '' : res.discount),
                    discountamount: 0,
                    vat: (res.err ? '' : res.vat),
                    cost: (res.err ? '' : res.cost),
                    totalcost: (res.err ? '' : res.cost),
                    mfg: '',
                    expiry: '',
                    rack: (res.err ? '' : res.rack),
                    vendorid: '',
                    description: ''
                };
                this.items.push(newItem);
                this.changeQTY(this.items.length - 1);
            });
        }
    }
    removeItem(i) {
        if (i < this.items.length) {
            this.items.splice(i, 1);
        }
        this.calculateTotalAmmount();
    }
    changeQTY(i) {
        let vat = Number(this.items[i].vat);
        let discount = Number(this.items[i].discount);
        let discountamount = Number(this.items[i].discountamount);
        if (isNaN(vat)) vat = 0;
        if (isNaN(discount)) discount = 0;
        if (isNaN(discountamount)) discountamount = 0;


        if (isNaN(Number(this.items[i].qty))) this.items[i].qty = 1;
        // if (this.items[i].qty > this.items[i].qtystock) this.items[i].qty = this.items[i].qtystock;
        // if (this.items[i].qty < 0) this.items[i].qty = 0;
        let total = Number(this.items[i].qty) * Number(this.items[i].price);
        discount = total * discount / 100;
        if (total - discount - discountamount <= 0) {
            discountamount = total - discount;
            this.items[i].discountamount = discountamount;
        }
        total = (total - discount - discountamount) * (1 + vat / 100);
        this.items[i].totalcost = total;
        if (isNaN(Number(this.items[i].totalcost))) this.items[i].totalcost = 0;
        this.items[i].totalcost = Number(this.items[i].totalcost.toFixed(2));
        this.calculateTotalAmmount();
    }
    calculateTotalAmmount() {
        let totalAmount = 0;
        let totalDiscount = 0;
        let taxable = 0;
        let cumulativeAmount = 0;

        let oldDue = Number(this.vendorDue);
        if (isNaN(oldDue) || !this.addDue) oldDue = 0;

        for (let i = 0; i < this.items.length; i++) {
            let amount = Number(this.items[i].qty) * Number(this.items[i].price);
            let discount = amount * Number(this.items[i].discount) / 100 + Number(this.items[i].discountamount);
            totalAmount += amount;
            totalDiscount += discount;
            taxable += (amount - discount);
            cumulativeAmount += Number(this.items[i].totalcost);
        }
        cumulativeAmount += oldDue;

        this.totalAmount = totalAmount.toFixed(2);
        this.totalDiscount = totalDiscount.toFixed(2);
        this.taxable = taxable.toFixed(2);
        this.cumulativeAmount = Math.round(cumulativeAmount).toFixed(2);
        this.changeTendered();
    }
    changeTendered() {
        let cost = Number(this.cumulativeAmount);
        let tendered = Number(this.totalTendered);
        if (isNaN(tendered)) {
            tendered = 0;
            this.totalTendered = '';
        }
        if (!isNaN(cost) && cost >= 0) {
            let due = tendered - cost;
            due = Math.round(due);
            if (due >= 0) {
                this.changeDue = due.toFixed(2);
                this.dueAmount = '0.00';
            } else {
                due *= -1;
                this.dueAmount = due.toFixed(2);
                this.changeDue = '0.00';
            }
        }
    }

    confirmPurchase() {
        if (this.vendorNew) {
            this.toastr.error('Save User First', 'Attention');
            return;
        }
        if (this.paymentMode == undefined) {
            this.toastr.error('select payment mode', 'Attention');
            return;
        }
        let purchaseItems = [];
        let totalQTY = 0;
        for (let i = 0; i < this.items.length; i++) {
            totalQTY += isNaN(Number(this.items[i].qty)) ? 0 : Number(this.items[i].qty);
            this.items[i].qtystock = this.items[i].qty;
            this.items[i].vendorid = this.vendorID;
            purchaseItems.push(this.items[i]);
        }
        if (this.addDue) purchaseItems.push({
            itemcode: 'due' + this.vendorID,
            itemname: 'due amount',
            price: this.vendorDue,
            qty: '1',
            totalPrice: this.vendorDue
        });
        if (purchaseItems.length == 0) {
            this.toastr.error('Nothing in the cart', 'Attention');
            return;
        }
        let data = {
            billID: this.billID,
            totalItem: this.items.length,
            totalQTY: totalQTY,
            paymentMode: this.paymentMode,
            totalAmount: isNaN(Number(this.totalAmount)) ? 0 : Number(this.totalAmount),
            totalTaxable: isNaN(Number(this.taxable)) ? 0 : Number(this.taxable),
            totalCost: isNaN(Number(this.cumulativeAmount)) ? 0 : Number(this.cumulativeAmount),
            totalTendered: isNaN(Number(this.totalTendered)) ? 0 : Number(this.totalTendered),
            changeDue: isNaN(Number(this.changeDue)) ? 0 : Number(this.changeDue),
            dueAmount: isNaN(Number(this.dueAmount)) ? 0 : Number(this.dueAmount),
            dueDate:this.dueDate,
            addDue: this.addDue ? 1 : 0,
            vendorID: this.vendorID,
            vendorFName: this.vendorFName,
            vendorLName: this.vendorLName,
            vendorCompany: this.vendorCompany,
            vendorPhone: this.vendorPhone,
            vendorEmail: this.vendorEmail,
            vendorDue: isNaN(Number(this.vendorDue)) ? 0 : Number(this.vendorDue),
            userID: this.authGuardService.id,
            userName: this.authGuardService.name,
            items: purchaseItems
        }
        console.log(data);
        this.saleDataService.addPurchase(data).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success('Purchase successful', 'Done!');
                this.cancelPurchase();
                this.getPurchaseTable(this.purchasePage);
                // window.open(environment.PATH + 'purchase-bill?purchaseId=' + res.id.toString() + '&paper=A4');
            } else {
                this.toastr.error('Purchase unsuccessful', 'Attention');
            }
        });
    }


    cancelPurchase() {
        this.items = [];
        this.billID = '';
        this.totalAmount = '';
        this.totalDiscount = '';
        this.taxable = '';
        this.cumulativeAmount = '';
        this.paymentMode = 'cash';
        this.totalTendered = '';
        this.changeDue = '';
        this.dueAmount = '';
        this.dueDate = '';
        this.addDue = false;
        this.vendorID = '';
        this.vendorFName = '';
        this.vendorLName = '';
        this.vendorCompany = '';
        this.vendorPhone = '';
        this.vendorEmail = '';
        this.vendorVatno = '';
        this.vendorDue = '';
        this.vendorData = { };
        this.vendorNew = true;

        this.selectedItem = null;
        this.selectedItemCode = null;
        this.itemsList = [ ];
        this.ngSelectComponent.clearModel();
        this.itemSearch({ term: null });
    }

    vendorGet() {
        let query = { }
        let ch = false;
        if (this.vendorID != null && this.vendorID != '' && this.vendorID.length == 8 && this.vendorID != this.vendorData.id) {
            query['id'] = this.vendorID; ch = true;
        } else if (this.vendorPhone != null && this.vendorPhone != '' && !isNaN(Number(this.vendorPhone)) && this.vendorPhone.length >= 10 && this.vendorPhone.length <= 12 && this.vendorPhone != this.vendorData.phone) {
            query['phone'] = Number(this.vendorPhone); ch = true;
        }else if (this.vendorEmail != null && this.vendorEmail != '' && this.vendorEmail != this.vendorData.email) {
            console.log(this.vendorEmail != this.vendorData.email, this.vendorEmail, this.vendorData.email);
            query['email'] = this.vendorEmail; ch = true;
        }
        if (ch) {
            this.saleDataService.vendorGet(query).subscribe (
                res => {
                    if (res.found) {
                        this.vendorID = res.id;
                        this.vendorFName = res.fname;
                        this.vendorLName = res.lname;
                        this.vendorCompany = res.company;
                        this.vendorPhone = res.phone;
                        this.vendorEmail = res.email;
                        this.vendorVatno = res.vatno;
                        this.vendorDue = res.due;
                        this.vendorNew = false;
                        this.vendorData = res;
                    }
                    //this.itemsList = res;
                }
            );
        }
    }
    vendorAdd() {
        let query = {
            fname: this.vendorFName,
            lname: this.vendorLName,
            company: this.vendorCompany,
            phone: this.vendorPhone,
            email: this.vendorEmail,
            vatno: this.vendorVatno,
            due: '0.00'
        }
        if (query.fname == '' || query.phone == '') {
            this.toastr.error('Enter user info', 'User Info');
            return;
        }
        console.log(query);
        this.saleDataService.vendorAdd(query).subscribe (
            res => {
                console.log(res);
                if (!res.err) {
                    this.vendorID = res.id;
                    this.toastr.success('Saved successfully!', 'User Info');
                    this.vendorNew = false;
                    this.vendorData = res;
                }
            }
        );
    }
    vendorUpdate() {
        let query = {
            id: this.vendorID,
            fname: this.vendorFName,
            lname: this.vendorLName,
            company: this.vendorCompany,
            phone: this.vendorPhone,
            email: this.vendorEmail,
            vatno: this.vendorVatno,
            due: this.vendorDue
        }
        console.log(query);
        this.saleDataService.vendorUpdate(query).subscribe (
            res => {
                if (!res.err) {
                    console.log(res);
                    this.toastr.success('Updated successfully!', 'User Info');
                }
            }
        );
    }
    vendorClear() {
        this.vendorID = '';
        this.vendorFName = '';
        this.vendorLName = '';
        this.vendorCompany = '';
        this.vendorPhone = '';
        this.vendorEmail = '';
        this.vendorVatno = '';
        this.vendorDue = '';
        this.vendorData = { };
        this.vendorNew = true;
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

    selectedItem: Item;
    selectedItemCode;

    itemsList: Array<Item>;
    itemSearch(event) {
        let query = {
            itemLimit: 20,
            itemOrderBy: 'itemname',
            itemOrder: 'asc',
            itemSearch: event.term,
            itemPage: 1
        }
        this.itemDataService.getItems(query).subscribe (
            res => {
                this.itemsList = res;
            }
        );
    }
    searchFn(term: string, item: any) {
        return true;
    }
    itemChange(event) {
        this.selectedItem = event;
    }

    //***********
    purchases: Array<Purchase>;
    pages: Array<number>;
    purchasePage = 1;
    purchaseLimit = 10;
    purchaseOrderBy = 'createdAt';
    purchaseOrder = 'desc';
    purchaseSearchText = '';
    getPurchaseTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.purchasePage - 1;
            if (pageNo == -2) pageNo = this.purchasePage + 1;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.purchasePage = pageNo;
        }
        else this.purchasePage = 1;
        let query = {
            purchaseLimit: this.purchaseLimit,
            purchaseOrderBy: this.purchaseOrderBy,
            purchaseOrder: this.purchaseOrder,
            purchaseSearchText: this.purchaseSearchText,
            purchasePage: this.purchasePage
        }
        this.saleDataService.getPurchasesCount(query).subscribe (
            resCount => {
                console.log(resCount);
                this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.purchaseLimit)}, (_, i) => i + 1);
                this.saleDataService.getPurchases(query).subscribe (
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].createdAt = new Date(res[i].createdAt.toString());
                        }
                        this.purchases = res;
                    }
                );
            }
        );
        console.log(this.purchaseLimit, this.purchaseOrderBy, this.purchaseOrder, this.purchaseSearchText);
    }
}