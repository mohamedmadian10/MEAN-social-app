import { AuthService } from "./../../auth/auth.service";
import { Post } from "./../post.model";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private authStausSub: Subscription;
  isAuthenticated = false;
  userId: string;
  // posts = [
  //   // { title: "First Post", content: "This is First Post" },
  //   // { title: "Second Post", content: "This is Second Post" },
  //   // { title: "Third Post", content: "This is Third Post" },
  // ];
  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService
      .getUpdatedPosts()
      .subscribe((postsData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount;
      });
    this.authStausSub = this.authService
      .getAuthStausListenner()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
        this.userId = this.authService.getUserId();
      });
  }

  //pagination
  onChangedPage(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.postsPerPage = pageEvent.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(postId) {
    this.isLoading = true;
    this.postService.onDeletePost(postId).subscribe(
      (data) => {
        this.isLoading = false;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStausSub.unsubscribe();
  }
}
