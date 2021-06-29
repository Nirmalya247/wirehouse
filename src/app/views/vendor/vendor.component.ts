import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ItemDataService } from '../../services/item-data.service';
import { SaleDataService } from '../../services/sale-data.service';
import { MessageDataService } from '../../services/message-data.service';
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Vendor } from '../../data/vendor';

@Component({
    templateUrl: 'vendor.component.html',
    styleUrls: ['vendor.css']
})
export class VendorComponent implements OnInit {
    @ViewChild('updateForm') public updateForm: ModalDirective;
    @ViewChild('deleteConfirmForm') public deleteConfirmForm: ModalDirective;
    @ViewChild('mailForm') public mailForm: ModalDirective;
    // @ViewChild('FindItem') findItemComponent: NgSelectComponent;
    @ViewChild('FindMessage') findMessage: NgSelectComponent;
    vendors: Array<Vendor> = [ ];
    pages: Array<number> = [ ];
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
        private messageDataService: MessageDataService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        // generate random values for mainChart
        this.getItemTable(null);
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

    getItemTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.page - 1;
            if (pageNo == -2) pageNo = this.page + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.pages.length;
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
        this.saleDataService.getVendorCount(query).subscribe(
            resCount => {
                console.log('@@@@@@@@@@@', resCount);
                this.pages = Array.from({ length: Math.ceil(parseInt(resCount) / this.limit) }, (_, i) => i + 1);
                this.saleDataService.getVendor(query).subscribe(
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].updatedAt = new Date(res[i].updatedAt.toString());
                        }
                        this.vendors = res;
                    }
                );
            }
        );
    }

    //***********

    vendorI: number = -1;;
    vendorFName: string = ''
    vendorLName: string = '';
    vendorCompany: string = '';
    vendorPhone: string = '';
    vendorEmail: string = '';
    vendorVatno: string = '';

    updateFormShow(i) {
        this.vendorI = i;
        this.vendorFName = this.vendors[i].fname.toString();
        this.vendorLName = this.vendors[i].lname.toString();
        this.vendorCompany = this.vendors[i].company.toString();
        this.vendorPhone = this.vendors[i].phone.toString();
        this.vendorEmail = this.vendors[i].email.toString();
        this.vendorVatno = this.vendors[i].vatno.toString();
        this.updateForm.show();
    }

    updateFormHide() {
        this.vendorI = -1;
        this.vendorFName = '';
        this.vendorLName = '';
        this.vendorCompany = '';
        this.vendorPhone = '';
        this.vendorEmail = '';
        this.vendorVatno = '';
        this.updateForm.hide();
    }

    updateFormSave() {
        let query = {
            id: this.vendors[this.vendorI].id.toString(),
            fname: this.vendorFName,
            lname: this.vendorLName,
            company: this.vendorCompany,
            phone: this.vendorPhone,
            email: this.vendorEmail,
            vatno: this.vendorVatno
        }
        console.log(query);
        this.saleDataService.vendorUpdate(query).subscribe (
            res => {
                if (!res.err) {
                    console.log(res);
                    this.toastr.success('Updated successfully!', 'User Info');
                    this.getItemTable(this.page);
                } else {
                    this.toastr.error('could not update vendor', 'Attention');
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
        this.saleDataService.vendorDelete({ id: this.vendors[this.deleteI].id }).subscribe(res => {
            if (!res.err) {
                this.toastr.success('vendor deleted', 'Deleted!');
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
                fname: f.value.fname,
                lname: f.value.lname,
                company: f.value.company,
                phone: f.value.phone,
                email: f.value.email,
                due: '0.00',
                vatno: f.value.vatno,
                qty: 0,
                amount: 0,
                count: 0
            }
            if (f.value.name == '' || f.value.phone == '') {
                this.toastr.error('Enter user info', 'User Info');
                return;
            }
            this.saleDataService.vendorAdd(query).subscribe(
                res => {
                    if (!res.err) {
                        this.getItemTable(this.page);
                        this.toastr.success('vendor added', 'Done!');
                        f.resetForm();
                        // this.findItemComponent.clearModel();
                    } else {
                        this.toastr.error('could not add vendor', 'Attention');
                    }
                }
            );
        } else {
            this.toastr.error('fill all field', 'Attention');
        }
    }
    cancelAdd() {
        // this.findItemComponent.clearModel();
    }

    // mail
    messages = [];
    message = null;
    mailVendorI = -1;
    messageFor = '';
    messageType = '';
    messageLabel = '';
    messageText = '';
    mailFormShow(i) {
        this.mailVendorI = i;
        this.mailForm.show();
        this.messageSearch({ term: '' });
    }
    mailFormHide() {
        this.mailForm.hide();
        this.findMessage.clearModel();
        this.mailVendorI = -1;
        this.messageFor = '';
        this.messageType = '';
        this.messageLabel = '';
        this.messageText = '';
    }
    mailFormSend() {
        console.log(this.vendors, this.mailVendorI);
        let data = {
            for: this.messageFor,
            type: this.messageType,
            label: this.messageLabel,
            vendorId: this.vendors[this.mailVendorI].id,
            shopId: 1,
            message: this.messageText
        };
        this.messageDataService.sendMessage(data).subscribe(res => {
            console.log(res);
            if (!res.err) {
                this.toastr.success(res.msg, 'Message!');
            } else {
                this.toastr.error(res.msg, 'Message!');
            }
        })
    }
    messageSearch(event) {
        // this.message = event.term;
        let query = {
            limit: 20,
            orderBy: 'id',
            order: 'asc',
            searchText: event.term,
            page: 1
        };
        this.messageDataService.getMessage(query).subscribe(
            res => {
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    res[i].createdAt = new Date(res[i].createdAt.toString());
                }
                this.messages = res;
            }
        );
    }
    messageChange(event) {
        // this.message = event.label;
        if (event) {
            this.messageFor = event.for;
            this.messageType = event.type;
            this.messageLabel = event.label;
            this.messageText = event.message;
        } else {
            this.messageFor = '';
            this.messageType = '';
            this.messageLabel = '';
            this.messageText = '';
        }
    }
}