import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component ({
    selector: 'app-header',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authListeneSubs: Subscription;
    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListeneSubs = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    ngOnDestroy() {
        this.authListeneSubs.unsubscribe();
    }

    onLogOut() {
        this.authService.logOut();
    }

}