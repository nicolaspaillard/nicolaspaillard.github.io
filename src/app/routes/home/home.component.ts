import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AuthService } from "@app/services/auth.service";
import { CloudinaryModule } from "@cloudinary/ng";
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { NgxTypedJsModule } from "ngx-typed-js";
import { ButtonModule } from "primeng/button";
import { FileUpload } from "primeng/fileupload";
import { cloudinaryConfig } from "src/main";

@Component({
    selector: "app-home",
    imports: [CommonModule, NgxTypedJsModule, CloudinaryModule, ButtonModule, FileUpload],
    templateUrl: "./home.component.html"
})
export class HomeComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  picture: CloudinaryImage = new Cloudinary({ cloud: { cloudName: cloudinaryConfig.cloudName } }).image("nicolasPaillard/profile").resize(fill().width(1000).aspectRatio("1.0"));
  user: any = null;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
  }
}
