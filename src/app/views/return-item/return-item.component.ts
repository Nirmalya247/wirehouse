import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ReturnDataService } from '../../services/return-data.service';
import { SaleDataService } from '../../services/sale-data.service';
import { MessageDataService } from '../../services/message-data.service';
import { environment } from '../../../environments/environment';
import { ReturnCreate, ReturnItemCreate } from '../../data/return';

@Component({
    templateUrl: 'return-item.component.html',
    styleUrls: ['return-item.css']
})

export class ReturnItemComponent implements OnInit {
    @ViewChild('confirmForm') public confirmForm: ModalDirective;
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;

    serverPath = environment.PATH;

    items: Array<ReturnItemCreate> = [];



    billID: string;
    dueDate: string;
    totalAmount: string;
    totalDiscount: string;
    taxable: string;
    paymentMode: string = 'cash';
    cumulativeAmount: string = '0.00';
    totalTendered: string;
    changeDue: string = '0.00';
    dueAmount: string = '0.00';
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
        private messageDataService: MessageDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.itemSearch({ term: null });
        this.getReturnTable(null);
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
                batchcode: this.selectedItem.stockid,
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
    confirmReturn() {
        let totalQTY = 0;
        for (let i = 0; i < this.items.length; i++) {
            totalQTY += isNaN(Number(this.items[i].qty)) ? 0 : Number(this.items[i].qty);
        }
        if (this.items.length == 0) {
            this.toastr.error('Nothing in the cart', 'Attention');
            return;
        }
        let data = {
            totalItem:  this.items.length,
            totalQTY: totalQTY,
            totalAmount: isNaN(Number(this.cumulativeAmount)) ? 0 : Number(this.cumulativeAmount),
            totalTendered: isNaN(Number(this.totalTendered)) ? 0 : Number(this.totalTendered),
            changeDue: isNaN(Number(this.changeDue)) ? 0 : Number(this.changeDue),
            dueAmount: isNaN(Number(this.dueAmount)) ? 0 : Number(this.dueAmount),
            dueDate: this.dueDate,
            paymentMode: this.paymentMode,
            vendorID: this.vendorID,
            vendorFName: this.vendorFName,
            vendorLName: this.vendorLName,
            vendorCompany: this.vendorCompany,
            vendorPhone: this.vendorPhone,
            vendorEmail: this.vendorEmail,
            userID: this.authGuardService.id,
            userName: this.authGuardService.name,
            items: this.items
        }
        this.returnDataService.add(data).subscribe(res => {
            // console.log(res);
            if (!res.err) {
                this.toastr.success('Retun successful', 'Done!');
                this.cancelReturn();
                this.getReturnTable(this.page);
                // window.open(environment.PATH + 'purchase-bill?purchaseId=' + res.id.toString() + '&paper=A4');
                window.open(environment.PATH + 'return-bill?returnId=' + res.id.toString() + '&paper=A4V2');
                let data = {
                    messageId: 9,
                    vandorId: this.vendorID,
                    returnId: res.id,
                    shopId: 1
                };
                this.messageDataService.sendMessage(data).subscribe(resMessage => {
                    if (resMessage.err) this.toastr.error('email could not be sent', 'Error!');
                    else this.toastr.success('email sent', 'Done!');
                });
                data.messageId = 10;
                this.messageDataService.sendMessage(data).subscribe(resMessage => {
                    if (resMessage.err) this.toastr.error('text could not be sent', 'Error!');
                    else this.toastr.success('text sent', 'Done!');
                });
            } else {
                this.toastr.error('Retun unsuccessful', 'Attention');
            }
        });
    }
    cancelReturn() {
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

        this.selectedItem = null;
        this.selectedItemCode = null;
        this.itemsList = [ ];
        this.ngSelectComponent.clearModel();
        this.itemSearch({ term: null });
    }
    removeItem(i) {
        if (i < this.items.length) {
            this.items.splice(i, 1);
        }
        this.calculateTotalAmmount();
    }

    deleteReturnId = 0;
    deleteReturn(returnId) {
        this.deleteReturnId = returnId;
        this.confirmForm.show();
    }

    confirmFormHide() {
        this.deleteReturnId = 0;
        this.confirmForm.hide();
    }

    confirmFormSave() {
        this.returnDataService.deleteReturn({ id: this.deleteReturnId }).subscribe(res => {
            if (!res.err) {
                this.toastr.success('delete successful', 'Done!');
                this.confirmFormHide()
                this.getReturnTable(this.page);
            } else {
                this.toastr.error('delete unsuccessful', 'Attention!');
            }
        });
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
                    res[i]['itemlabel'] = `(${res[i].stockid}), (${res[i].purchaseId}) ${res[i].itemname}`;
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
    returns: Array<ReturnCreate> = [ ];
    pages: Array<number> = [ ];
    page = 1;
    limit = 10;
    orderBy = 'createdAt';
    order = 'desc';
    searchText = '';

    getTablePages(pageNo, pages) {
        var start = pageNo - 4;
        var end = pageNo + 4 + (start < 1 ? 1 - start : 0);
        start = (end > pages.length ? start - (end - pages.length) : start);
        start = start < 1 ? 1 : start;
        end = end > pages.length ? pages.length : end;
        var p = [ ];
        for (var i = start; i <= end; i++) p.push(i);
        return p;
    }

    getReturnTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.page - 1;
            if (pageNo == -2) pageNo = this.page + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.pages.length;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.page = pageNo;
        }
        else this.page = 1;
        let query = {
            limit: this.limit,
            orderBy: this.orderBy,
            order: this.order,
            searchText: this.searchText,
            page: this.page
        }
        this.returnDataService.getReturnsCount(query).subscribe (
            resCount => {
                console.log(resCount);
                this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.limit)}, (_, i) => i + 1);
                this.returnDataService.getReturns(query).subscribe (
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].createdAt = new Date(res[i].createdAt.toString());
                        }
                        this.returns = res;
                    }
                );
            }
        );
        console.log(this.limit, this.orderBy, this.order, this.searchText);
    }
}