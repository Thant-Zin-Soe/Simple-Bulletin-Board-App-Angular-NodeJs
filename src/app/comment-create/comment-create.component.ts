import { Component, OnInit, OnDestroy } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Injectable } from '@angular/core';
import { CommentService } from '../comment.service';
import { Subscription } from 'rxjs';
import { Comment } from '../comment.model';
import { AuthService } from '../auth/auth.service'


@Component ({
    selector: 'app-comment',
    templateUrl: './comment-create.component.html',
    styleUrls: ['./comment-create.component.css']
})
@Injectable({ providedIn: "root" })
export class CommentComponent implements OnInit, OnDestroy {

    enteredContent = '';
    userIsAuthenticated = false;
    userId: string;
    postId: string;
    private authStatusSub: Subscription;
    constructor(public commentService: CommentService, public authService: AuthService) {}

    onSaveCmt(form: NgForm) {
        this.postId = this.commentService.postId;
        if (form.invalid) {
            return;
        }
        this.commentService.addComment(form.value.content, this.postId);
        form.resetForm();
    }

    comment: Comment[] = [];
    private commentSub: Subscription;

    ngOnInit() {
        this.postId = this.commentService.postId;
        this.userId= this.authService.getUserId();
        this.commentService.getComment();
        this.commentSub = this.commentService.getCommentUpdateListener()
        .subscribe((comment: Comment[]) => {
            console.log(comment);
            this.comment = comment;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        })
    }

    onDelete(commentId: string) {
        this.commentService.deleteComment(commentId);
    }

    ngOnDestroy() {
        this.commentSub.unsubscribe();
    }

}