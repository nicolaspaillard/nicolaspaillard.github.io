import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { AuthService } from "@app/shared/services/auth.service";
import { CloudinaryModule } from "@cloudinary/ng";
import { NgxTypedJsModule } from "ngx-typed-js";
import { ButtonModule } from "primeng/button";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-home",
  imports: [CommonModule, NgxTypedJsModule, ButtonModule, FileUpload, CloudinaryModule, NgOptimizedImage],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  user: any = null;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
  }
}
