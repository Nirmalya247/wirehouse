import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import { AuthDataService } from '../../auth-services/auth-data.service';
import { AuthService } from '../../auth-services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    constructor(
        public authService: AuthService,
        public router: Router,
        private authDataService: AuthDataService
    ) {
        //this.authService.check();
    }
    ngOnInit(): void {
        // generate random values for mainChart
    }
    login(f: NgForm) {
        if (f.valid) {
            this.authDataService.login(f.value.email, f.value.password).subscribe (
                res=> {
                    if (res.loggedin) {
                        window.localStorage.setItem(environment.SESSION_ID, res.SESSION_ID);
                        window.localStorage.setItem(environment.SESSION_USERID, res.SESSION_USERID);
                        this.router.navigate(['dashboard']);
                    }
                    console.log(res);
                }
            );
        }
        //console.log(f.value, f.valid);
    }
}