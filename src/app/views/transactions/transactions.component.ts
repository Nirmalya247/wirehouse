import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select'; 

@Component({
    templateUrl: 'transactions.component.html'
})
export class TransactionsComponent implements OnInit {

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

    selectedPersonId: number;

    people = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab' },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
    ];

    ngOnInit(): void {
        // generate random values for mainChart
    }
}