import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthDataService } from './auth-data.service';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    id: number;
    name: string;
    email: string;
    isadmin: number;
    constructor(
        public authService: AuthService,
        public router: Router,
        private authDataService: AuthDataService
    ) {
        this.authService.check();
    }
    canActivate(): Observable<boolean> {
        return Observable.create(observer => {
            //console.log('************going');
            this.authDataService.check().subscribe (
                res=> {
                    if (!res.err && res.loggedin) {
                        //console.log('************going ok');
                        observer.next(true);
                        observer.complete();
                        this.getData();
                    } else {
                        //console.log('************going else');
                        this.router.navigate(['login']);
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
                this.name = res.name;
                this.email = res.email;
                this.isadmin = res.isadmin;
            }
        });
    }
}