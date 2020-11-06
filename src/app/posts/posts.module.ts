import { RouterModule } from '@angular/router';
import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [CommonModule, AngularMaterialModule, ReactiveFormsModule,RouterModule],
})
export class PostsModule {}
