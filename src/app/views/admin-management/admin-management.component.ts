import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthGuardService } from '../../auth-services/auth-guard.service';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { environment } from '../../../environments/environment';
import { Auth } from '../../auth-services/auth';
@Component({
    templateUrl: 'admin-management.component.html'
})
export class AdminManagementComponent implements OnInit {
    @ViewChild('userForm') public userForm: ModalDirective;
    constructor(
        public authGuardService: AuthGuardService,
        public authDataService: AuthDataService,
        public router: Router,
        private toastr: ToastrService
    ) { }
    ngOnInit(): void {
        this.getUserTable(null);
        // generate random values for mainChart
    }

    usersList: Array<Auth>;
    pages: Array<number>;
    userPage = 1;
    userLimit = 10;
    userOrderBy = 'id';
    userOrder = 'asc';
    userSearchText = '';
    getUserTable(pageNo) {
        if (pageNo != null) {
            if (pageNo == -1) pageNo = this.userPage - 1;
            if (pageNo == -2) pageNo = this.userPage + 1;
            if (pageNo < 1 || pageNo > this.pages.length) return;
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
        this.authDataService.getUsersCount(query).subscribe (
            resCount => {
                console.log(resCount);
                this.pages = Array.from({length: Math.ceil(parseInt(resCount.toString()) / this.userLimit)}, (_, i) => i + 1);
                this.authDataService.getUsers(query).subscribe (
                    res => {
                        console.log(res);
                        for (let i = 0; i < res.length; i++) {
                            res[i].createdAt = new Date(res[i].createdAt.toString());
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
        if (value == 1) return 'transaction';
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

            this.userDataName = this.usersList[i].name.toString();
            this.userDataEmail = this.usersList[i].email.toString();
            this.userDataPhoneno = this.usersList[i].phoneno.toString();
            this.userDataOtherPhoneno = this.usersList[i].otherphoneno.toString();
            this.userDataPincode = this.usersList[i].pincode.toString();
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
}