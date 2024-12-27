import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
    
    private authStatusSub: Subscription;
    constructor(public authService: AuthService) {}
    
    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
            }
        );
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.login(
            form.value.firstName,
            form.value.lastName,
            form.value.email,
            form.value.password
            );
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.createUser(
            form.value.firstName,
            form.value.lastName,
            form.value.email,
            form.value.password
        )
        form.resetForm();
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}