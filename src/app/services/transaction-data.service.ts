import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Transaction } from '../data/transaction';
import { environment } from './../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class TransactionDataService {
    constructor(private http:HttpClient) { }
    // add new transaction
    addTransaction(transaction):Observable<any> {
        transaction[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        transaction[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'transaction/add';
        return this.http.post(url, transaction);
    }
    // get transactions count
    getTransactionsCount(transaction):Observable<any> {
        transaction[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        transaction[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'transaction/gettransactionscount';
        return this.http.post(url, transaction);
    }
    // get transactions
    getTransactions(transaction):Observable<Array<Transaction>> {
        transaction[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        transaction[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'transaction/gettransactions';
        return this.http.post<Array<Transaction>>(url, transaction);
    }
    // get transaction item
    getTransactionItem(transaction):Observable<any> {
        transaction[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        transaction[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'transaction/gettransactionitem';
        return this.http.post(url, transaction);
    }



    // get customer data
    customerGet(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/get';
        return this.http.post(url, query);
    }
    // add customer
    customerAdd(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/add';
        return this.http.post(url, query);
    }
    // update customer
    customerUpdate(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/update';
        return this.http.post(url, query);
    }
}