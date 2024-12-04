import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AuthService } from "@services/auth.service";
import { Section } from "@services/sections.service";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-section",
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: "./section.component.html",
  styles: ``,
})
export class SectionComponent {
  @Input() section: Section;
  @Output() onSectionRemoved = new EventEmitter<Section>();
  @Output() onSectionEdit = new EventEmitter<Section>();
  user: any = null;
  isAdmin: boolean = false;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.authService.admin().subscribe((admin) => (this.isAdmin = admin));
  }
}
