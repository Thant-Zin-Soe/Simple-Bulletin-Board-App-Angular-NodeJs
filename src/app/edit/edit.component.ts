import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from "../post.model";
import { mimeType } from "../post-create/mime-type.validator";

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent{
    enteredTitle = '';
    enteredContent = '';
    post: Post;
    form: FormGroup;
    imagePreview: any;
    private mode = 'create';
    private postId; string;
    

    constructor(public postService: PostService, 
        public route:ActivatedRoute,
        public router: Router) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required]}),
            content: new FormControl(null),
            image: new FormControl(null, {validators: [Validators.required],asyncValidators:[mimeType]})
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                //console.log(this.postId);
                this.postService.getPosts(this.postId).subscribe(postData => {
                    this.post = {id: postData._id, 
                        title: postData.title, 
                        content: postData.content, 
                        imagePath: postData.imagePath,
                        creator: postData.creator,
                        like: null};
                        
                    this.form.setValue({
                        title: this.post.title, 
                        content: this.post.content,
                        image: this.post.imagePath
                    });
                    console.log(this.post.title);
                });
                
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        }
        reader.readAsDataURL(file);
    }

    onSavePost() {
        if(this.form.invalid) {
            return;
        }
        if(this.mode === 'create') {
            this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }

    goHome() {
        this.router.navigate(['/']);
    }
}