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
                    console.log(res);
                    if (!res.err && res.loggedin) {
                        //console.log('************going ok');
                        observer.next(true);
                        observer.complete();
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
}