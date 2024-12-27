import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { CommentComponent } from '../comment-create/comment-create.component';
import { PostCreateComponent } from '../post-create/post-create.component';
import { Post } from "../post.model";
import { PostService } from '../post.service';
import { AuthService } from '../auth/auth.service'
import { CommentService } from '../comment.service';
import { User } from '../auth/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy{

    posts: Post[] = [];
    user: User[] =[];
    private postSub: Subscription;
    private userSub: Subscription;
    totalPost = 10;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOption = [1, 2, 5, 10];
    userIsAuthenticated = false;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    private authStatusSub: Subscription;

    constructor(public dialog: MatDialog, 
        public postService: PostService, 
        private authService: AuthService,
        private commentService: CommentService) {
    }

    openCmtDialog(postId: string) {
        this.commentService.postId = postId;
        const cmtDialogRef = this.dialog.open(CommentComponent, {width: '1000px', height:'600px'});
        cmtDialogRef.afterClosed().subscribe(result => {
            console.log('Dialog result: ${result}', "comment")
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(PostCreateComponent, {width: '1000px', height:'600px'});
        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog result: ${result}',"post")
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.postPerPage = pageData.pageSize;
        this.postService.getPost(this.postPerPage, this.currentPage)
    }

    ngOnInit() {
        this.email = this.authService.getEmail();
        this.firstName = this.authService.getFirstName();
        this.lastName = this.authService.getLastName();
        this.userId = this.authService.getUserId();
        this.postService.getPost(this.postPerPage, this.currentPage);
        this.postSub = this.postService.getPostUpdateListener()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
            console.log(postData);
            this.posts = postData.posts;
        });
        this.userSub = this.authService.getUserUpdateListener()
        .subscribe((userData: {user: User[]}) => {
            console.log(userData);
            this.user = userData.user;
        });

        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }
    
    onDelete(postId: string) {
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPost(this.postPerPage, this.currentPage);
        });
    } 

    onLikePost(postId: string, isLike: string) {
        console.log(postId+" "+"post");
        this.postService.likePost(postId, isLike);
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();
        this.userSub.unsubscribe();
    }
}