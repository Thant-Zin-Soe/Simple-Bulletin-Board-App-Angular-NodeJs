import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule, 
        MatCardModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatIconModule,
        MatPaginatorModule, 
        MatProgressSpinnerModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './header/nav.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { EditComponent } from './edit/edit.component';
import { CommentComponent } from './comment-create/comment-create.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthInteceptor } from './auth/auth-interceptor';
import { ErrorInteceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { EditProfile } from './editprofile/editprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    RegisterComponent,
    PostListComponent,
    PostCreateComponent,
    EditComponent,
    CommentComponent,
    ProfileComponent,
    ErrorComponent,
    EditProfile
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInteceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInteceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [PostCreateComponent, CommentComponent, ErrorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
