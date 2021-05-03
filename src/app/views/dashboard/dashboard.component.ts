
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


@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    totalItemSold: string = '0';
    totalEarning: string = '0.00';
    totalSpending: string = '0.00';

    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public dashboardDataService: DashboardDataService,
        public router: Router,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.getTodayData();
        // generate random values for mainChart
    }

    getTodayData() {
        this.dashboardDataService.getToday({ }).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.totalItemSold = res.itemsold;
                this.totalEarning = res.earning;
                this.totalSpending = res.spending;
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
        { // grey
            backgroundColor: 'rgba(36, 189, 77,0.5)', //green
            borderColor: 'rgba(36, 189, 77,1)', // green
            pointBackgroundColor: 'rgba(36, 189, 77,1)', // blue
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(36, 189, 77,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.5)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        }
    ];

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40, 56, 76, 23, 55, 11], label: 'profit' },
        { data: [28, 48, 40, 19, 86, 27, 85, 54, 10, 45, 63, 77], label: 'Sales' }
    ];
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
}
