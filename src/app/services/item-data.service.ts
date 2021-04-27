import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Item } from '../data/item';
import { environment } from './../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class ItemDataService {
    constructor(private http:HttpClient) { }
    // add new item
    addItem(item):Observable<any> {
        item[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        item[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/additem';
        return this.http.post(url, item);
    }
    // get items
    getItems(search):Observable<any> {
        search[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        search[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/getitems';
        return this.http.post(url, search);
    }
}