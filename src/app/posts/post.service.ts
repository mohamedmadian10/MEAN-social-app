import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import {environment} from "../../environments/environment"

const baseUrl = environment.apiUrl + "feed/posts";
@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: Post[] = [];
  private postUpdatedListenner = new Subject<{
    posts: Post[];
    postCount: number;
  }>();

  constructor(private http: HttpClient) {}
  getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        baseUrl + queryParam
      )
      .subscribe((postsData) => {
        this.posts = postsData.posts;
        this.postUpdatedListenner.next({
          posts: [...this.posts],
          postCount: postsData.maxPosts,
        });
      });
  }
  getUpdatedPosts() {
    return this.postUpdatedListenner.asObservable();
  }
  getPost(postId) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      content: string;
      creator: string;
    }>(`${baseUrl}/${postId}`);
  }
  onAddPost(title: string, content: string, image: File) {
    const postDate = new FormData();
    postDate.append("title", title);
    postDate.append("content", content);
    postDate.append("image", image, title);
    return this.http.post(baseUrl, postDate);
  }

  // update post
  updatePost(
    postId: string,
    title: string,
    content: string,
    image: string | File
  ) {
    let post: Post | FormData;
    if (typeof image === "object") {
      post = new FormData();
      post.append("_id", postId);
      post.append("title", title);
      post.append("content", content);
      post.append("image", image);
    } else {
      post = {
        _id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    return this.http.put(`${baseUrl}/${postId}`, post);
  }

  //delete post
  onDeletePost(postId) {
    return this.http.delete(`${baseUrl}/${postId}`);
  }
}
