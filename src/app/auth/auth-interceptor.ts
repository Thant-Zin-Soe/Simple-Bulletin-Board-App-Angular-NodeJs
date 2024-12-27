import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInteceptor implements HttpInterceptor {
    constructor(private authSevice: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authSevice.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer "+authToken)
        });
        return next.handle(authRequest);
    }
}