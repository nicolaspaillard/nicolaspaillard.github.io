import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { User } from "@angular/fire/auth";
import { AuthService } from "@services/auth.service";
import { NgxTypedJsModule } from "ngx-typed-js";
import { ButtonModule } from "primeng/button";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-home",
  imports: [CommonModule, NgxTypedJsModule, ButtonModule, FileUpload, NgOptimizedImage],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  user?: User;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user: User) => (this.user = user));
  }
}
