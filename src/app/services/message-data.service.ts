import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class MessageDataService {
    constructor(private http:HttpClient) { }
    // add
    add(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'message/add';
        return this.http.post(url, data);
    }
    // update
    update(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'message/update';
        return this.http.post(url, data);
    }
    // delete message
    deleteMessage(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'message/deletemessage';
        return this.http.post(url, data);
    }
    // get message
    getMessage(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'message/getmessage';
        return this.http.post(url, data);
    }
    // get message count
    getMessageCount(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'message/getmessagecount';
        return this.http.post(url, data);
    }
    // send message
    sendMessage(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'message/sendmessage';
        return this.http.post(url, data);
    }
}