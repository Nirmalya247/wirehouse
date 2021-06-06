import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Auth } from './auth';
import { environment } from './../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthDataService {
    constructor(private http:HttpClient) { }
    // check if logged in
    getShopData(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'shop/get';
        return this.http.post(url, data);
    }

    check(isadmin):Observable<any> {
        let auth = { isadmin: isadmin };
        auth[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        auth[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/checklogin';
        return this.http.post(url, auth);
    }
    login(email: string, password: string):Observable<any> {
        let auth = {
            email: email.toString(),
            password: password.toString()
        }
        auth[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        auth[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        
        let url = environment.PATH + 'users/login';
        return this.http.post(url, auth);
    }
    logout():Observable<any> {
        let auth = {};
        auth[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        auth[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/logout';
        return this.http.post(url, auth);
    }

    getUserData():Observable<any> {
        let auth = {};
        auth[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        auth[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/get';
        return this.http.post(url, auth);
    }

    create(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/create';
        return this.http.post(url, data);
    }

    update(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/update';
        return this.http.post(url, data);
    }

    getUsers(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/getusers';
        return this.http.post(url, data);
    }

    getUsersCount(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/getuserscount';
        return this.http.post(url, data);
    }

    deactivate(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/deactivate';
        return this.http.post(url, data);
    }

    activate(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/activate';
        return this.http.post(url, data);
    }

    deleteUser(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/deleteuser';
        return this.http.post(url, data);
    }

    setSalary(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'users/setsalary';
        return this.http.post(url, data);
    }
}