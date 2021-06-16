import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Sale, Purchase } from '../data/transaction';
import { Customer } from '../data/customer';
import { Vendor } from '../data/vendor';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class SaleDataService {
    constructor(private http:HttpClient) { }
    // add new sale
    addSale(sale):Observable<any> {
        sale[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        sale[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'sale/add';
        return this.http.post(url, sale);
    }
    // get sales count
    getSalesCount(sale):Observable<any> {
        sale[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        sale[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'sale/getsalescount';
        return this.http.post(url, sale);
    }
    // get sales
    getSales(sale):Observable<Array<Sale>> {
        sale[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        sale[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'sale/getsales';
        return this.http.post<Array<Sale>>(url, sale);
    }
    // get sale item
    getSaleItem(sale):Observable<any> {
        sale[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        sale[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'sale/getsaleitem';
        return this.http.post(url, sale);
    }
    // get sale item by stock
    getSaleItemByStock(sale):Observable<any> {
        sale[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        sale[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'sale/getsaleitembystock';
        return this.http.post(url, sale);
    }
    // get last sale item
    getLastSaleItem(sale):Observable<any> {
        sale[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        sale[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'sale/getlastsaleitem';
        return this.http.post(url, sale);
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
    // delete customer
    customerDelete(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/delete';
        return this.http.post(url, query);
    }
    // get customer info
    customerInfo(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/customerinfo';
        return this.http.post(url, query);
    }
    // get customer
    getCustomer(query):Observable<Array<Customer>> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/getcustomer';
        return this.http.post<Array<Customer>>(url, query);
    }
    // get customer count
    getCustomerCount(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'customer/getcustomercount';
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
    // remove due by purchase
    removeDueByPurchase(purchase):Observable<any> {
        purchase[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        purchase[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'purchase/removeduebypurchase';
        return this.http.post<any>(url, purchase);
    }



    // get vendor data
    vendorGet(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'vendor/get';
        return this.http.post(url, query);
    }
    // add vendor
    vendorAdd(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'vendor/add';
        return this.http.post(url, query);
    }
    // update vendor
    vendorUpdate(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'vendor/update';
        return this.http.post(url, query);
    }
    // delete vendor
    vendorDelete(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'vendor/delete';
        return this.http.post(url, query);
    }
    // get vendor
    getVendor(query):Observable<Array<Vendor>> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'vendor/getvendor';
        return this.http.post<Array<Vendor>>(url, query);
    }
    // get vendor count
    getVendorCount(query):Observable<any> {
        query[environment.SESSION_ID] = window.localStorage.getItem(environment.SESSION_ID);
        query[environment.SESSION_USERID] = window.localStorage.getItem(environment.SESSION_USERID);
        let url = environment.PATH + 'vendor/getvendorcount';
        return this.http.post(url, query);
    }
}