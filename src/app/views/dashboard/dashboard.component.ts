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
    @ViewChild('dueConfirmForm') public dueConfirmForm: ModalDirective;
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
        this.getEarningCount();
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
    public mainChartData1: Array<number> = [ ];
    public mainChartData2: Array<number> = [ ];
    public mainChartData3: Array<number> = [ ];

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
    dataLimit = 5;
    // expiry
    getExpiryColor(d) {
        var today = new Date()
        var d1 = new Date(d.toString())
        var d2 = new Date(d.toString())
        if (d1.setMonth(d1.getMonth() - 3) < today.getTime()) return 'bg-danger'
        if (d2.setMonth(d2.getMonth() - 6) < today.getTime()) return 'bg-warning'
        return '';
    }
    expiryOrder = 'asc';
    expiryData = [ ];
    expiryPages = [1];
    expiryPage = 1;
    expiryLimit = 5;
    getExpiryCount() {
        this.dashboardDataService.getExpiryCount({}).subscribe(res => {
            this.expiryPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.expiryLimit) }, (_, i) => i + 1);
            this.getExpiry(null);
            // console.log(res);
        })
    }
    getExpiry(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.expiryPage - 1;
            if (pageNo == -2) pageNo = this.expiryPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.expiryPages.length;
            if (pageNo < 1 || pageNo > this.expiryPages.length) return;
            this.expiryPage = pageNo;
        } else this.expiryPage = 1;
        this.dashboardDataService.getExpiry({ page: this.expiryPage, limit: this.expiryLimit, order: this.expiryOrder }).subscribe(res => {
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
    stockLimit = 5;
    getStockCount() {
        this.dashboardDataService.getStockCount({}).subscribe(res => {
            this.stockPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.stockLimit) }, (_, i) => i + 1);
            this.getStock(null);
            // console.log(res);
        })
    }
    getStock(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.stockPage - 1;
            if (pageNo == -2) pageNo = this.stockPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.stockPages.length;
            if (pageNo < 1 || pageNo > this.stockPages.length) return;
            this.stockPage = pageNo;
        } else this.stockPage = 1;
        this.dashboardDataService.getStock({ page: this.stockPage, limit: this.stockLimit, order: this.stockOrder }).subscribe(res => {
            this.stockData = res;
            // console.log(res);
        })
    }
    // demand
    demandOrder = 'desc';
    demandData = [ ];
    demandPages = [1];
    demandPage = 1;
    demandLimit = 5;
    getDemandCount() {
        this.dashboardDataService.getDemandCount({}).subscribe(res => {
            this.demandPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.demandLimit) }, (_, i) => i + 1);
            this.getDemand(null);
            console.log(res);
        })
    }
    getDemand(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.demandPage - 1;
            if (pageNo == -2) pageNo = this.demandPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.demandPages.length;
            if (pageNo < 1 || pageNo > this.demandPages.length) return;
            this.demandPage = pageNo;
        } else this.demandPage = 1;
        this.dashboardDataService.getDemand({ page: this.demandPage, limit: this.demandLimit, order: this.demandOrder, orderby: 'qty' }).subscribe(res => {
            this.demandData = res;
            console.log(res);
        })
    }
    // earning
    earningOrder = 'desc';
    earningData = [ ];
    earningPages = [1];
    earningPage = 1;
    earningLimit = 5;
    getEarningCount() {
        this.dashboardDataService.getDemandCount({}).subscribe(res => {
            this.earningPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.demandLimit) }, (_, i) => i + 1);
            this.getEarning(null);
            console.log(res);
        })
    }
    getEarning(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.earningPage - 1;
            if (pageNo == -2) pageNo = this.earningPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.earningPages.length;
            if (pageNo < 1 || pageNo > this.earningPages.length) return;
            this.earningPage = pageNo;
        } else this.earningPage = 1;
        this.dashboardDataService.getDemand({ page: this.earningPage, limit: this.earningLimit, order: this.earningOrder, orderby: 'totalprice' }).subscribe(res => {
            this.earningData = res;
            console.log(res);
        })
    }
    // credit
    creditOrder = 'desc';
    creditData = [ ];
    creditPages = [1];
    creditPage = 1;
    creditSearchText = '';
    creditLimit = 5;
    getCreditCount() {
        this.dashboardDataService.getCreditCount({ searchText: this.creditSearchText }).subscribe(res => {
            this.creditPages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.creditLimit) }, (_, i) => i + 1);
            this.getCredit(null);
            console.log(res);
        })
    }
    getCredit(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.creditPage - 1;
            if (pageNo == -2) pageNo = this.creditPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.creditPages.length;
            if (pageNo < 1 || pageNo > this.creditPages.length) return;
            this.creditPage = pageNo;
        } else this.creditPage = 1;
        this.dashboardDataService.getCredit({ page: this.creditPage, limit: this.creditLimit, order: this.creditOrder, orderby: 'qty', searchText: this.creditSearchText }).subscribe(res => {
            var today = new Date();
            for (var i = 0; i < res.length; i++) {
                res[i].createdAt = new Date(res[i].createdAt.toString());
                res[i]['daysPassed'] = Math.floor((today.getTime() - res[i].createdAt.getTime()) / (1000 * 3600 * 24));
            }
            this.creditData = res;
            console.log(res);
        });
    }
    removeCreditBySale(i) {
        this.saleDataService.removeCreditBySale({ id: this.creditData[i].id, amount: this.amountDue }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Credit');
                this.getCredit(this.creditPage);
            } else {
                this.toastr.error(res.msg, 'Credit');
            }
        })
    }
    // purchase due
    purchaseDueOrder = 'desc';
    purchaseDueData = [ ];
    purchaseDuePages = [1];
    purchaseDuePage = 1;
    purchaseDueSearchText = '';
    purchaseDueLimit = 5;
    getPurchaseDueCount() {
        this.dashboardDataService.getPurchaseDueCount({ searchText: this.purchaseDueSearchText }).subscribe(res => {
            this.purchaseDuePages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.purchaseDueLimit) }, (_, i) => i + 1);
            this.getPurchaseDue(null);
            console.log(res);
        })
    }
    getPurchaseDue(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.purchaseDuePage - 1;
            if (pageNo == -2) pageNo = this.purchaseDuePage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.purchaseDuePages.length;
            if (pageNo < 1 || pageNo > this.purchaseDuePages.length) return;
            this.purchaseDuePage = pageNo;
        } else this.purchaseDuePage = 1;
        this.dashboardDataService.getPurchaseDue({ page: this.purchaseDuePage, limit: this.purchaseDueLimit, order: this.purchaseDueOrder, orderby: 'qty', searchText: this.purchaseDueSearchText }).subscribe(res => {
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                if (res[i].dueDate) res[i].dueDate = new Date(res[i].dueDate.toString());
                res[i].createdAt = new Date(res[i].createdAt.toString());
            }
            this.purchaseDueData = res;
        });
    }
    removeDueByPurchase(i) {
        this.saleDataService.removeDueByPurchase({ id: this.purchaseDueData[i].id, amount: this.amountDue }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Due');
                this.getPurchaseDue(this.purchaseDuePage);
            } else {
                this.toastr.error(res.msg, 'Due');
            }
        })
    }
    // return due
    returnDueOrder = 'desc';
    returnDueData = [ ];
    returnDuePages = [1];
    returnDuePage = 1;
    returnDueSearchText = '';
    returnDueLimit = 5;
    getReturnDueCount() {
        this.dashboardDataService.getReturnDueCount({ searchText: this.returnDueSearchText }).subscribe(res => {
            this.returnDuePages = Array.from({ length: Math.ceil(parseInt(res.toString()) / this.returnDueLimit) }, (_, i) => i + 1);
            this.getReturnDue(null);
            console.log(res);
        })
    }
    getReturnDue(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.returnDuePage - 1;
            if (pageNo == -2) pageNo = this.returnDuePage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.returnDuePages.length;
            if (pageNo < 1 || pageNo > this.returnDuePages.length) return;
            this.returnDuePage = pageNo;
        } else this.returnDuePage = 1;
        this.dashboardDataService.getReturnDue({ page: this.returnDuePage, limit: this.returnDueLimit, order: this.returnDueOrder, orderby: 'qty',searchText: this.returnDueSearchText }).subscribe(res => {
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                if (res[i].dueDate) res[i].dueDate = new Date(res[i].dueDate.toString());
                res[i].createdAt = new Date(res[i].createdAt.toString());
            }
            this.returnDueData = res;
        });
    }
    removeDueByReturn(i) {
        this.dashboardDataService.removeDueByReturn({ id: this.returnDueData[i].id, amount: this.amountDue }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Due');
                this.getReturnDue(this.returnDuePage);
            } else {
                this.toastr.error(res.msg, 'Due');
            }
        })
    }
    sendEmail(i) {
        // this.dashboardDataService.sendCreditEmail({ customerid: this.creditData[i].id }).subscribe(res => {
        //     if (!res.err) {
        //         this.toastr.success(res.msg, 'Email');
        //     } else {
        //         this.toastr.error(res.msg, 'Email');
        //     }
        // });
        let data = {
            messageId: 13,
            customerId: this.creditData[i].customerID,
            shopId: 1,
            salesId: this.creditData[i].id
        };
        this.messageDataService.sendMessage(data).subscribe(resMessage => {
            if (resMessage.err) this.toastr.error('email could not be sent', 'Error!');
            else this.toastr.success('email sent', 'Done!');
        });
        data.messageId = 14;
        this.messageDataService.sendMessage(data).subscribe(resMessage => {
            if (resMessage.err) this.toastr.error('text could not be sent', 'Error!');
            else this.toastr.success('text sent', 'Done!');
        });
    }
    sendEmailToAllCustomer(by) {
        if (by == 'bill') {
            this.messageDataService.sendMessageMultiple({ message: 13 }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success(res.msg, 'Email');
                } else {
                    this.toastr.error(res.msg, 'Email');
                }
            });
            this.messageDataService.sendMessageMultiple({ message: 14 }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success(res.msg, 'Text');
                } else {
                    this.toastr.error(res.msg, 'Text');
                }
            });
        } else {
            this.messageDataService.sendMessageMultiple({ message: 1 }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success(res.msg, 'Email');
                } else {
                    this.toastr.error(res.msg, 'Email');
                }
            });
            this.messageDataService.sendMessageMultiple({ message: 2 }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success(res.msg, 'Text');
                } else {
                    this.toastr.error(res.msg, 'Text');
                }
            });
        }
    }
    sendEmailToAllVendorPurchase() {
        this.messageDataService.sendMessageMultiple({ message: 3 }).subscribe(res => {
            if (!res.err) {
                this.toastr.success(res.msg, 'Email');
            } else {
                this.toastr.error(res.msg, 'Email');
            }
        });
        this.messageDataService.sendMessageMultiple({ message: 4 }).subscribe(res => {
            if (!res.err) {
                this.toastr.success(res.msg, 'Text');
            } else {
                this.toastr.error(res.msg, 'Text');
            }
        });
    }
    sendEmailToAllVendorReturn() {
        this.messageDataService.sendMessageMultiple({ message: 5 }).subscribe(res => {
            if (!res.err) {
                this.toastr.success(res.msg, 'Email');
            } else {
                this.toastr.error(res.msg, 'Email');
            }
        });
        this.messageDataService.sendMessageMultiple({ message: 6 }).subscribe(res => {
            if (!res.err) {
                this.toastr.success(res.msg, 'Text');
            } else {
                this.toastr.error(res.msg, 'Text');
            }
        });
    }
    // form
    formType = ''; // customer credit / purchase due / return due
    formIndex = -1;
    amountDue = 0;
    dueConfirmFormOpen(type, i) {
        this.dueConfirmForm.show();
        this.formType = type;
        this.formIndex = i;
        if (this.formType == 'customer credit') {
            this.amountDue = this.creditData[i].creditAmount;
        } else if (this.formType == 'purchase due') {
            this.amountDue = this.purchaseDueData[i].dueAmount;
        } else if (this.formType == 'return due') {
            this.amountDue = this.returnDueData[i].dueAmount;
        }
    }
    dueConfirmFormSave() {
        this.dueConfirmForm.hide();
        if (this.formType == 'customer credit') {
            this.removeCreditBySale(this.formIndex);
        } else if (this.formType == 'purchase due') {
            this.removeDueByPurchase(this.formIndex);
        } else if (this.formType == 'return due') {
            this.removeDueByReturn(this.formIndex);
        }
        this.formType = '';
        this.formIndex = -1;
    }
    dueConfirmFormHide() {
        this.dueConfirmForm.hide();
        this.formType = '';
        this.formIndex = -1;
    }
}