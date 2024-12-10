import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AuthService } from "@app/services/auth.service";
import { Project } from "@app/services/projects.service";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { cloudinaryConfig } from "src/main";

@Component({
  selector: "app-project",
  standalone: true,
  imports: [CommonModule, ButtonModule, CarouselModule],
  templateUrl: "./project.component.html",
  styles: ``,
})
export class ProjectComponent {
  @Input() project: Project;
  @Output() onProjectRemoved = new EventEmitter<Project>();
  @Output() onProjectEdit = new EventEmitter<Project>();
  cld: Cloudinary = new Cloudinary({
    cloud: {
      cloudName: cloudinaryConfig.cloudName,
    },
  });
  user: any = null;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
  }
  // prettier-ignore
  getURL = (image: string) => this.cld.image("nicolasPaillard/" + image).resize(fill().width(500).aspectRatio("1.0")).toURL();
}
