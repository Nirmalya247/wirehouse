import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AccountingDataService } from '../../services/accounting-data.service';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { environment } from '../../../environments/environment';
import { Auth } from '../../auth-services/auth';
import { Item } from '../../data/item';


@Component({
    templateUrl: 'reports.component.html',
    styleUrls: ['reports.css']
})
export class ReportsComponent implements OnInit {

    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public accountingDataService: AccountingDataService,
        public router: Router,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        let today = new Date();
        let dd = today.getDate() + 1;
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        let tdd = dd.toString();
        let tmm = dd.toString();
        if (dd < 10) tdd = '0' + dd;
        if (mm < 10) tmm = '0' + mm;

        this.dataFrom = yyyy + '-' + tmm + '-' + tdd;
        this.dataTo = yyyy + '-' + tmm + '-01';
        this.dataTo = yyyy + '-' + '01' + '-01';

        this.getData();
        // generate random values for mainChart
    }

    income = 0;
    costOfGoodsSold = 0;
    operatingExpense = 0;
    netProfit = 0;

    accountData = [];

    dataFrom = '';
    // expiry
    dataTo = '';
    dataOn = 'day';
    getData() {
        this.accountingDataService.getReportData({ from: this.dataFrom, to: this.dataTo }).subscribe(res => {
            let tData = [ ];
            let transactions = res.transactions;
            this.income = 0;
            this.costOfGoodsSold = 0;
            this.operatingExpense = 0;

            for (let i = 0; i < transactions.length; i++) {
                let typeI = tData.findIndex(t => t.label == transactions[i].type);
                if (typeI == -1) {
                    tData.push({ label: transactions[i].type, value: [ ] });
                    typeI = tData.length - 1;
                }
                let accounttypeI = tData[typeI].value.findIndex(t => t.label == transactions[i].accounttype);
                if (accounttypeI == -1) {
                    tData[typeI].value.push({ label: transactions[i].accounttype, value: [ ] });
                    accounttypeI = tData[typeI].value.length - 1;
                }
                tData[typeI].value[accounttypeI].value.push({ account: transactions[i].account, amount: Number(transactions[i].amount), tendered: Number(transactions[i].tendered), type: transactions[i].type });
                if (transactions[i].type == 'income') this.income += Number(transactions[i].amount);
                else if (transactions[i].type == 'expense' && transactions[i].accounttype == 'products' && transactions[i].account == 'sold') this.costOfGoodsSold += Number(transactions[i].amount);
                else if (transactions[i].type == 'expense' && transactions[i].accounttype != 'products') this.operatingExpense += Number(transactions[i].amount);
                this.netProfit = this.income - this.costOfGoodsSold - this.operatingExpense;
            }
            this.accountData = tData;
            console.log(res, tData);
        })
    }
}