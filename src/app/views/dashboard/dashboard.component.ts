import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { DashboardDataService } from '../../services/dashboard-data.service';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { environment } from '../../../environments/environment';
import { Auth } from '../../auth-services/auth';
import { Item } from '../../data/item';


@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    totalItemSold: string = '0';
    totalEarning: string = '0.00';
    totalSpending: string = '0.00';

    graphBy: string = 'month';

    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public dashboardDataService: DashboardDataService,
        public router: Router,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.getTodayData();
        this.getGraphData();
        this.getExpiryCount();
        this.getStockCount();
        this.getDemandCount();
        this.getCreditCount();
        // generate random values for mainChart
    }
    

    // today
    getTodayData() {
        this.dashboardDataService.getToday({ }).subscribe(res => {
            // console.log(res);
            if (!res.err) {
                this.totalItemSold = res.itemsold;
                this.totalEarning = res.earning;
                this.totalSpending = res.spending;
            }
        })
    }


    // graph
    getGraphData() {
        this.dashboardDataService.getGraphData({ findby: this.graphBy }).subscribe(res => {
            // console.log(res);
            if (!res.err) {
                this.barChartLabels = res.labels;
                this.barChartData = [
                    { data: res.earning, label: 'earning' },
                    { data: res.spending, label: 'spending' },
                    { data: res.profit, label: 'profit' }
                ];
            }
        })
    }

    
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public barChartType = 'bar';
    public barChartLegend = true;
    public barChartColours: Array<any> = [
        { // blue
            backgroundColor: 'rgb(75, 0, 130, 0.5)',
            borderColor: 'rgb(75, 0, 130, 1)',
            pointBackgroundColor: 'rgb(75, 0, 130, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(75, 0, 130, 1)'
        },
        { // red
            backgroundColor: 'rgb(255, 146, 0, 0.5)',
            borderColor: 'rgb(255, 146, 0, 1)',
            pointBackgroundColor: 'rgb(255, 146, 0, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 146, 0, 1)'
        },
        { // green
            backgroundColor: 'rgba(36, 189, 77, 0.5)',
            borderColor: 'rgba(36, 189, 77,1)',
            pointBackgroundColor: 'rgba(36, 189, 77,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(36, 189, 77, 1)'
        }
    ];

    public barChartData: any[] = [
        { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'earning' },
        { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'spending' },
        { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'profit' }
    ];
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    dataLimit = 5;
    // expiry
    expiryOrder = 'asc';
    expiryData = [ ];
    expiryPages = [ 1 ];
    expiryPage = 1;
    getExpiryCount() {
        this.dashboardDataService.getExpiryCount({ }).subscribe(res => {
            this.expiryPages = Array.from({length: Math.ceil(parseInt(res.toString()) / this.dataLimit)}, (_, i) => i + 1);
            this.getExpiry(null);
            // console.log(res);
        })
    }
    getExpiry(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.expiryPage - 1;
            if (pageNo == -2) pageNo = this.expiryPage + 1;
            if (pageNo < 1 || pageNo > this.expiryPages.length) return;
            this.expiryPage = pageNo;
        } else this.expiryPage = 1;
        this.dashboardDataService.getExpiry({ page: this.expiryPage, limit: this.dataLimit, order: this.expiryOrder }).subscribe(res => {
            console.log('###########', res)
            for (let i = 0; i < res.length; i++) {
                res[i].expiry = new Date(res[i].expiry.toString());
                res[i].createdAt = new Date(res[i].createdAt.toString());
            }
            this.expiryData = res;
            // console.log(res);
        })
    }
    // stock
    stockOrder = 'asc';
    stockData: Array<Item> = [ ];
    stockPages = [ 1 ];
    stockPage = 1;
    getStockCount() {
        this.dashboardDataService.getStockCount({ }).subscribe(res => {
            this.stockPages = Array.from({length: Math.ceil(parseInt(res.toString()) / this.dataLimit)}, (_, i) => i + 1);
            this.getStock(null);
            // console.log(res);
        })
    }
    getStock(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.stockPage - 1;
            if (pageNo == -2) pageNo = this.stockPage + 1;
            if (pageNo < 1 || pageNo > this.stockPages.length) return;
            this.stockPage = pageNo;
        } else this.stockPage = 1;
        this.dashboardDataService.getStock({ page: this.stockPage, limit: this.dataLimit, order: this.stockOrder }).subscribe(res => {
            this.stockData = res;
            // console.log(res);
        })
    }
    // demand
    demandOrder = 'desc';
    demandData = [ ];
    demandPages = [ 1 ];
    demandPage = 1;
    getDemandCount() {
        this.dashboardDataService.getDemandCount({ }).subscribe(res => {
            this.demandPages = Array.from({length: Math.ceil(parseInt(res.toString()) / this.dataLimit)}, (_, i) => i + 1);
            this.earningPages = Array.from({length: Math.ceil(parseInt(res.toString()) / this.dataLimit)}, (_, i) => i + 1);
            this.getDemand(null);
            this.getEarning(null);
            console.log(res);
        })
    }
    getDemand(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.demandPage - 1;
            if (pageNo == -2) pageNo = this.demandPage + 1;
            if (pageNo < 1 || pageNo > this.demandPages.length) return;
            this.demandPage = pageNo;
        } else this.demandPage = 1;
        this.dashboardDataService.getDemand({ page: this.demandPage, limit: this.dataLimit, order: this.demandOrder, orderby: 'qty' }).subscribe(res => {
            this.demandData = res;
            console.log(res);
        })
    }
    // earning
    earningOrder = 'desc';
    earningData = [ ];
    earningPages = [ 1 ];
    earningPage = 1;
    getEarning(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.earningPage - 1;
            if (pageNo == -2) pageNo = this.earningPage + 1;
            if (pageNo < 1 || pageNo > this.earningPages.length) return;
            this.earningPage = pageNo;
        } else this.earningPage = 1;
        this.dashboardDataService.getDemand({ page: this.earningPage, limit: this.dataLimit, order: this.earningOrder, orderby: 'totalprice' }).subscribe(res => {
            this.earningData = res;
            console.log(res);
        })
    }
    // credit
    creditOrder = 'asc';
    creditData = [ ];
    creditPages = [ 1 ];
    creditPage = 1;
    getCreditCount() {
        this.dashboardDataService.getCreditCount({ }).subscribe(res => {
            this.creditPages = Array.from({length: Math.ceil(parseInt(res.toString()) / this.dataLimit)}, (_, i) => i + 1);
            this.getCredit(null);
            console.log(res);
        })
    }
    getCredit(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.creditPage - 1;
            if (pageNo == -2) pageNo = this.creditPage + 1;
            if (pageNo < 1 || pageNo > this.creditPages.length) return;
            this.creditPage = pageNo;
        } else this.creditPage = 1;
        this.dashboardDataService.getCredit({ page: this.creditPage, limit: this.dataLimit, order: this.creditOrder, orderby: 'qty' }).subscribe(res => {
            this.creditData = res;
            console.log(res);
        });
    }
    sendEmail(i) {
        this.dashboardDataService.sendCreditEmail({ customerid: this.creditData[i].id }).subscribe(res => {
            if (!res.err) {
                this.toastr.success(res.msg, 'Email');
            } else {
                this.toastr.error(res.msg, 'Email');
            }
        });
    }
}
