import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ItemDataService } from '../../services/item-data.service';
import { TransactionDataService } from '../../services/transaction-data.service';
import { environment } from '../../../environments/environment';
import { Item, ItemTransaction, ItemUpdate } from '../../data/item';
import { Transaction, Purchase } from '../../data/transaction';

@Component({
    templateUrl: 'purchase.component.html'
})

export class PurchaseComponent implements OnInit {
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;

    serverPath = environment.PATH;

    racks = [];

    items: Array<ItemUpdate> = [];
    billID: string;
    totalAmount: string;
    totalDiscount: string;
    taxable: string;
    paymentMode: string = 'cash';
    cumulativeAmount: string;
    totalTendered: string;
    changeDue: string;
    creditAmount: string;
    addCredit: boolean = false;

    salesmanID: string = '';
    salesmanName: string = '';
    salesmanPhone: string = '';
    salesmanEmail: string = '';
    salesmanVatno: string = '';
    salesmanCredit: string;
    salesmanData: any = { };
    salesmanNew: boolean = true;


    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private itemDataService: ItemDataService,
        private transactionDataService: TransactionDataService,
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
            this.transactionDataService.getLastTransactionItem({ itemcode: this.selectedItem.itemcode }).subscribe(res => {
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
                    expiry: '',
                    rack: (res.err ? '' : res.rack),
                    salesmanid: '',
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

        let oldCredit = Number(this.salesmanCredit);
        if (isNaN(oldCredit) || !this.addCredit) oldCredit = 0;

        for (let i = 0; i < this.items.length; i++) {
            let amount = Number(this.items[i].qty) * Number(this.items[i].price);
            let discount = amount * Number(this.items[i].discount) / 100 + Number(this.items[i].discountamount);
            totalAmount += amount;
            totalDiscount += discount;
            taxable += (amount - discount);
            cumulativeAmount += Number(this.items[i].totalcost);
        }
        cumulativeAmount += oldCredit;

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
                this.creditAmount = '0.00';
            } else {
                due *= -1;
                this.creditAmount = due.toFixed(2);
                this.changeDue = '0.00';
            }
        }
    }

    confirmPurchase() {
        if (this.salesmanNew) {
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
            this.items[i].expiry = this.items[i].expiry + '-01';
            this.items[i].salesmanid = this.salesmanID;
            purchaseItems.push(this.items[i]);
        }
        if (this.addCredit) purchaseItems.push({
            itemcode: 'credit' + this.salesmanID,
            itemname: 'credit amount',
            price: this.salesmanCredit,
            qty: '1',
            totalPrice: this.salesmanCredit
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
            creditAmount: isNaN(Number(this.creditAmount)) ? 0 : Number(this.creditAmount),
            addCredit: this.addCredit ? 1 : 0,
            salesmanID: this.salesmanID,
            salesmanName: this.salesmanName,
            salesmanPhone: this.salesmanPhone,
            salesmanEmail: this.salesmanEmail,
            salesmanCredit: isNaN(Number(this.salesmanCredit)) ? 0 : Number(this.salesmanCredit),
            userID: this.authGuardService.id,
            userName: this.authGuardService.name,
            items: purchaseItems
        }
        console.log(data);
        this.transactionDataService.addPurchase(data).subscribe(res => {
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
        this.creditAmount = '';
        this.addCredit = false;
        this.salesmanID = '';
        this.salesmanName = '';
        this.salesmanPhone = '';
        this.salesmanEmail = '';
        this.salesmanVatno = '';
        this.salesmanCredit = '';
        this.salesmanData = { };
        this.salesmanNew = true;

        this.selectedItem = null;
        this.selectedItemCode = null;
        this.itemsList = [ ];
        this.ngSelectComponent.clearModel();
        this.itemSearch({ term: null });
    }

    salesmanGet() {
        let query = { }
        let ch = false;
        if (this.salesmanID != null || this.salesmanID != '' || this.salesmanID != this.salesmanData.id) {
            this.salesmanNew = false;
        } else {
            this.salesmanNew = true;
        }
        if (this.salesmanID != null && this.salesmanID != '' && this.salesmanID.length == 8 && this.salesmanID != this.salesmanData.id) {
            console.log(this.salesmanID != this.salesmanData.id, this.salesmanID, this.salesmanData.id);
            query['id'] = this.salesmanID; ch = true;
        } else if (this.salesmanPhone != null && this.salesmanPhone != '' && !isNaN(Number(this.salesmanPhone)) && this.salesmanPhone.length >= 10 && this.salesmanPhone.length <= 12 && this.salesmanPhone != this.salesmanData.phone) {
            query['phone'] = Number(this.salesmanPhone); ch = true;
        }else if (this.salesmanEmail != null && this.salesmanEmail != '' && this.salesmanEmail != this.salesmanData.email) {
            console.log(this.salesmanEmail != this.salesmanData.email, this.salesmanEmail, this.salesmanData.email);
            query['email'] = this.salesmanEmail; ch = true;
        }
        if (ch) {
            console.log(query);
            this.transactionDataService.salesmanGet(query).subscribe (
                res => {
                    console.log(res);
                    if (res.found) {
                        this.salesmanID = res.id;
                        this.salesmanName = res.name;
                        this.salesmanPhone = res.phone;
                        this.salesmanEmail = res.email;
                        this.salesmanVatno = res.vatno;
                        this.salesmanCredit = res.credit;
                        this.salesmanNew = false;
                        this.salesmanData = res;
                    }
                    //this.itemsList = res;
                }
            );
        }
    }
    salesmanAdd() {
        let query = {
            name: this.salesmanName,
            phone: this.salesmanPhone,
            email: this.salesmanEmail,
            vatno: this.salesmanVatno,
            credit: '0.00'
        }
        if (query.name == '' || query.phone == '') {
            this.toastr.error('Enter user info', 'User Info');
            return;
        }
        console.log(query);
        this.transactionDataService.salesmanAdd(query).subscribe (
            res => {
                console.log(res);
                if (!res.err) {
                    this.salesmanID = res.id;
                    this.toastr.success('Saved successfully!', 'User Info');
                    this.salesmanNew = false;
                    this.salesmanData = res;
                }
            }
        );
    }
    salesmanUpdate() {
        let query = {
            id: this.salesmanID,
            name: this.salesmanName,
            phone: this.salesmanPhone,
            email: this.salesmanEmail,
            vatno: this.salesmanVatno,
            credit: this.salesmanCredit
        }
        console.log(query);
        this.transactionDataService.salesmanUpdate(query).subscribe (
            res => {
                if (!res.err) {
                    console.log(res);
                    this.toastr.success('Updated successfully!', 'User Info');
                }
            }
        );
    }
    salesmanClear() {
        this.salesmanID = '';
        this.salesmanName = '';
        this.salesmanPhone = '';
        this.salesmanEmail = '';
        this.salesmanVatno = '';
        this.salesmanCredit = '';
        this.salesmanData = { };
        this.salesmanNew = true;
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
        this.transactionDataService.getPurchasesCount(query).subscribe (
            resCount => {
                console.log(resCount);
                this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.purchaseLimit)}, (_, i) => i + 1);
                this.transactionDataService.getPurchases(query).subscribe (
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