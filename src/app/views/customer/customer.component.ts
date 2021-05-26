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
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Customer } from '../../data/customer';

@Component({
    templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
    @ViewChild('updateForm') public updateForm: ModalDirective;
    @ViewChild('deleteConfirmForm') public deleteConfirmForm: ModalDirective;
    @ViewChild('FindItem') ngSelectComponent: NgSelectComponent;
    customers: Array<Customer>;
    pages: Array<number>;
    page = 1;
    limit = 10;
    orderBy = 'updatedAt';
    order = 'asc';
    searchText = '';
    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private itemDataService: ItemDataService,
        private saleDataService: SaleDataService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        // generate random values for mainChart
        this.getItemTable(null);
    }

    getItemTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.page - 1;
            if (pageNo == -2) pageNo = this.page + 1;
            if (pageNo < 1 || pageNo > this.pages.length) return;
            this.page = pageNo;
        } else this.page = 1;
        let query = {
            limit: this.limit,
            orderby: this.orderBy,
            order: this.order,
            searchText: this.searchText,
            page: this.page
        }
        this.saleDataService.getCustomerCount(query).subscribe(
            resCount => {
                console.log('@@@@@@@@@@@', resCount);
                this.pages = Array.from({ length: Math.ceil(parseInt(resCount) / this.limit) }, (_, i) => i + 1);
                this.saleDataService.getCustomer(query).subscribe(
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].updatedAt = new Date(res[i].updatedAt.toString());
                        }
                        this.customers = res;
                    }
                );
            }
        );
    }

    //***********

    customerI: number = -1;
    customerName: string = '';
    customerPhone: string = '';
    customerEmail: string = '';
    customerCreditLimit: string = '';

    updateFormShow(i) {
        this.customerI = i;
        this.customerName = this.customers[i].name.toString();
        this.customerPhone = this.customers[i].phone.toString();
        this.customerEmail = this.customers[i].email.toString();
        this.customerCreditLimit = this.customers[i].creditlimit.toString();
        this.updateForm.show();
    }

    updateFormHide() {
        this.customerI = -1;
        this.customerName = '';
        this.customerPhone = '';
        this.customerEmail = '';
        this.customerCreditLimit = '';
        this.updateForm.hide();
    }

    updateFormSave() {
        let query = {
            id: this.customers[this.customerI].id.toString(),
            name: this.customerName,
            phone: this.customerPhone,
            email: this.customerEmail,
            creditlimit: this.customerCreditLimit
        }
        console.log(query);
        this.saleDataService.customerUpdate(query).subscribe (
            res => {
                if (!res.err) {
                    console.log(res);
                    this.toastr.success('Updated successfully!', 'User Info');
                    this.getItemTable(this.page);
                } else {
                    this.toastr.error('could not update customer', 'Attention');
                }
                this.updateFormHide();
            }
        );
    }

    deleteI = -1;
    deleteItem(i) {
        this.deleteI = i;
        this.deleteConfirmForm.show();
    }

    deleteConfirmFormHide() {
        this.deleteI = -1;
        this.deleteConfirmForm.hide();
    }

    deleteConfirmFormSave() {
        this.saleDataService.customerDelete({ id: this.customers[this.deleteI].id }).subscribe(res => {
            if (!res.err) {
                this.toastr.success('customer deleted', 'Deleted!');
                this.getItemTable(this.page);
            } else {
                this.toastr.error(res.msg, 'Delete');
            }
            this.deleteConfirmFormHide();
        });
    }

    //***********

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

    add(f: NgForm) {
        if (f.valid) {
            let query = {
                name: f.value.name,
                phone: f.value.phone,
                email: f.value.email,
                credit: '0.00',
                creditlimit: f.value.creditlimit,
                qty: 0,
                amount: 0,
                count: 0
            }
            if (f.value.name == '' || f.value.phone == '') {
                this.toastr.error('Enter user info', 'User Info');
                return;
            }
            this.saleDataService.customerAdd(query).subscribe(
                res => {
                    if (!res.err) {
                        this.getItemTable(this.page);
                        this.toastr.success('customer added', 'Done!');
                        f.resetForm();
                        this.ngSelectComponent.clearModel();
                    } else {
                        this.toastr.error('could not add customer', 'Attention');
                    }
                }
            );
        } else {
            this.toastr.error('fill all field', 'Attention');
        }
    }
    cancelAdd() {
        this.ngSelectComponent.clearModel();
    }
}