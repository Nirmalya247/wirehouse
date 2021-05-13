import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Transaction, Purchase } from '../data/transaction';
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
    // get transaction item by stock
    getTransactionItemByStock(transaction):Observable<any> {
        transaction[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        transaction[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'transaction/gettransactionitembystock';
        return this.http.post(url, transaction);
    }
    // get last transaction item
    getLastTransactionItem(transaction):Observable<any> {
        transaction[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        transaction[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'transaction/getlasttransactionitem';
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



    // add new purchase
    addPurchase(purchase):Observable<any> {
        purchase[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        purchase[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'purchase/add';
        return this.http.post(url, purchase);
    }
    // get purchases count
    getPurchasesCount(purchase):Observable<any> {
        purchase[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        purchase[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'purchase/getpurchasescount';
        return this.http.post(url, purchase);
    }
    // get purchases
    getPurchases(purchase):Observable<Array<Purchase>> {
        purchase[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        purchase[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'purchase/getpurchases';
        return this.http.post<Array<Purchase>>(url, purchase);
    }



    // get salesman data
    salesmanGet(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'salesman/get';
        return this.http.post(url, query);
    }
    // add salesman
    salesmanAdd(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'salesman/add';
        return this.http.post(url, query);
    }
    // update salesman
    salesmanUpdate(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'salesman/update';
        return this.http.post(url, query);
    }
}