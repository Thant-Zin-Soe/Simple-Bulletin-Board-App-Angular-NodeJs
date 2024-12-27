import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Form } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from "../auth/user.model";
import { PostService } from '../post.service';

@Component({
    selector: 'edit-profile-app',
    templateUrl: './editprofile.component.html',
    styleUrls: ['./editprofile.component.css']
})
export class EditProfile implements OnInit {
    enteredFirstName = '';
    enteredLastName = '';
    form: FormGroup;
    user: User;
    private userId: string;

    constructor(public authService: AuthService, 
        public route: ActivatedRoute, public postService: PostService) {}

    ngOnInit() {
        this.form = new FormGroup({
            firstName: new FormControl(null),
            lastName: new FormControl(null),
            email: new FormControl(null)
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('userId')) {
                this.userId = paramMap.get('userId');
                console.log(this.userId);
                this.authService.getUserInfo(this.userId).subscribe(userData => {
                    this.user = {
                        id: userData.id,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email
                    };
                    this.form.setValue({
                        firstName: this.user.firstName,
                        lastName: this.user.lastName,
                        email: this.user.email
                    });
                });
            }
        })
    }

    onEditProfile() {
        if(this.form.invalid) {
            return;
        }
        this.authService.updateUser(this.userId, this.form.value.firstName, this.form.value.lastName,
            this.form.value.email);
        this.form.reset();
    }

}