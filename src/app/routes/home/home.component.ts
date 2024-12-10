import { Component } from "@angular/core";
import { CloudinaryModule } from "@cloudinary/ng";
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { NgxTypedJsModule } from "ngx-typed-js";
import { cloudinaryConfig } from "src/main";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [NgxTypedJsModule, CloudinaryModule],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  picture: CloudinaryImage = new Cloudinary({ cloud: { cloudName: cloudinaryConfig.cloudName } }).image("nicolasPaillard/profile").resize(fill().width(1000).aspectRatio("1.0"));
  constructor() {}
}
