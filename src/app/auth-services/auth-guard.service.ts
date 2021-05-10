import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthDataService } from './auth-data.service';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    id: number;
    phoneno: number;
    otherphoneno: number;
    email: string;
    isadmin: number;
    active: Number;
    deleted: number;
    name: string;
    pincode: string;
    address: string;

    //
    shopname: string = '';
    shopdetails: string = '';
    shopaddress: string = '';
    shopphoneno: string = '';
    shopotherphoneno: string = '';
    vatno: string = '';
    licenseno: string = '';

    constructor(
        public authService: AuthService,
        public router: Router,
        private authDataService: AuthDataService
    ) {
        //this.authService.check();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let isadmin = 1;
        if (state.url.indexOf('transactions') > 0) isadmin = 1;
        if (state.url.indexOf('inventory') > 0) isadmin = 2;
        if (state.url.indexOf('dashboard') > 0) isadmin = 3;
        if (state.url.indexOf('admin-management') > 0) isadmin = 10;
        return Observable.create(observer => {
            // console.log('************going', route.url, state.url);
            this.authDataService.check(isadmin).subscribe(
                res => {
                    if (!res.err && res.loggedin) {
                        // console.log('************going ok');
                        observer.next(true);
                        observer.complete();
                        this.getData();
                    } else {
                        // console.log('************going else');
                        if (state.url.indexOf('transactions') < 0) this.router.navigate(['transactions']);
                        else this.router.navigate(['login']);
                        observer.next(false);
                        observer.complete();
                    }
                }
            );
        });
    }
    getData() {
        this.authDataService.getUserData().subscribe(res => {
            if (!res.err) {
                this.id = res.id;
                this.phoneno = res.phoneno;
                this.otherphoneno = res.otherphoneno;
                this.email = res.email;
                this.isadmin = res.isadmin;
                this.active = res.active;
                this.deleted = res.deleted;
                this.name = res.name;
                this.pincode = res.pincode;
                this.address = res.address;
            }
        });
        this.authDataService.getShopData({ id: 1}).subscribe(res => {
            if (!res.err) {
                this.shopname = res.shopname;
                this.shopdetails = res.shopdetails;
                this.shopaddress = res.shopaddress;
                this.shopphoneno = res.shopphoneno;
                this.shopotherphoneno = res.shopotherphoneno;
                this.vatno = res.vatno;
                this.licenseno = res.licenseno;
            }
        });
    }
    logout() {
        this.authDataService.logout().subscribe(res => {
            if (!res.err) {
                this.id = 0;
                this.phoneno = 0;
                this.otherphoneno = 0;
                this.email = '';
                this.isadmin = 0;
                this.active = 0;
                this.deleted = 1;
                this.name = 'user';
                this.pincode = '';
                this.address = '';
                window.localStorage.setItem(environment.SESSION_ID, "null");
                window.localStorage.setItem(environment.SESSION_USERID, "null");
                this.router.navigate(['login']);
            }
        });
    }
}