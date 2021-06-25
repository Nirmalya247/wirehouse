import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ItemDataService } from '../../services/item-data.service';
import { SaleDataService } from '../../services/sale-data.service';
import { AccountingDataService } from '../../services/accounting-data.service';
import { environment } from '../../../environments/environment';
import { Item, ItemSale } from '../../data/item';
import { Sale } from '../../data/transaction';

@Component({
    templateUrl: 'accounting.component.html'
})

export class AccountingComponent implements OnInit {
    @ViewChild('TypeSel') typeSel: NgSelectComponent;
    @ViewChild('AccountTypeSel') accountTypeSel: NgSelectComponent;
    @ViewChild('AccountSel') accountSel: NgSelectComponent;

    serverPath = environment.PATH;

    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private itemDataService: ItemDataService,
        private saleDataService: SaleDataService,
        private accountingDataService: AccountingDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        // this.dataSearch({ term: null }, 'type', 1);
        this.dataSearch({ term: null }, 'accounttype', 2);
        this.dataSearch({ term: null }, 'account', 3);

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        let tdd = dd.toString();
        let tmm = dd.toString();
        if (dd < 10) tdd = '0' + dd;
        if (mm < 10) tmm = '0' + mm;

        this.dataFrom = yyyy + '-' + tmm + '-' + tdd;
        this.dataTo = yyyy + '-' + tmm + '-01';
        
        this.duedate = yyyy + '-' + tmm + '-' + tdd;

        this.getDataTable(null);
        // generate random values for mainChart
    }

    // typesList = [];
    selectedType = null;
    // termType = null;
    accountTypesList = [];
    selectedAccountType = null;
    termAccountType = null;
    accountList = [];
    selectedAccount = null;
    termAccount = null;

    duration = '';
    amount = '';
    tendered = '';
    duedate = '';
    comment = '';


    dataSearch(event, on, n) {
        let query = {
            col: on,
            page: 1,
            limit: 20,
            order: 'asc',
            searchText: event.term
        }

        // if (n == 1) this.termType = event.term;
        if (n == 2) this.selectedAccountType = event.term;
        else if (n == 3) this.selectedAccount = event.term;

        if (n > 1 && this.selectedType != null) {
            query['whcol'] = 'type';
            query['whval'] = this.selectedType;
        }
        if (n > 2 && this.selectedAccountType != null) {
            query['whcol'] = 'accounttype';
            query['whval'] = this.selectedAccountType;
        }
        if (n > 3 && this.selectedAccount != null) {
            query['whcol'] = 'account';
            query['whval'] = this.selectedAccount;
        }
        this.accountingDataService.getAccount(query).subscribe (
            res => {
                console.log(res);
                if (n == 2) this.accountTypesList = res;
                else if (n == 3) this.accountList = res;
            }
        );
    }

    dataChange(event, on, n) {
        if (n == 2) {
            this.selectedType = event.type;
        }
        else if (n == 3) {
            this.selectedType = event.type;
            this.selectedAccountType = event.accounttype;
            this.duration = event.duration;
        }
    }

    add() {
        var data = {
            type: this.selectedType,
            accounttype: this.selectedAccountType,
            account: this.selectedAccount,
            duration: this.duration,
            amount: this.amount,
            tendered: this.tendered,
            duedate: this.duedate,
            comment: this.comment
        };
        console.log(data);
        this.accountingDataService.addAccountData(data).subscribe (
            res => {
                console.log(res);
                if (res.err) this.toastr.error('Could not add', 'Attention');
                else {
                    this.toastr.success('Added', 'Done!');
                    this.cancel();
                }
            }
        );
    }

    cancel() {
        this.selectedType = null;
        this.accountTypesList = [];
        this.selectedAccountType = null;
        this.termAccountType = null;
        this.accountList = [];
        this.selectedAccount = null;
        this.termAccount = null;
    
        this.duration = '';
        this.amount = '';
        this.tendered = '';
        this.comment = '';

        this.dataSearch({ term: null }, 'accounttype', 2);
        this.dataSearch({ term: null }, 'account', 3);

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        let tdd = dd.toString();
        let tmm = dd.toString();
        if (dd < 10) tdd = '0' + dd;
        if (mm < 10) tmm = '0' + mm;
        
        this.duedate = yyyy + '-' + tmm + '-' + tdd;
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

    //***********
    dataType = 'sales';
    dataFrom: string;
    dataTo: string;
    datas = [ ];
    pages: Array<number>;
    dataPage = 1;
    dataLimit = 10;
    dataOrderBy = 'createdAt';
    dataOrder = 'asc';
    dataSearchText = '';

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

    getDataTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.dataPage - 1;
            if (pageNo == -2) pageNo = this.dataPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.pages.length;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.dataPage = pageNo;
        } else this.dataPage = 1;

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        let tdd = dd.toString();
        let tmm = dd.toString();
        if (dd < 10) tdd = '0' + dd;
        if (mm < 10) tmm = '0' + mm;
        let from = new Date(Number(this.dataFrom.split('-')[0]), Number(this.dataFrom.split('-')[1]) - 1, Number(this.dataFrom.split('-')[2]));
        let to = new Date(Number(this.dataTo.split('-')[0]), Number(this.dataTo.split('-')[1]) - 1, Number(this.dataTo.split('-')[2]));
        if (from > new Date()) {
            this.dataFrom = yyyy + '-' + tmm + '-' + tdd;
            from = new Date(yyyy, mm - 1, dd);
        }
        if (to > from) {
            this.dataTo = yyyy + '-' + tmm + '-01';
        }
        if (this.dataType == 'purchase') {
            let query = {
                purchaseLimit: this.dataLimit,
                purchaseOrderBy: this.dataOrderBy,
                purchaseOrder: this.dataOrder,
                purchasePage: this.dataPage,
                from: this.dataFrom,
                to: this.dataTo
            }
            this.saleDataService.getPurchasesCount(query).subscribe (
                resCount => {
                    console.log(resCount);
                    this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.dataLimit)}, (_, i) => i + 1);
                    this.saleDataService.getPurchases(query).subscribe (
                        res => {
                            console.log(res);
                            for (let i = 0; i < res.length; i++) {
                                res[i].createdAt = new Date(res[i].createdAt.toString());
                                res[i]['personName'] = res[i].vendorFName.toString() + ' ' + res[i].vendorLName.toString();
                            }
                            this.datas = res;
                        }
                    );
                }
            );
        } else {
            let query = {
                saleLimit: this.dataLimit,
                saleOrderBy: this.dataOrderBy,
                saleOrder: this.dataOrder,
                salePage: this.dataPage,
                from: this.dataFrom,
                to: this.dataTo
            }
            this.saleDataService.getSalesCount(query).subscribe (
                resCount => {
                    console.log(resCount);
                    this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.dataLimit)}, (_, i) => i + 1);
                    this.saleDataService.getSales(query).subscribe (
                        res => {
                            console.log(res);
                            for (let i = 0; i < res.length; i++) {
                                res[i].createdAt = new Date(res[i].createdAt.toString());
                                res[i]['personName'] = res[i].customerName;
                            }
                            this.datas = res;
                        }
                    );
                }
            );
        }
        console.log(this.dataLimit, this.dataOrderBy, this.dataOrder, this.dataSearchText);
    }
    getCSV() {
        let query = {
            saleLimit: this.dataLimit,
            saleOrderBy: this.dataOrderBy,
            saleOrder: this.dataOrder,
            salePage: this.dataPage,
            from: this.dataFrom,
            to: this.dataTo
        }
    }

    getPDF() {
        
    }
}