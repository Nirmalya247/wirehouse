import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DashboardDataService {
    constructor(private http:HttpClient) { }
    // get today
    getToday(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'saledata/gettoday';
        return this.http.post(url, data);
    }
    // get graph data
    getGraphData(data):Observable<any> {
        data[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        data[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'saledata/getgraphdata';
        return this.http.post(url, data);
    }
}