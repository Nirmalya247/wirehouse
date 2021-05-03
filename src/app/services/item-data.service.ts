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
    getItems(query):Observable<Array<Item>> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/getitems';
        return this.http.post<Array<Item>>(url, query);
    }
    // get items count
    getItemsCount(query):Observable<Number> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/getitemscount';
        return this.http.post<Number>(url, query);
    }
    // edit item
    edit(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/edit';
        return this.http.post(url, data);
    }
    // update item
    update(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/update';
        return this.http.post(url, data);
    }
    // delete item
    delete(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'item/delete';
        return this.http.post(url, data);
    }
}