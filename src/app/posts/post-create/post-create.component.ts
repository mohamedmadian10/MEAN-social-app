import { AuthService } from "./../../auth/auth.service";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator.ts";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private postId: string;
  private mode = "create";
  private post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(
    public postService: PostService,
    private authService: AuthService,
    public aRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStausListenner()
      .subscribe((isAuth) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.aRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((post) => {
          this.post = post;
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
          this.imagePreview = this.form.value.image;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === "create") {
      this.isLoading = true;
      this.postService
        .onAddPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        )
        .subscribe((data) => {
          this.router.navigate(["/"]);
        });
    } else {
      this.isLoading = true;
      this.postService
        .updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        )
        .subscribe((updatedPost) => {
          this.router.navigate(["/"]);
        });
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
