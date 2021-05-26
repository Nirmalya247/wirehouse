import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ReturnDataService } from '../../services/return-data.service';
import { SaleDataService } from '../../services/sale-data.service';
import { environment } from '../../../environments/environment';
import { ReturnCreate, ReturnItemCreate } from '../../data/return';

@Component({
    templateUrl: 'return-item.component.html',
    styleUrls: ['return-item.css']
})

export class ReturnItemComponent implements OnInit {
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;

    serverPath = environment.PATH;

    items: Array<ReturnItemCreate> = [];



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

    reasons = [
        { label: 'Expired' }, { label: 'Not Selling' }
    ];


    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private returnDataService: ReturnDataService,
        private saleDataService: SaleDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.itemSearch({ term: null });
        this.getPurchaseTable(null);
        // generate random values for mainChart
    }
    reasonSearch(event, i) {
        this.items[i].reason = event.term;
    }
    reasonChange(event) {

    }
    addItem() {
        if ((this.selectedItem != null || this.selectedItem != undefined) && ! this.items.some(item => item.batchno == this.selectedItem.id)) {
            let newItem = <ReturnItemCreate> {
                id: null,
                returnid: null,
                itemcode: this.selectedItem.itemcode,
                itemname: this.selectedItem.itemname,
                batchno: this.selectedItem.id,
                qtystock: this.selectedItem.qtystock,
                qty: 1,
                price: this.selectedItem.cost,
                discount: this.selectedItem.discount,
                discountamount: 0,
                totalcost: 0, 
                purchasedate: this.selectedItem.createdAt,
                mfg: this.selectedItem.mfg,
                expiry: this.selectedItem.expiry,
                vendorid: this.selectedItem.vendorid,
                reason: ''
            };
            this.items.push(newItem);
            if (this.items.length == 1) {
                this.saleDataService.vendorGet({ id: this.selectedItem.vendorid }).subscribe (
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
                        }
                    }
                );
            }
            this.itemSearch(this.selectedTerm);
            this.changeQTY(this.items.length - 1);
        }
    }
    changeQTY(i) {
        let discount = Number(this.items[i].discount);
        let discountamount = Number(this.items[i].discountamount);
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
        total = (total - discount - discountamount);
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
        console.log(this.items);
    }
    cancelPurchase() {

    }
    /*
    addItem() {
    }
    */
    removeItem(i) {
        if (i < this.items.length) {
            this.items.splice(i, 1);
        }
        // this.calculateTotalAmmount();
    }
    /*
    changeTendered() {
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
            this.items[i].expiry = this.items[i].expiry + '-01';
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
    */





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

    selectedItem: any;
    selectedItemCode;
    selectedTerm;

    itemsList: Array<any>;
    itemSearch(event) {
        this.selectedTerm = event;
        let query = {
            limit: 20,
            orderBy: 'itemname',
            order: 'asc',
            searchText: event.term,
            page: 1
        }
        if (this.items.length > 0) query['vendorid'] = this.items[0].vendorid;
        this.returnDataService.getBatch(query).subscribe (
            res => {
                console.log(res);
                for (var i = 0; i < res.length; i++) {
                    res[i]['itemlabel'] = `(${res[i].id}), (${res[i].purchaseId}) ${res[i].itemname}`;
                    if (this.items.some(item => item.batchno == res[i].id)) {
                        res.splice(i, 1);
                        i--;
                    }
                }
                console.log(res);
                this.itemsList = res;
            }
        );
    }
    searchFn(term: string, item: any) {
        return true;
    }
    itemChange(event) {
        this.selectedItem = event;
        console.log(this.selectedItem);
    }

    //***********
    purchases: Array<ReturnCreate>;
    pages: Array<number>;
    purchasePage = 1;
    purchaseLimit = 10;
    purchaseOrderBy = 'createdAt';
    purchaseOrder = 'desc';
    purchaseSearchText = '';
    getPurchaseTable(pageNo) {

    }
    /*
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
    */
}