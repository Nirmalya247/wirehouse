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
    check():Observable<any> {
        let auth = {};
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
    /*
    // register
    register(
        otp_id: Number,
        otp_code: Number,
        otp_otp: Number,
        phoneno: Number,
        name: String,
        password: String,
        pincode: Number,
        area: String
        ):Observable<any> {
            let data: FormData = new FormData();
            data.append("otp_id", otp_id.toString());
            data.append("otp_code", otp_code.toString());
            data.append("otp_otp", otp_otp.toString());
            data.append("phoneno", phoneno.toString());
            data.append("name", name.toString());
            data.append("password", password.toString());
            data.append("pincode", pincode.toString());
            data.append("area", area.toString());
            let url = PATH + 'users/register';
            return this.http.post(url, data);
    }
    // profile
    profileEdit(name: String, pincode: Number, area: String, password: String): Observable<any> {
        let data: FormData = new FormData();
        data.append(SESSION_ID, window.localStorage.getItem(SESSION_ID));
        data.append(SESSION_USERID, window.localStorage.getItem(SESSION_USERID));
        data.append("name", name.toString());
        data.append("pincode", pincode.toString());
        data.append("area", area.toString());
        data.append("password", password.toString());
        let url = PATH + 'users/profileEdit';
        return this.http.post<any>(url, data);
    }
    */
}