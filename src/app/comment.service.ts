import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from './comment.model';


@Injectable({ providedIn: "root" })
export class CommentService {
    public postId: string;
    private comment: Comment[] = [];
    private commentUpdated = new Subject<Comment[]>();
    constructor(private http: HttpClient) {}

    getComment() {
        this.http.get<{message: string; comment: any}> (
            "http://localhost:3000/api/comment"
        )
        .pipe(map((commentData) => {
            return commentData.comment.map(comment => {
                return {
                    id: comment._id,
                    content: comment.content,
                    creator: comment.creator,
                    postId: comment.postId
                };
            });
        }))
        .subscribe((transformedComment) => {
            this.comment = transformedComment;
            console.log(transformedComment);
            this.commentUpdated.next([...this.comment]);
        })
    }

    getCommentUpdateListener() {
        return this.commentUpdated.asObservable();
    }

    addComment(content: string, postId: string) {
        const comment: Comment = { id:null, content: content, creator: null, postId: postId };
        this.http.post<{message:string, cmtId:string }>("http://localhost:3000/api/comment", comment)
        .subscribe(responseData => {
            const id = responseData.cmtId;
            comment.id = id;
            console.log(comment);
            this.getComment();
        })
    }

    deleteComment(cmtId: string) {
        this.http.delete("http://localhost:3000/api/comment/" + cmtId)
        .subscribe(() => {
            const updatedComment = this.comment.filter(comment => comment.id !== cmtId);
            this.comment = updatedComment;
            this.commentUpdated.next([...this.comment]);
        })
    }
}