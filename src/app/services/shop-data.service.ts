import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class ShopDataService {
    constructor(private http:HttpClient) { }
    // get shop data
    getShop(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'shop/get';
        return this.http.post(url, data);
    }
    // save shop data
    saveShop(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'shop/save';
        return this.http.post(url, data);
    }
}