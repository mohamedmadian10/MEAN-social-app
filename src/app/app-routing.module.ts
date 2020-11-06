import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: PostListComponent },
  {
    path: "create",
    canActivate: [AuthGuard],
    component: PostCreateComponent,
  },
  {
    path: "edit/:postId",
    canActivate: [AuthGuard],
    component: PostCreateComponent,
  },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
