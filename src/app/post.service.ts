import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
    private post: Post[] = [];
    // userId: string;
    // postId: string;
    postPerPage: number;
    currnetePage: number;
    isLiked: boolean;
    private postUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPost(postPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        this.http.get<{message: string, post: any, maxPost: number}>('http://localhost:3000/api/post'+queryParams)
        .pipe(map((postData) => {
            console.log(postData);
            return { posts: postData.post.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator,
                    like: post.like
                };
            }), maxPosts: postData.maxPost};
        }))
        .subscribe((transformedPostData) => {
            console.log(transformedPostData);
            this.post = transformedPostData.posts;
            this.postUpdated.next({posts:[...this.post], postCount: transformedPostData.maxPosts});
        });
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPosts(id: string) {
        return this.http.get<{_id: string, title: string, content:string, imagePath: string, creator: string}>(
            "http://localhost:3000/api/post/"+id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post<{message: string, post: Post}>(
            'http://localhost:3000/api/post', postData)
        .subscribe((responseData) => {
            //this.router.navigate(["/"]);
        });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {
            postData = {id: id, title: title, content: content, imagePath: image, creator: null, like: null};
        }
        console.log(postData);

        this.http.put("http://localhost:3000/api/post/"+id, postData)
        .subscribe(response => {
            this.router.navigate(["/"]);
        });
    }

    likePost(postId: string, isLiked:string) {
        this.isLiked= false;
        let likePost: any | FormData;
        console.log(postId+"post postservice");
        //console.log(userId+"user postservice");
        likePost = {id: postId, isLiked: isLiked}
        console.log(likePost);
        this.http.put("http://localhost:3000/api/post/like/"+postId, likePost)
        .subscribe(response => {
            this.getPost(this.postPerPage, this.currnetePage);
            this.router.navigate(['/']);
        })
    }

    deletePost(postId: string) {
        return this.http.delete("http://localhost:3000/api/post/"+postId);
    }
}