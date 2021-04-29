import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemDataService } from '../../services/item-data.service';
import { TransactionDataService } from '../../services/transaction-data.service';
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Item, ItemTransaction } from '../../data/item';

@Component({
    templateUrl: 'transactions.component.html'
})
export class TransactionsComponent implements OnInit {

    items: Array<ItemTransaction> = [];
    vat: string;
    discount: string;
    discountValue: string;
    paymentMode: string;
    totalAmount: string;
    totalTendered: string;
    changeDue: string;
    creditAmount: string;
    addCredit: boolean = false;

    customerID: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerCredit: string;
    customerData: any = { };
    customerNew: boolean = true;


    constructor(
        public authService: AuthService,
        public router: Router,
        private itemDataService: ItemDataService,
        private transactionDataService: TransactionDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.itemSearch({ term: null });
        // generate random values for mainChart
    }
    addItem() {
        if (this.selectedItem != null || this.selectedItem != undefined) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].itemcode == this.selectedItem.itemcode) return;
            }
            let newItem = <ItemTransaction>{
                itemcode: this.selectedItem.itemcode,
                itemname: this.selectedItem.itemname,
                qtyAvailable: this.selectedItem.qty,
                price: this.selectedItem.price,
                qty: 1,
                totalPrice: this.selectedItem.price
            };
            this.items.push(newItem);
            this.calculateTotalAmmount();
        }
    }
    removeItem(i) {
        if (i < this.items.length) {
            this.items.splice(i, 1);
        }
        this.calculateTotalAmmount();
    }
    changeQTY(i) {
        if (isNaN(Number(this.items[i].qty))) this.items[i].qty = 1;
        if (this.items[i].qty > this.items[i].qtyAvailable) this.items[i].qty = this.items[i].qtyAvailable;
        if (this.items[i].qty < 0) this.items[i].qty = 0;
        this.items[i].totalPrice = Number(this.items[i].qty) * Number(this.items[i].price);
        if (isNaN(Number(this.items[i].totalPrice))) this.items[i].totalPrice = 0;
        this.calculateTotalAmmount();
    }
    calculateTotalAmmount() {
        let vat = Number(this.vat);
        let discount = Number(this.discount);
        let oldCredit = Number(this.customerCredit);
        if (isNaN(vat)) vat = 0;
        if (isNaN(discount)) discount = 0;
        if (isNaN(oldCredit) || !this.addCredit) oldCredit = 0;

        let cost = 0;
        for (let i = 0; i < this.items.length; i++) cost += Number(this.items[i].totalPrice);

        discount = cost * discount / 100;
        cost = (cost - discount)*(1 + vat / 100);
        cost += oldCredit;

        this.discountValue = discount.toFixed(2);
        this.totalAmount = cost.toFixed(2);
        this.changeTendered();
    }
    changeTendered() {
        let cost = Number(this.totalAmount);
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

    confirmTransaction() {
        if (this.customerNew) {
            this.toastr.error('Attention', 'Save User First');
            return;
        }
        var data = {
            vat: 5
        }
    }
    cancelTransaction() {
        // console.log('cancel');
        // this.transactionDataService.addTransaction({ msg: 'hi', data: [ { name: 'ram', roll: 4 }, { name: 'sham', roll: 8 } ] }).subscribe (
        //     res => {
        //         console.log(res);
        //     }
        // );
        console.log(this.items, this.selectedItem);
    }

    customerGet() {
        let query = { }
        let ch = false;
        if (this.customerID != null || this.customerID != '' || this.customerID != this.customerData.id) {
            this.customerNew = true;
        } else {
            this.customerNew = false;
        }
        if (this.customerID != null && this.customerID != '' && this.customerID.length == 8 && this.customerID != this.customerData.id) {
            console.log(this.customerID != this.customerData.id, this.customerID, this.customerData.id);
            query['id'] = this.customerID; ch = true;
        } else if (this.customerPhone != null && this.customerPhone != '' && !isNaN(Number(this.customerPhone)) && this.customerPhone.length >= 10 && this.customerPhone.length <= 12 && this.customerPhone != this.customerData.phone) {
            query['phone'] = Number(this.customerPhone); ch = true;
        }else if (this.customerEmail != null && this.customerEmail != '' && this.customerEmail != this.customerData.email) {
            console.log(this.customerEmail != this.customerData.email, this.customerEmail, this.customerData.email);
            query['email'] = this.customerEmail; ch = true;
        }
        if (ch) {
            console.log(query);
            this.transactionDataService.customerGet(query).subscribe (
                res => {
                    console.log(res);
                    if (res.found) {
                        this.customerID = res.id;
                        this.customerName = res.name;
                        this.customerPhone = res.phone;
                        this.customerEmail = res.email;
                        this.customerCredit = res.credit;
                        this.customerNew = false;
                        this.customerData = res;
                    }
                    //this.itemsList = res;
                }
            );
        }
    }
    customerAdd() {
        let query = {
            name: this.customerName,
            phone: this.customerPhone,
            email: this.customerEmail,
            credit: '0.00'
        }
        console.log(query);
        this.transactionDataService.customerAdd(query).subscribe (
            res => {
                console.log(res);
                if (!res.err) {
                    this.customerID = res.id;
                    this.toastr.success('User Info', 'Saved successfully!');
                    this.customerNew = false;
                    this.customerData = res;
                }
            }
        );
    }
    customerUpdate() {
        let query = {
            id: this.customerID,
            name: this.customerName,
            phone: this.customerPhone,
            email: this.customerEmail,
            credit: this.customerCredit
        }
        console.log(query);
        this.transactionDataService.customerUpdate(query).subscribe (
            res => {
                if (!res.err) {
                    console.log(res);
                    this.toastr.success('User Info', 'Updated successfully!');
                }
            }
        );
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
}