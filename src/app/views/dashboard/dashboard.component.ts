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
import { SaleDataService } from '../../services/sale-data.service';
import { MessageDataService } from '../../services/message-data.service';


@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    totalItemSold: string = '0';
    totalItemBought: string = '0';
    totalEarning: string = '0.00';
    totalSpending: string = '0.00';
    timString: string = 'Daily';

    graphBy: string = 'day';

    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public dashboardDataService: DashboardDataService,
        public saleDataService: SaleDataService,
        public messageDataService: MessageDataService,
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
        this.getPurchaseDueCount();
        this.getReturnDueCount();
        // generate random values for mainChart
    }


    // today temp
    // itemSoldChart
    public itemSoldChartData: Array<any> = [
        {
            data: [1, 18, 9, 17, 34, 22, 11],
            label: 'Series A'
        }
    ];
    public itemSoldChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public itemSoldChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public itemSoldChartColours: Array<any> = [
        { // grey
            backgroundColor: getStyle('--info'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public itemSoldChartLegend = false;
    public itemSoldChartType = 'line';


    // earningChart
    public earningChartData: Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Series A'
        }
    ];
    public earningChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public earningChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public earningChartColours: Array<any> = [
        {
            backgroundColor: getStyle('--primary'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public earningChartLegend = false;
    public earningChartType = 'line';


    // itemBoughtChart
    public itemBoughtChartData: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'Series A'
        }
    ];
    public itemBoughtChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public itemBoughtChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public itemBoughtChartColours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
        }
    ];
    public itemBoughtChartLegend = false;
    public itemBoughtChartType = 'line';


    // spendingChart
    public spendingChartData: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
            label: 'Series A',
            barPercentage: 0.6,
        }
    ];
    public spendingChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    public spendingChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public spendingChartColours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.3)',
            borderWidth: 0
        }
    ];
    public spendingChartLegend = false;
    public spendingChartType = 'line';













    // graph
    // mainChart

    public mainChartElements = 27;
    public mainChartData1: Array<number> = [];
    public mainChartData2: Array<number> = [];
    public mainChartData3: Array<number> = [];

    public mainChartData: Array<any> = [
        {
            data: this.mainChartData1,
            label: 'Current'
        },
        {
            data: this.mainChartData2,
            label: 'Previous'
        },
        {
            data: this.mainChartData3,
            label: 'BEP'
        }
    ];
    /* tslint:disable:max-line-length */
    public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    /* tslint:enable:max-line-length */
    public mainChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
                labelColor: function (tooltipItem, chart) {
                    return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                }/*,
          ticks: {
            callback: function(value: any) {
              return value.charAt(0);
            }
          }*/
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5)
                }
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public mainChartColours: Array<any> = [
        { // brandSuccess
            backgroundColor: 'transparent',
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        },
        { // brandDanger
            backgroundColor: 'transparent',
            borderColor: getStyle('--danger'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        },
        { // brandInfo
            backgroundColor: hexToRgba(getStyle('--info'), 10),
            borderColor: getStyle('--info'),
            pointHoverBackgroundColor: '#fff'
        }
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';













    // today
    getTodayData() {
        this.dashboardDataService.getToday({}).subscribe(res => {
            // console.log(res);
            if (!res.err) {
                this.totalItemSold = res.itemsold;
                this.totalItemBought = res.itembought;
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
                this.mainChartLabels = res.labels;
                this.mainChartData = [
                    { data: res.earning, label: 'earning' },
                    { data: res.spending, label: 'spending' },
                    { data: res.profit, label: 'profit' }
                ];
                this.itemSoldChartData = [{ data: res.itemsold, label: 'itemsold' }];
                this.itemSoldChartLabels = res.labels;
                this.spendingChartData = [{ data: res.spending, label: 'spending' }];
                this.spendingChartLabels = res.labels;
                this.itemBoughtChartData = [{ data: res.itembought, label: 'itembought' }];
                this.itemBoughtChartLabels = res.labels;
                this.earningChartData = [{ data: res.earning, label: 'earning' }];
                this.earningChartLabels = res.labels;
                this.totalItemSold = res.now.itemsold;
                this.totalItemBought = res.now.itembought;
                this.totalEarning = res.now.earning;
                this.totalSpending = res.now.spending;

                if (this.graphBy == 'day') this.timString = 'Daily';
                else if (this.graphBy == 'month') this.timString = 'Monthly';
                else if (this.graphBy == 'year') this.timString  = 'Yearly'
            }
        })
    }

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
    expiryPages = [1];
    expiryPage = 1;
    getExpiryCount() {
        this.dashboardDataService.getExpiryCount({}).subscribe(res => {
            this.expiryPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
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
    stockData: Array<Item> = [];
    stockPages = [1];
    stockPage = 1;
    getStockCount() {
        this.dashboardDataService.getStockCount({}).subscribe(res => {
            this.stockPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
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
    demandPages = [1];
    demandPage = 1;
    getDemandCount() {
        this.dashboardDataService.getDemandCount({}).subscribe(res => {
            this.demandPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
            this.earningPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
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
    earningPages = [1];
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
    creditPages = [1];
    creditPage = 1;
    getCreditCount() {
        this.dashboardDataService.getCreditCount({}).subscribe(res => {
            this.creditPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
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
    sendEmailToAll() {
        this.messageDataService.sendMessageMultiple({ message: 1 }).subscribe(res => {
            if (!res.err) {
                this.toastr.success(res.msg, 'Email');
            } else {
                this.toastr.error(res.msg, 'Email');
            }
        });
    }
    // purchase due
    purchaseDueOrder = 'asc';
    purchaseDueData = [ ];
    purchaseDuePages = [1];
    purchaseDuePage = 1;
    getPurchaseDueCount() {
        this.dashboardDataService.getPurchaseDueCount({ }).subscribe(res => {
            this.purchaseDuePages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
            this.getPurchaseDue(null);
            console.log(res);
        })
    }
    getPurchaseDue(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.purchaseDuePage - 1;
            if (pageNo == -2) pageNo = this.purchaseDuePage + 1;
            if (pageNo < 1 || pageNo > this.purchaseDuePages.length) return;
            this.purchaseDuePage = pageNo;
        } else this.purchaseDuePage = 1;
        this.dashboardDataService.getPurchaseDue({ page: this.purchaseDuePage, limit: this.dataLimit, order: this.purchaseDueOrder, orderby: 'qty' }).subscribe(res => {
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                if (res[i].dueDate) res[i].dueDate = new Date(res[i].dueDate.toString());
                res[i].createdAt = new Date(res[i].createdAt.toString());
            }
            this.purchaseDueData = res;
        });
    }
    removeDueByPurchase(i) {
        this.saleDataService.removeDueByPurchase({ id: this.purchaseDueData[i].id }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Due');
            } else {
                this.toastr.error(res.msg, 'Due');
            }
        })
    }
    // return due
    returnDueOrder = 'asc';
    returnDueData = [ ];
    returnDuePages = [1];
    returnDuePage = 1;
    getReturnDueCount() {
        this.dashboardDataService.getReturnDueCount({ }).subscribe(res => {
            this.returnDuePages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.dataLimit) }, (_, i) => i + 1);
            this.getReturnDue(null);
            console.log(res);
        })
    }
    getReturnDue(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.returnDuePage - 1;
            if (pageNo == -2) pageNo = this.returnDuePage + 1;
            if (pageNo < 1 || pageNo > this.returnDuePages.length) return;
            this.returnDuePage = pageNo;
        } else this.returnDuePage = 1;
        this.dashboardDataService.getReturnDue({ page: this.returnDuePage, limit: this.dataLimit, order: this.returnDueOrder, orderby: 'qty' }).subscribe(res => {
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                if (res[i].dueDate) res[i].dueDate = new Date(res[i].dueDate.toString());
                res[i].createdAt = new Date(res[i].createdAt.toString());
            }
            this.returnDueData = res;
        });
    }
    removeDueByReturn(i) {
        this.dashboardDataService.removeDueByReturn({ id: this.returnDueData[i].id }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Due');
            } else {
                this.toastr.error(res.msg, 'Due');
            }
        })
    }
}