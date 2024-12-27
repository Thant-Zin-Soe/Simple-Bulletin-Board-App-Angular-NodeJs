import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { CommentComponent } from '../comment-create/comment-create.component';
import { PostCreateComponent } from '../post-create/post-create.component';
import { Post } from "../post.model";
import { PostService } from '../post.service';
import { CommentService } from '../comment.service';
import { AuthService } from '../auth/auth.service'
import { NgForm } from '@angular/forms';


@Component ({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

    posts: Post[] = [];
    private postSub: Subscription;
    totalPost = 10;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOption = [1, 2, 5, 10];
    userIsAuthenticated = false;
    userId: string;
    isLoading = false;
    //postId: string;
    private authStatusSub: Subscription;

    constructor(public dialog: MatDialog, public commentService: CommentService, public postService: PostService,
         private authService: AuthService, private commentComponent: CommentComponent) {
    }

    openCmtDialog(postId: string) {
        this.commentService.postId = postId;
        const cmtDialogRef = this.dialog.open(CommentComponent, {width: '1000px', height:'600px'});
        //console.log(postId + "postlistID");
        cmtDialogRef.afterClosed().subscribe(result => {
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
        this.postService.getPost(this.postPerPage,this.currentPage);
    }

    ngOnInit() {
        this.userId = this.authService.getUserId();
        this.isLoading = true;
        this.postService.getPost(this.postPerPage, this.currentPage);
        this.postSub = this.postService.getPostUpdateListener()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
            console.log(postData);
            this.isLoading = false;
            this.posts = postData.posts;
        });

        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
            console.log(this.userId);
        });
    }
    
    onDelete(postId: string) {
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPost(this.postPerPage, this.currentPage);
        });
    } 

    onLikePost(postId: string, isLike: string) {
        // console.log(postId+" "+"post");
        // console.log(isLike);
        this.postService.likePost(postId, isLike);
    }

    isLiked(post, userId) {
        //console.log(post);
        //console.log(userId);
        for(let like of post.like) {
            if (like._id == userId) {
                return true;
                break;
            }
        }
        return false;
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}

