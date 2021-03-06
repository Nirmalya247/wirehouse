import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { ShopDataService } from '../../services/shop-data.service';
import { MessageDataService } from '../../services/message-data.service';
import { environment } from '../../../environments/environment';
import { Auth } from '../../auth-services/auth';
@Component({
    templateUrl: 'admin-management.component.html'
})
export class AdminManagementComponent implements OnInit {
    @ViewChild('userForm') public userForm: ModalDirective;
    @ViewChild('confirmForm') public confirmForm: ModalDirective;
    @ViewChild('messageForm') public messageForm: ModalDirective;
    @ViewChild('mailForm') public mailForm: ModalDirective;
    @ViewChild('FindMessage') findMessage: NgSelectComponent;
    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public shopDataService: ShopDataService,
        public messageDataService: MessageDataService,
        public router: Router,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.getUserTable(null);
        this.getShop();
        this.getMessageTable(null);
        // generate random values for mainChart
    }

    usersList: Array<Auth> = [ ];
    userPages: Array<number> = [ ];
    userPage = 1;
    userLimit = 10;
    userOrderBy = 'id';
    userOrder = 'asc';
    userSearchText = '';
    getUserTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.userPage - 1;
            if (pageNo == -2) pageNo = this.userPage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.userPages.length;
            if (pageNo < 1 || pageNo > this.userPages.length) return;
            this.userPage = pageNo;
        }
        else this.userPage = 1;
        let query = {
            userLimit: this.userLimit,
            userOrderBy: this.userOrderBy,
            userOrder: this.userOrder,
            userSearchText: this.userSearchText,
            userPage: this.userPage
        }
        this.authDataService.getUsersCount(query).subscribe(
            resCount => {
                console.log(resCount);
                this.userPages = Array.from({ length: Math.ceil(parseInt(resCount.toString()) / this.userLimit) }, (_, i) => i + 1);
                this.authDataService.getUsers(query).subscribe(
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].createdAt = new Date(res[i].createdAt.toString());
                            res[i].lastsalary = new Date(res[i].lastsalary.toString());
                        }
                        this.usersList = res;
                    }
                );
            }
        );
        console.log(this.userLimit, this.userOrderBy, this.userOrder, this.userSearchText);
    }

    changeActive(i) {
        console.log(this.usersList[i].active);
        if (this.usersList[i].active) {
            this.authDataService.activate({ id: this.usersList[i].id }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('activated!', 'User Info');
                } else {
                    this.toastr.error('could not activate', 'User Info');
                    this.usersList[i].active = 1;
                }
            });
        } else {
            this.authDataService.deactivate({ id: this.usersList[i].id }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('deactivated!', 'User Info');
                } else {
                    this.toastr.error('could not deactivate', 'User Info');
                    this.usersList[i].active = 0;
                }
            });
        }
    }

    getAdminRole(value) {
        if (value == 10) return 'super admin';
        if (value == 3) return 'admin';
        if (value == 2) return 'inventory manager';
        if (value == 1) return 'sales';
    }

    //*********** userData
    userFormLabel: string = '';
    userFormMode: string = '';

    userDataI: number = -1;
    userDataName: string = '';
    userDataEmail: string = '';
    userDataPhoneno: string = '';
    userDataOtherPhoneno: string = '';
    userDataPincode: string = '';
    userDataSalary: string = '';
    userDataLastSalary: string = '';
    userDataAddress: string = '';
    userDataIsAdmin: string = '';
    userDataPassword: string = '';
    userDataPasswordRe: string = '';

    clearUserInfo() {
        this.userDataName = '';
        this.userDataEmail = '';
        this.userDataPhoneno = '';
        this.userDataOtherPhoneno = '';
        this.userDataPincode = '';
        this.userDataSalary = '';
        this.userDataLastSalary = '';
        this.userDataAddress = '';
        this.userDataIsAdmin = '';
        this.userDataPassword = '';
        this.userDataPasswordRe = '';
    }
    userFormShow(mode, i) {
        if (mode == 'newUser') {
            this.userFormLabel = 'New User';
            this.userDataI = -1;
        } else if (mode == 'updateUser') {
            this.userFormLabel = 'Update User';
            this.userDataI = i;
            console.log(this.usersList[i]);
            this.userDataName = this.usersList[i].name.toString();
            this.userDataEmail = this.usersList[i].email.toString();
            this.userDataPhoneno = this.usersList[i].phoneno.toString();
            this.userDataOtherPhoneno = this.usersList[i].otherphoneno.toString();
            this.userDataPincode = this.usersList[i].pincode.toString();
            this.userDataSalary = this.usersList[i].salary.toString();
            this.userDataLastSalary = this.usersList[i].lastsalary.toString();
            this.userDataAddress = this.usersList[i].address.toString();
            this.userDataIsAdmin = this.usersList[i].isadmin.toString();
            this.userDataPassword = '';
            this.userDataPasswordRe = '';
        }
        this.userFormMode = mode;
        this.userForm.show();
    }

    userFormHide() {
        this.userForm.hide();
        this.clearUserInfo();
    }

    userFormSave() {
        if (this.userDataPassword != this.userDataPasswordRe) {
            this.toastr.error('password did not match', 'User Info');
            return;
        }
        let data = {
            name: this.userDataName,
            email: this.userDataEmail,
            phoneno: this.userDataPhoneno,
            otherphoneno: this.userDataOtherPhoneno,
            pincode: this.userDataPincode,
            salary: this.userDataSalary,
            lastsalary: this.userDataLastSalary,
            address: this.userDataAddress,
            isadmin: this.userDataIsAdmin,
            password: this.userDataPassword
        }
        if (this.userFormMode == 'newUser') {
            data['active'] = 1;
            data['deleted'] = 0;
            this.authDataService.create(data).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('new user created', 'User Info');
                    this.userFormHide();
                    this.getUserTable(this.userPage);
                } else {
                    this.toastr.error('could not create new user', 'User Info');
                }
            });
        } else if (this.userFormMode == 'updateUser') {
            data['id'] = this.usersList[this.userDataI].id;
            if (this.userDataPassword == '') {
                delete data.password;
            }
            this.authDataService.update(data).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('user update', 'User Info');
                    this.userFormHide();
                    this.getUserTable(this.userPage);
                } else {
                    this.toastr.error('could not update user', 'User Info');
                }
            });
        }
    }

    userSetSalary(i) {
        this.salaryToI = i;
        this.confirmFor = 'salary';
        this.confirmForm.show();
    }

    deleteUser(i) {
        this.deleteI = i;
        this.confirmFor = 'user';
        this.confirmForm.show();
    }

    //***********

    messagesList: Array<any> = [];
    messagePages: Array<number> = [];
    messagePage = 1;
    messageLimit = 10;
    messageOrderBy = 'id';
    messageOrder = 'asc';
    messageSearchText = '';

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

    getMessageTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.messagePage - 1;
            if (pageNo == -2) pageNo = this.messagePage + 1;
            if (pageNo == -3) pageNo = 1;
            if (pageNo == -4) pageNo = this.messagePages.length;
            if (pageNo < 1 || pageNo > this.messagePages.length) return;
            this.messagePage = pageNo;
        }
        else this.messagePage = 1;
        let query = {
            limit: this.messageLimit,
            orderBy: this.messageOrderBy,
            order: this.messageOrder,
            searchText: this.messageSearchText,
            page: this.messagePage
        }
        this.messageDataService.getMessageCount(query).subscribe(
            resCount => {
                console.log(resCount);
                this.messagePages = Array.from({ length: Math.ceil(parseInt(resCount.toString()) / this.messageLimit) }, (_, i) => i + 1);
                this.messageDataService.getMessage(query).subscribe(
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].createdAt = new Date(res[i].createdAt.toString());
                        }
                        this.messagesList = res;
                    }
                );
            }
        );
        console.log(this.messageLimit, this.messageOrderBy, this.messageOrder, this.messageSearchText);
    }

    isMessageDeletable(id) {
        return parseInt(id.toString().substr(2)) > 14;
    }

    //*********** messageData
    messageFormLabel: string = '';
    messageFormMode: string = '';

    messageDataI: number = -1;
    messageDataID: string = '';
    messageDataFor: string = '';
    messageDataType: string = '';
    messageDataLabel: string = '';
    messageDataMessage: string = '';

    clearMessageInfo() {
        this.messageDataID = '';
        this.messageDataFor = '';
        this.messageDataType = '';
        this.messageDataLabel = '';
        this.messageDataMessage = '';
    }
    messageFormShow(mode, i) {
        if (mode == 'newMessage') {
            this.messageFormLabel = 'New Message';
            this.messageDataI = -1;
        } else if (mode == 'updateMessage') {
            this.messageFormLabel = 'Update Message';
            this.messageDataI = i;
            this.messageDataID = this.messagesList[i].id.toString();
            this.messageDataFor = this.messagesList[i].for.toString();
            this.messageDataType = this.messagesList[i].type.toString();
            this.messageDataLabel = this.messagesList[i].label.toString();
            this.messageDataMessage = this.messagesList[i].message.toString();
        }
        this.messageFormMode = mode;
        this.messageForm.show();
    }

    messageFormHide() {
        this.messageForm.hide();
        this.clearMessageInfo();
    }

    messageFormSave() {
        let data = {
            for: this.messageDataFor,
            type: this.messageDataType,
            label: this.messageDataLabel,
            message: this.messageDataMessage
        }
        if (this.messageFormMode == 'newMessage') {
            this.messageDataService.add(data).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('new message created', 'Message');
                    this.messageFormHide();
                    this.getMessageTable(this.messagePage);
                } else {
                    this.toastr.error('could not create new message', 'Message');
                }
            });
        } else if (this.messageFormMode == 'updateMessage') {
            data['id'] = this.messagesList[this.messageDataI].id;
            this.messageDataService.update(data).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('message update', 'Message');
                    this.messageFormHide();
                    this.getMessageTable(this.messagePage);
                } else {
                    this.toastr.error('could not update message', 'Message');
                }
            });
        }
    }

    deleteMessage(i) {
        this.deleteMessageI = i
        this.confirmFor = 'message';
        this.confirmForm.show();
    }


    

    deleteI = -1;
    deleteMessageI = -1
    salaryToI = -1;
    confirmFor = '';

    confirmFormHide() {
        this.deleteI = -1;
        this.deleteMessageI = -1
        this.salaryToI = -1;
        this.confirmForm.hide();
    }

    confirmFormSave() {
        if (this.confirmFor == 'user') {
            this.authDataService.deleteUser({ id: this.usersList[this.deleteI].id }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('user deleted', 'Deleted!');
                    this.getUserTable(this.userPage);
                } else {
                    this.toastr.error('user could not be deleted', 'Delete');
                }
                this.confirmFormHide();
            });
        } else if (this.confirmFor == 'message') {
            this.messageDataService.deleteMessage({ id: this.messagesList[this.deleteMessageI].id }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('message deleted', 'Deleted!');
                    this.getMessageTable(this.messagePage);
                } else {
                    this.toastr.error('message could not be deleted', 'Delete');
                }
                this.confirmFormHide();
            });
        } else if (this.confirmFor == 'salary') {
            this.authDataService.setSalary({ }).subscribe(res => {
                if (!res.err) {
                    this.toastr.success('salary given', 'User Info');
                } else {
                    this.toastr.error('some error', 'User Info');
                }
                this.confirmFormHide();
            });
        }
    }

    //***********

    shopname: string = '';
    shopdetails: string = '';
    shopaddress: string = '';
    shopphoneno: string = '';
    shopotherphoneno: string = '';
    smskey: string = '';
    hubspotkey: string = '';
    website: string = '';
    shopemail: string = '';
    shopemailpassword: string = '';
    vatno: string = '';
    licenseno: string = '';
    billnote: string = '';
    billfooter: string = '';
    shopData: any = {};

    getShop() {
        this.shopDataService.getShop({ }).subscribe(res => {
            console.log(res);
            this.shopname = res.shopname;
            this.shopdetails = res.shopdetails;
            this.shopaddress = res.shopaddress;
            this.shopphoneno = res.shopphoneno;
            this.shopotherphoneno = res.shopotherphoneno;
            this.smskey = res.smskey;
            this.hubspotkey = res.hubspotkey;
            this.website = res.shopwebsite;
            this.shopemail = res.shopemail;
            this.shopemailpassword = res.shopemailpassword;
            this.vatno = res.vatno;
            this.licenseno = res.licenseno;
            this.billnote = res.billnote
            this.billfooter = res.billfooter;
            this.shopData = res;
        });
    }

    saveShop() {
        this.shopDataService.saveShop({
            id: 1,
            shopname: this.shopname,
            shopdetails: this.shopdetails,
            shopaddress: this.shopaddress,
            shopphoneno: this.shopphoneno,
            shopotherphoneno: this.shopotherphoneno,
            smskey: this.smskey,
            hubspotkey: this.hubspotkey,
            shopwebsite: this.website,
            shopemail: this.shopemail,
            shopemailpassword: this.shopemailpassword,
            vatno: this.vatno,
            licenseno: this.licenseno,
            billnote: this.billnote,
            billfooter: this.billfooter
        }).subscribe(res => {
            if (!res.err) {
                this.toastr.success('shop data saved', 'Shop Info');
            } else {
                this.toastr.error(res.msg, 'Shop Info');
            }
        });
    }

    cancelShop() {
        this.shopname = this.shopData.shopname;
        this.shopdetails = this.shopData.shopdetails;
        this.shopaddress = this.shopData.shopaddress;
        this.shopphoneno = this.shopData.shopphoneno;
        this.shopotherphoneno = this.shopData.shopotherphoneno;
        this.smskey = this.shopData.smskey;
        this.hubspotkey = this.shopData.hubspotkey;
        this.website = this.shopData.shopwebsite;
        this.vatno = this.shopData.vatno;
        this.licenseno = this.shopData.licenseno;
        this.billnote = this.shopData.billnote;
        this.billfooter = this.shopData.billfooter;
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

    // mail for user
    messages = [];
    message = null;
    mailUserI = -1;
    messageFor = '';
    messageType = '';
    messageLabel = '';
    messageText = '';
    mailFormShow(i) {
        this.mailUserI = i;
        this.mailForm.show();
        this.messageSearch({ term: '' });
    }
    mailFormHide() {
        this.mailForm.hide();
        this.findMessage.clearModel();
        this.mailUserI = -1;
        this.messageFor = '';
        this.messageType = '';
        this.messageLabel = '';
        this.messageText = '';
    }
    mailFormSend() {
        console.log(this.usersList, this.mailUserI);
        let data = {
            for: this.messageFor,
            type: this.messageType,
            label: this.messageLabel,
            userId: this.usersList[this.mailUserI].id,
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