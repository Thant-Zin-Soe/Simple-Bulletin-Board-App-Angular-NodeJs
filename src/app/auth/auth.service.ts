import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map, first } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: "root" })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private firstName: string;
    private lastName: string;
    private user: User[] = [];
    private email: string;
    private authStatusListener = new Subject<boolean>();
    private userUpdated = new Subject<{user: User[]}>();

    constructor(private http: HttpClient, private router: Router) {}

    getUser() {
        this.http.get<{message: string, user: any}>(
            "http://localhost:3000/api/user"
        ).pipe(map((userData) => {
            return { user: userData.user.map(user => {
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    id: user._id
                }
            })};
        }))
        .subscribe((transfromedUserData) => {
            console.log(transfromedUserData);
            this.user = transfromedUserData.user;
            this.userUpdated.next({user:[...this.user]})
        })
    }

    getUserUpdateListener() {
        return this.userUpdated.asObservable();
    }

    getUserInfo(id: string) {
        console.log(id);
        return this.http.get<{id: string, firstName: string, lastName: string, email: string}> (
            "http://localhost:3000/api/user/"+id
        )
    }

    updateUser(id: string, firstName: string, lastName: string, email: string) {
        let userData: User | FormData;
        userData = {id: id, firstName: firstName, lastName: lastName, email: email};
        console.log(userData.firstName + userData.lastName);
        this.http.put("http://localhost:3000/api/user/"+id, userData)
        .subscribe(response => {
            this.router.navigate(["/profile"]);
        })
    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getEmail() {
        return this.email;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }

    createUser( firstName: string,
                lastName: string,
                email: string, 
                password: string) {
        const authData: AuthData = {
            firstName: firstName,
            lastName: lastName,
            email: email, 
            password: password
        };
        this.http.post("http://localhost:3000/api/user/register", authData).subscribe(() => {
            this.login(firstName, lastName,email,password);
            this.router.navigate["/"];
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    login(firstName: string, lastName: string, email:string, password: string) {
        const authData: AuthData = {
            firstName: firstName,
            lastName: lastName,
            email: email, 
            password: password
        };
        this.http.post<{token: string; expiresIn: any, userId: string, firstName: string, lastName: string, email: string}>(
            "http://localhost:3000/api/user/login", authData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if (token) {
                const expireInDuration = response.expiresIn;
                this.setAuthTimer(expireInDuration);
                this.tokenTimer = setTimeout(() => {
                    this.logOut();
                }, expireInDuration * 1000);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.firstName = response.firstName;
                this.lastName = response.lastName;
                this.email = response.email;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
                this.saveAuthData(token, expirationDate, this.userId, this.firstName, this.lastName, this.email);
                this.router.navigate(['/']);
            }
            this.email = this.getAuthData().email;
            this.firstName = this.getAuthData().firstName;
            this.lastName = this.getAuthData().lastName;
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expireIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expireIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.firstName = authInformation.firstName;
            this.lastName = authInformation.lastName;
            this.email = authInformation.email;
            this.setAuthTimer(expireIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logOut() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log("Setting timer: "+ duration);
        this.tokenTimer = setTimeout(() => {
            this.logOut();
        }, duration * 1000)
    }

    private saveAuthData(token: string, expirationDate: Date, 
            userId: string, firstName: string, lastName:string, email: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        const firstName = localStorage.getItem("firstName");
        const lastName = localStorage.getItem("lastName");
        const email = localStorage.getItem("email");
        if(!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            email: email
        }
    }
}