import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { EditProfile } from './editprofile/editprofile.component';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'edit/:postId', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'editProfile/:userId', component: EditProfile, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
