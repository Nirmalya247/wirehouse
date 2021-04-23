import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY' , 'AUG' , 'SEP' , 'OCT' , 'NOV', 'DEC'];
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
        { data: [65, 59, 80, 81, 56, 55, 40,56,76,23,55, 11], label: 'profit' },
        { data: [28, 48, 40, 19, 86, 27, 85, 54,10, 45,63,77], label: 'Sales' }
    ];
    ngOnInit(): void {
    }
    public chartClicked(e: any): void {
      console.log(e);
    }
  
    public chartHovered(e: any): void {
      console.log(e);
    }
}
