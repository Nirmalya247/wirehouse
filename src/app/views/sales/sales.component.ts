import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ItemDataService } from '../../services/item-data.service';
import { SaleDataService } from '../../services/sale-data.service';
import { MessageDataService } from '../../services/message-data.service';
import { environment } from '../../../environments/environment';
import { Item, ItemSale } from '../../data/item';
import { Sale } from '../../data/transaction';

@Component({
    templateUrl: 'sales.component.html',
    styleUrls: ['sales.css']
})

export class SalesComponent implements OnInit {
    @ViewChild('confirmForm') public confirmForm: ModalDirective;
    @ViewChild('dueConfirmForm') public dueConfirmForm: ModalDirective;
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;
    @ViewChild('FindCustomer') ngSelectCustomer: NgSelectComponent;

    serverPath = environment.PATH;

    items: Array<ItemSale> = [];
    totalAmount: string = '0.00';
    discountPercent: string;
    discountAmount: string;
    totalDiscount: string;
    taxable: string
    purchaseCost: string = '0.00';
    vatValue: string = '0e';
    vatPercent: string = '0';
    paymentMode: string = 'cash';
    cumulativeAmount: string = '0.00';
    totalTendered: string;
    changeDue: string = '0.00';
    creditAmount: string = '0.00';
    addCredit: boolean = false;


    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private itemDataService: ItemDataService,
        private saleDataService: SaleDataService,
        private messageDataService: MessageDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.itemSearch({ term: null });
        this.getSaleTable(null);
        // generate random values for mainChart
    }
    upBillId = '';
    getDataToUpdate() {
        var tBillId = this.upBillId;
        this.cancelSale();
        this.upBillId = tBillId;
        this.saleDataService.getOldSale({ saleId: this.upBillId }).subscribe(res => {
            console.log(this.upBillId, res);
            this.discountPercent = res.sale.discount;
            this.discountAmount = res.sale.discountamount;
            this.vatPercent = res.sale.vat;
            if (Number(res.sale.vat) == 0) this.vatValue = '0e'; else this.vatValue = '13';
            this.paymentMode = res.sale.paymentMode;
            this.totalTendered = res.sale.totalTendered;
            this.saleDataService.customerGet({ id: res.sale.customerID }).subscribe(
                resCustomer => {
                    console.log(resCustomer);
                    if (resCustomer.found) {
                        this.customerID = resCustomer.id;
                        this.customerName = resCustomer.name;
                        this.customerPhone = resCustomer.phone;
                        this.customerEmail = resCustomer.email;
                        this.customerCredit = (Number(resCustomer.credit) - Number(res.sale.creditAmount)).toString();
                        this.customerCreditLimit = resCustomer.creditlimit;
                        this.customerNew = false;
                        this.customerData = resCustomer;
                        this.calculateTotalAmmount();
                    }
                }
            );
            for (var i = 0; i < res.items.length; i++) {
                let newItem = <ItemSale>{
                    id: res.items[i].salesitem.id,
                    stockid: res.items[i].stock.id,
                    stockcode: res.items[i].stock.stockid,
                    itemcode: res.items[i].item.itemcode,
                    itemname: res.items[i].item.itemname,
                    rack: res.items[i].stock.rack,
                    hsn: res.items[i].item.hsn,
                    qtystock: res.items[i].item.qty < 0 ? -1 : res.items[i].stock.qtystock + res.items[i].salesitem.qty,
                    cost: res.items[i].item.qty < 0 ? 0 : res.items[i].stock.cost,
                    qty: res.items[i].salesitem.qty,
                    price: res.items[i].salesitem.price,
                    discount: res.items[i].salesitem.discount,
                    discountamount: res.items[i].salesitem.discountamount,
                    vat: res.items[i].salesitem.vat,
                    totalprice: 0,
                    mfg: res.items[i].stock.mfg,
                    expiry: res.items[i].stock.expiry,
                    vendorid: res.items[i].stock.vendorid,
                    vendorfname: '',
                    vendorlname: '',
                    vendorcompany: '',
                    vendorphone: '',
                    vendoremail: ''
                };
                this.items.push(newItem);
                this.changeQTY(this.items.length - 1);
            }
        });
    }

    stockChange(i) {
        console.log(this.items[i].stockcode);
        this.saleDataService.getSaleItemByStock({ stockid: this.items[i].stockcode }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.items[i].id = null;
                this.items[i].stockid = res.itemUpdate.id;
                this.items[i].stockcode = res.itemUpdate.stockid;
                this.items[i].itemcode = res.item.itemcode;
                this.items[i].itemname = res.item.itemname;
                this.items[i].rack = res.itemUpdate.rack;
                this.items[i].hsn = res.item.hsn;
                this.items[i].qtystock = res.itemUpdate.qtystock;
                this.items[i].cost = res.itemUpdate.cost;
                this.items[i].qty = 1;
                this.items[i].price = res.itemUpdate.price;
                this.items[i].discount = res.item.discount;
                this.items[i].discountamount = 0;
                this.items[i].vat = res.item.vat;
                this.items[i].totalprice = res.itemUpdate.price;
                this.items[i].mfg = res.itemUpdate.mfg;
                this.items[i].expiry = res.itemUpdate.expiry;
                this.items[i].vendorid = res.itemUpdate.vendorid;
                this.items[i].vendorfname = res.itemUpdate.vendorfname;
                this.items[i].vendorlname = res.itemUpdate.vendorlname;
                this.items[i].vendorcompany = res.itemUpdate.vendorcompany;
                this.items[i].vendorphone = res.itemUpdate.vendorphone;
                this.items[i].vendoremail = res.itemUpdate.vendoremail;
                this.calculateTotalAmmount();
            }
        });
    }
    expError(exp) {
        if (exp) {
            exp = exp.toString();
            let today = new Date();
            let expdate = new Date(exp)
            return Math.ceil(Math.abs(today.getTime() - expdate.getTime()) / (1000 * 60 * 60 * 24)) < 90;
        } else return false;
    }
    addItem() {
        if (this.selectedItem != null || this.selectedItem != undefined) {
            if (this.selectedItem.qty < 0) {
                let newItem = <ItemSale>{
                    id: null,
                    stockid: null,
                    stockcode: null,
                    itemcode: this.selectedItem.itemcode,
                    itemname: this.selectedItem.itemname,
                    rack: null,
                    hsn: this.selectedItem.hsn,
                    qtystock: -1,
                    cost: 0,
                    qty: 1,
                    price: this.selectedItem.price,
                    discount: 0,
                    discountamount: 0,
                    vat: 0,
                    totalprice: this.selectedItem.price,
                    mfg: null,
                    expiry: null,
                    vendorid: null,
                    vendorfname: null,
                    vendorlname: null,
                    vendorcompany: null,
                    vendorphone: null,
                    vendoremail: null
                };
                this.items.push(newItem);
                this.changeQTY(this.items.length - 1);
            } else {
                this.saleDataService.getSaleItem({ itemcode: this.selectedItem.itemcode }).subscribe(res => {
                    for (let i = 0; i < res.length; i++) {
                        let newBatch = true;
                        for (let j = 0; j < this.items.length; j++) {
                            if (this.items[j].stockid && this.items[j].stockid.toString() == res[i].id.toString()) {
                                newBatch = false;
                                break;
                            }
                        }
                        if (newBatch) {
                            let newItem = <ItemSale>{
                                id: null,
                                stockid: res[i].id,
                                stockcode: res[i].stockid,
                                itemcode: this.selectedItem.itemcode,
                                itemname: this.selectedItem.itemname,
                                rack: res[i].rack,
                                hsn: this.selectedItem.hsn,
                                qtystock: res[i].qtystock,
                                cost: res[i].cost,
                                qty: 1,
                                price: res[i].price,
                                discount: this.selectedItem.discount,
                                discountamount: 0,
                                vat: this.selectedItem.vat,
                                totalprice: res[i].price,
                                mfg: res[i].mfg,
                                expiry: res[i].expiry,
                                vendorid: res[i].vendorid,
                                vendorfname: res[i].vendorfname,
                                vendorlname: res[i].vendorlname,
                                vendorcompany: res[i].vendorcompany,
                                vendorphone: res[i].vendorphone,
                                vendoremail: res[i].vendoremail
                            };
                            this.items.push(newItem);
                            this.changeQTY(this.items.length - 1);
                            break;
                        }
                    }
                });
            }
            // for (let i = 0; i < this.items.length; i++) {
            //     if (this.items[i].itemcode == this.selectedItem.itemcode) return;
            // }
            // let newItem = <ItemTransaction>{
            //     itemcode: this.selectedItem.itemcode,
            //     itemname: this.selectedItem.itemname,
            //     qtyAvailable: this.selectedItem.qty,
            //     price: this.selectedItem.price,
            //     qty: 1,
            //     totalPrice: this.selectedItem.price
            // };
            // this.items.push(newItem);
            // this.calculateTotalAmmount();
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
        if (this.items[i].qtystock >= 0 && this.items[i].qty > this.items[i].qtystock) this.items[i].qty = this.items[i].qtystock;
        if (this.items[i].qty < 0) this.items[i].qty = 0;
        let total = Number(this.items[i].qty) * Number(this.items[i].price);
        discount = total * discount / 100;
        if (total - discount - discountamount <= 0) {
            discountamount = total - discount;
            this.items[i].discountamount = discountamount;
        }
        total = (total - discount - discountamount) * (1 + vat / 100);
        this.items[i].totalprice = total;
        if (isNaN(Number(this.items[i].totalprice))) this.items[i].totalprice = 0;
        this.items[i].totalprice = Number(this.items[i].totalprice.toFixed(2));
        this.calculateTotalAmmount();
    }
    calculateTotalAmmount() {
        if (this.vatValue == '0n' || this.vatValue == '0e' || this.vatValue == '0p') this.vatPercent = '0';
        else this.vatPercent = '13';
        let purchaseCost = 0;
        let totalAmount = 0;
        let totalDiscount = 0;
        let taxable = 0;
        let cumulativeAmount = 0;
        let discountPercent = isNaN(Number(this.discountPercent)) ? 0 : Number(this.discountPercent);
        let discountAmount = isNaN(Number(this.discountAmount)) ? 0 : Number(this.discountAmount);
        let vatPercent = isNaN(Number(this.vatPercent)) ? 0 : Number(this.vatPercent);

        let oldCredit = Number(this.customerCredit);
        if (isNaN(oldCredit) || !this.addCredit) oldCredit = 0;

        for (let i = 0; i < this.items.length; i++) {
            purchaseCost += Number(this.items[i].qty) * Number(this.items[i].cost);
            let amount = Number(this.items[i].qty) * Number(this.items[i].price);
            let discount = amount * Number(this.items[i].discount) / 100 + Number(this.items[i].discountamount);
            totalAmount += amount;
            totalDiscount += discount;
            taxable += (amount - discount);
            cumulativeAmount += Number(this.items[i].totalprice);
        }
        taxable = cumulativeAmount - cumulativeAmount * discountPercent / 100 - discountAmount;
        cumulativeAmount = taxable + taxable * vatPercent / 100;
        // console.log((Number(this.totalTendered) - cumulativeAmount) + Number(this.customerCredit), Number(this.customerCreditLimit))
        cumulativeAmount += oldCredit;
        if (purchaseCost > cumulativeAmount) {
            this.toastr.error("payable is too low", "Attention!")
        }

        this.purchaseCost = purchaseCost.toFixed(2);
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
                this.customerCreditError = false;
            } else {
                due *= -1;
                this.creditAmount = due.toFixed(2);
                this.changeDue = '0.00';
                if (!this.addCredit && (Number(this.customerCredit) + due) > Number(this.customerCreditLimit)) this.customerCreditError = true;
                else this.customerCreditError = false;
            }
        }
    }

    confirmSale() {
        if (this.customerNew) {
            this.toastr.error('Save User First', 'Attention');
            return;
        }
        if (this.paymentMode == undefined) {
            this.toastr.error('select payment mode', 'Attention');
            return;
        }
        let saleItems = [];
        let totalQTY = 0;
        for (let i = 0; i < this.items.length; i++) {
            totalQTY += isNaN(Number(this.items[i].qty)) ? 0 : Number(this.items[i].qty);
            saleItems.push({
                id: this.items[i].id,
                stockid: this.items[i].stockid ? this.items[i].stockid : null,
                stockcode: this.items[i].stockcode ? this.items[i].stockcode : null,
                itemcode: this.items[i].itemcode,
                itemname: this.items[i].itemname,
                hsn: this.items[i].hsn,
                price: this.items[i].price,
                qty: this.items[i].qty,
                discount: this.items[i].discount,
                discountamount: this.items[i].discountamount,
                vat: this.items[i].vat,
                totalPrice: this.items[i].totalprice,
                mfg: this.items[i].mfg,
                expiry: this.items[i].expiry
            });
        }
        if (this.addCredit) saleItems.push({
            itemcode: 'credit' + this.customerID,
            itemname: 'credit amount',
            price: this.customerCredit,
            qty: '1',
            totalPrice: this.customerCredit
        });
        if (saleItems.length == 0) {
            this.toastr.error('Nothing in the cart', 'Attention');
            return;
        }
        let data = {
            id: this.upBillId,
            totalItem: this.items.length,
            totalQTY: totalQTY,
            paymentMode: this.paymentMode,
            totalPurchaseCost: isNaN(Number(this.purchaseCost)) ? 0 : Number(this.purchaseCost),
            totalAmount: isNaN(Number(this.totalAmount)) ? 0 : Number(this.totalAmount),
            discount: isNaN(Number(this.discountPercent)) ? 0 : Number(this.discountPercent),
            discountamount: isNaN(Number(this.discountAmount)) ? 0 : Number(this.discountAmount),
            totalTaxable: isNaN(Number(this.taxable)) ? 0 : Number(this.taxable),
            vat: isNaN(Number(this.vatPercent)) ? 0 : Number(this.vatPercent),
            totalCost: isNaN(Number(this.cumulativeAmount)) ? 0 : Number(this.cumulativeAmount),
            cumulativeAmount: isNaN(Number(this.cumulativeAmount)) ? 0 : Number(this.cumulativeAmount),
            totalTendered: isNaN(Number(this.totalTendered)) ? 0 : Number(this.totalTendered),
            changeDue: isNaN(Number(this.changeDue)) ? 0 : Number(this.changeDue),
            creditAmount: isNaN(Number(this.creditAmount)) ? 0 : Number(this.creditAmount),
            addCredit: this.addCredit ? 1 : 0,
            customerID: this.customerID,
            customerName: this.customerName,
            customerPhone: this.customerPhone,
            customerEmail: this.customerEmail,
            customerCredit: isNaN(Number(this.customerCredit)) ? 0 : Number(this.customerCredit),
            userID: this.authGuardService.id,
            userName: this.authGuardService.name,
            items: saleItems
        }
        console.log(data);
        this.saleDataService.addSale(data).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success('Sale successful', 'Done!');
                this.getSaleTable(this.salePage);
                window.open(environment.PATH + 'sale-bill?saleId=' + res.id.toString() + '&key=' + res.key.toString() + '&paper=A4V2');
                let data = {
                    messageId: 7,
                    customerId: this.customerID,
                    salesId: res.id,
                    shopId: 1
                };
                this.messageDataService.sendMessage(data).subscribe(resMessage => {
                    if (resMessage.err) this.toastr.error('email could not be sent', 'Error!');
                    else this.toastr.success('email sent', 'Done!');
                });
                data.messageId = 8;
                this.messageDataService.sendMessage(data).subscribe(resMessage => {
                    if (resMessage.err) this.toastr.error('text could not be sent', 'Error!');
                    else this.toastr.success('text sent', 'Done!');
                });
                this.cancelSale();
            } else {
                this.toastr.error('Sale unsuccessful', 'Attention');
            }
        });
    }


    cancelSale() {
        this.items = [];
        this.totalAmount = '0.00';
        this.totalDiscount = '';
        this.taxable = '';
        this.cumulativeAmount = '0.00';
        this.paymentMode = 'cash';
        this.totalAmount = '';
        this.totalTendered = '';
        this.changeDue = '0.00';
        this.creditAmount = '0.00';
        this.addCredit = false;
        this.upBillId = '';
        this.customerID = '';
        this.customerName = '';
        this.customerPhone = '';
        this.customerEmail = '';
        this.customerCredit = '0.00';
        this.customerCreditLimit = '';
        this.customerData = {};
        this.customerNew = true;

        this.selectedItem = null;
        this.selectedItemCode = null;
        this.itemsList = [];
        this.ngSelectComponent.clearModel();
        this.ngSelectCustomer.clearModel();
        this.itemSearch({ term: null });
    }

    deleteSaleId = 0;
    deleteSale(saleId) {
        this.deleteSaleId = saleId;
        this.confirmForm.show();
    }

    confirmFormHide() {
        this.deleteSaleId = 0;
        this.confirmForm.hide();
    }

    confirmFormSave() {
        this.saleDataService.deleteSale({ id: this.deleteSaleId }).subscribe(res => {
            if (!res.err) {
                this.toastr.success('delete successful', 'Done!');
                this.confirmFormHide()
                this.getSaleTable(this.salePage);
            } else {
                this.toastr.error('delete unsuccessful', 'Attention!');
            }
        });
    }




    customerList = [];

    customerID: string = '';
    customerName: string = '';
    customerPhone: string = '';
    customerEmail: string = '';
    customerCredit: string = '0.00';
    customerCreditLimit: string;
    customerCreditError = false;
    customerData: any = {};
    customerNew: boolean = true;
    customerHasCredit = false;
    customerSearch(event) {
        let query = {
            limit: 20,
            orderby: 'name',
            order: 'asc',
            searchText: event.term,
            page: 1
        }
        this.saleDataService.getCustomer(query).subscribe(
            res => {
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    res[i].label = `${res[i].name} <${res[i].id}>`;
                }
                this.customerList = res;
            }
        );
    }
    customerChange(event) {
        if (event) {
            this.customerID = event.id;
            this.customerName = event.name;
            this.customerPhone = event.phone;
            this.customerEmail = event.email;
            this.customerCredit = event.credit;
            this.customerCreditLimit = event.creditlimit;
            this.customerNew = false;
            this.customerData = event;
            this.calculateTotalAmmount();
        } else {
            this.customerID = '';
            this.customerName = '';
            this.customerPhone = '';
            this.customerEmail = '';
            this.customerCredit = '0.00';
            this.customerCreditLimit = '';
            this.customerData = {};
            this.customerNew = true;
        }
        this.customerHasCredit = Number(this.customerCredit) > 0;
    }
    customerSearchFn() {
        return true;
    }
    customerGet() {
        let query = {}
        let ch = false;
        if (this.customerID != null && this.customerID != '' && this.customerID.length >= 3 && this.customerID != this.customerData.id) {
            console.log(this.customerID != this.customerData.id, this.customerID, this.customerData.id);
            query['id'] = this.customerID; ch = true;
        } else if (this.customerPhone != null && this.customerPhone != '' && !isNaN(Number(this.customerPhone)) && this.customerPhone.length >= 10 && this.customerPhone.length <= 12 && this.customerPhone != this.customerData.phone) {
            query['phone'] = Number(this.customerPhone); ch = true;
        } else if (this.customerEmail != null && this.customerEmail != '' && this.customerEmail != this.customerData.email) {
            console.log(this.customerEmail != this.customerData.email, this.customerEmail, this.customerData.email);
            query['email'] = this.customerEmail; ch = true;
        }
        if (ch) {
            console.log(query);
            this.saleDataService.customerGet(query).subscribe(
                res => {
                    console.log(res);
                    if (res.found) {
                        this.customerID = res.id;
                        this.customerName = res.name;
                        this.customerPhone = res.phone;
                        this.customerEmail = res.email;
                        this.customerCredit = res.credit;
                        this.customerCreditLimit = res.creditlimit;
                        this.customerNew = false;
                        this.customerData = res;
                        this.calculateTotalAmmount();
                        this.customerHasCredit = Number(this.customerCredit) > 0;
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
            credit: '0.00',
            creditlimit: this.customerCreditLimit,
            qty: 0,
            amount: 0,
            count: 0
        }
        if (query.name == '' || query.phone == '') {
            this.toastr.error('Enter user info', 'User Info');
            return;
        }
        console.log(query);
        this.saleDataService.customerAdd(query).subscribe(
            res => {
                console.log(res);
                if (!res.err) {
                    this.customerID = res.id;
                    this.toastr.success('Saved successfully!', 'User Info');
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
            creditlimit: this.customerCreditLimit
        }
        console.log(query);
        this.saleDataService.customerUpdate(query).subscribe(
            res => {
                if (!res.err) {
                    console.log(res);
                    this.toastr.success('Updated successfully!', 'User Info');
                }
            }
        );
    }
    customerClear() {
        this.customerID = '';
        this.customerName = '';
        this.customerPhone = '';
        this.customerEmail = '';
        this.customerCredit = '0.00';
        this.customerCreditLimit = '';
        this.customerData = {};
        this.customerNew = true;
        this.customerHasCredit = Number(this.customerCredit) > 0;
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
        this.itemDataService.getItems(query).subscribe(
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

    scanValue: string = '';
    itemScan() {
        let query = {
            code: this.scanValue
        }
        this.itemDataService.getItemsScan(query).subscribe(
            res => {
                console.log(res);
                if (res.err) {
                    // this.toastr.error(res.msg, 'Attention');
                } else {
                    this.scanValue = '';
                    this.toastr.success(res.msg, 'Attention');
                    this.selectedItem = res.item;
                    if (this.selectedItem.qty < 0) {
                        let newItem = <ItemSale>{
                            id: null,
                            stockid: null,
                            stockcode: null,
                            itemcode: this.selectedItem.itemcode,
                            itemname: this.selectedItem.itemname,
                            rack: null,
                            hsn: this.selectedItem.hsn,
                            qtystock: -1,
                            cost: 0,
                            qty: 1,
                            price: this.selectedItem.price,
                            discount: 0,
                            discountamount: 0,
                            vat: 0,
                            totalprice: this.selectedItem.price,
                            mfg: null,
                            expiry: null,
                            vendorid: null,
                            vendorfname: null,
                            vendorlname: null,
                            vendorcompany: null,
                            vendorphone: null,
                            vendoremail: null
                        };
                        console.log(newItem);
                        this.items.push(newItem);
                        this.changeQTY(this.items.length - 1);
                    } else {
                        this.saleDataService.getSaleItem({ itemcode: this.selectedItem.itemcode }).subscribe(res => {
                            for (let i = 0; i < res.length; i++) {
                                let newBatch = true;
                                for (let j = 0; j < this.items.length; j++) {
                                    if (this.items[j].stockid && this.items[j].stockid.toString() == res[i].id.toString() && Number(this.items[j].qtystock) > Number(this.items[j].qty)) {
                                        this.items[j].qty = Number(this.items[j].qty) + 1
                                        this.changeQTY(j);
                                        return;
                                    } else if (this.items[j].stockid.toString() == res[i].id.toString()) {
                                        newBatch = false;
                                        break;
                                    }
                                }
                                if (newBatch) {
                                    let newItem = <ItemSale>{
                                        id: null,
                                        stockid: res[i].id,
                                        stockcode: res[i].stockid,
                                        itemcode: this.selectedItem.itemcode,
                                        itemname: this.selectedItem.itemname,
                                        rack: res[i].rack,
                                        hsn: this.selectedItem.hsn,
                                        qtystock: res[i].qtystock,
                                        cost: res[i].cost,
                                        qty: 1,
                                        price: res[i].price,
                                        discount: this.selectedItem.discount,
                                        discountamount: 0,
                                        vat: this.selectedItem.vat,
                                        totalprice: res[i].price,
                                        mfg: res[i].mfg,
                                        expiry: res[i].expiry,
                                        vendorid: res[i].vendorid,
                                        vendorfname: res[i].vendorfname,
                                        vendorlname: res[i].vendorlname,
                                        vendorcompany: res[i].vendorcompany,
                                        vendorphone: res[i].vendorphone,
                                        vendoremail: res[i].vendoremail
                                    };
                                    this.items.push(newItem);
                                    this.changeQTY(this.items.length - 1);
                                    break;
                                }
                            }
                        });
                    }
                }
            }
        );
    }

    //***********
    sales: Array<Sale> = [];
    pages: Array<number> = [];
    salePage = 1;
    saleLimit = 10;
    saleOrderBy = 'createdAt';
    saleOrder = 'desc';
    saleSearchText = '';

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
    getSaleTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.salePage - 1;
            if (pageNo == -2) pageNo = this.salePage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.pages.length;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.salePage = pageNo;
        }
        else this.salePage = 1;
        let query = {
            saleLimit: this.saleLimit,
            saleOrderBy: this.saleOrderBy,
            saleOrder: this.saleOrder,
            saleSearchText: this.saleSearchText,
            salePage: this.salePage
        }
        this.saleDataService.getSalesCount(query).subscribe(
            resCount => {
                console.log(resCount);
                this.pages = Array.from({ length: Math.ceil(parseInt(resCount.toString()) / this.saleLimit) }, (_, i) => i + 1);
                this.saleDataService.getSales(query).subscribe(
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].createdAt = new Date(res[i].createdAt.toString());
                        }
                        this.sales = res;
                    }
                );
            }
        );
        console.log(this.saleLimit, this.saleOrderBy, this.saleOrder, this.saleSearchText);
    }

    // merge hub spot
    mergeHubspotCustomer() {
        this.saleDataService.fetchCustomerFromHubSpot({ recent: 'yes' }).subscribe(res => {
            this.toastr.success(`updated ${res.update} and added ${res.new} customers`, 'Done!');
        });
    }

    // due
    formIndex = -1;
    amountDue = 0;
    dueConfirmFormOpen(i) {
        this.dueConfirmForm.show();
        this.formIndex = i;
        this.amountDue = Number(this.sales[i].creditAmount);
    }
    dueConfirmFormSave() {
        this.dueConfirmForm.hide();
        this.removeCreditBySale(this.formIndex);
        this.formIndex = -1;
    }
    dueConfirmFormHide() {
        this.dueConfirmForm.hide();
        this.formIndex = -1;
    }
    removeCreditBySale(i) {
        this.saleDataService.removeCreditBySale({ id: this.sales[i].id, amount: this.amountDue }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Credit');
                this.getSaleTable(this.salePage);
            } else {
                this.toastr.error(res.msg, 'Credit');
            }
        })
    }
}