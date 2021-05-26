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
import { Item, ItemSale } from '../../data/item';
import { Sale } from '../../data/transaction';

@Component({
    templateUrl: 'accounting.component.html'
})

export class AccountingComponent implements OnInit {
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;

    serverPath = environment.PATH;

    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private itemDataService: ItemDataService,
        private saleDataService: SaleDataService,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
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

        this.getDataTable(null);
        // generate random values for mainChart
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
    datas = [];
    pages: Array<number>;
    dataPage = 1;
    dataLimit = 10;
    dataOrderBy = 'createdAt';
    dataOrder = 'asc';
    dataSearchText = '';

    getDataTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.dataPage - 1;
            if (pageNo == -2) pageNo = this.dataPage + 1;
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
        let query = {
            saleLimit: this.dataLimit,
            saleOrderBy: this.dataOrderBy,
            saleOrder: this.dataOrder,
            salePage: this.dataPage,
            from: this.dataFrom,
            to: this.dataTo
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