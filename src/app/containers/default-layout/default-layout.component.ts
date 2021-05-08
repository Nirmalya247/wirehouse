import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { AuthGuardService } from '../../auth-services/auth-guard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
    public sidebarMinimized = false;
    public navItems = navItems;

    constructor(
        public authGuardService: AuthGuardService
    ) { }
    toggleMinimize(e) {
        this.sidebarMinimized = e;
    }

    logout() {
        this.authGuardService.logout();
    }
}
