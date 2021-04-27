import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthDataService } from './auth-data.service';
import { Auth } from './auth';
const SESSION_ID = 'session_id';
const SESSION_USERID = 'session_userid';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn = false;
    isAdmin = 0;
    phoneno = 0;
    userAuth: Auth;

    constructor(
        private authDataService: AuthDataService
    ) { }
    check() {
        this.authDataService.check().subscribe (
            res=> {
                this.loggedIn = !res.err && res.loggedin;
                this.isAdmin = (!res.err && res.loggedin) ? res.isadmin : 0;
                this.phoneno = parseInt(window.localStorage.getItem(SESSION_USERID));
                let tAuth: Auth = new Auth(
                    res.id,
                    res.phoneno,
                    null,
                    res.name,
                    res.isadmin,
                    res.pincode,
                    res.area
                );
                this.userAuth = tAuth;
            }
        );
    }
    login(email: string, password: string): Observable<any> {
        return Observable.create(observer => {
            this.authDataService.login(email, password).subscribe (
                res=> {
                    this.loggedIn = !res.err && res.loggedin;
                    this.isAdmin = (!res.err && res.loggedin) ? res.isadmin : 0;
                    if (!res.err && res.loggedin) {
                        window.localStorage.setItem(SESSION_ID, res[SESSION_ID]);
                        window.localStorage.setItem(SESSION_USERID, res[SESSION_USERID]);
                        let tAuth: Auth = new Auth(
                            res.id,
                            res.phoneno,
                            null,
                            res.name,
                            res.isadmin,
                            res.pincode,
                            res.area
                        );
                        this.userAuth = tAuth;
                    }
                    observer.next(res);
                    observer.complete();
                }
            );
        });
    }
    logout(): Observable<any> {
        return Observable.create(observer => {
            this.authDataService.logout().subscribe (
                res=> {
                    if (!res.err) {
                        window.localStorage.setItem(SESSION_ID, "null");
                        window.localStorage.setItem(SESSION_USERID, "null");
                        this.loggedIn = !res.loggedout;
                        this.isAdmin = 0;
                    }
                    observer.next(res);
                    observer.complete();
                }
            );
        });
    }
}