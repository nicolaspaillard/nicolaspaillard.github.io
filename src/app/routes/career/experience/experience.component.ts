import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AuthService } from "@services/auth.service";
import { Experience } from "@services/experiences.service";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: "./experience.component.html",
})
export class ExperienceComponent {
  @Input() experience: Experience;
  @Input() right: boolean;
  @Output() onExperienceRemoved = new EventEmitter<Experience>();
  @Output() onExperienceEdit = new EventEmitter<Experience>();
  user: any = null;
  isAdmin: boolean = false;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.authService.admin().subscribe((admin) => (this.isAdmin = admin));
  }
}
