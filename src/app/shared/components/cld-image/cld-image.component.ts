import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { CloudinaryModule, lazyload, placeholder, responsive } from "@cloudinary/ng";
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { cloudinaryConfig } from "src/main";

@Component({
  selector: "app-cld-image",
  imports: [CloudinaryModule],
  templateUrl: "./cld-image.component.html",
})
export class CldImageComponent implements OnInit, OnDestroy {
  @Input() name: string = "";
  @Input() maxWidth?: string;
  picture: CloudinaryImage;
  plugins = [lazyload(), responsive(), placeholder()];
  preload: HTMLLinkElement;
  constructor() {}
  ngOnInit() {
    this.picture = new Cloudinary({ cloud: { cloudName: cloudinaryConfig.cloudName } })
      .image(this.name)
      .resize(scale(this.maxWidth || 500))
      .delivery(quality("auto"))
      .delivery(format("auto"));
    this.preload = document.createElement("link");
    this.preload.rel = "preload";
    this.preload.as = "image";
    this.preload.href = this.picture.toURL();
    document.head.appendChild(this.preload);
  }
  ngOnDestroy() {
    document.head.removeChild(this.preload);
  }
}
