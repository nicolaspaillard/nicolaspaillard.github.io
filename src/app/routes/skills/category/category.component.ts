import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@services/auth.service";
import { Skill } from "@services/skills.service";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SkillComponent } from "./skill/skill.component";

@Component({
    selector: "app-category",
    imports: [SkillComponent, CommonModule, ButtonModule, DialogModule, ReactiveFormsModule],
    templateUrl: "./category.component.html",
    styles: ``
})
export class CategoryComponent {
  @Input() title: string;
  @Input() skills: Skill[];
  @Output() onCategoryRemoved = new EventEmitter<string>();
  @Output() onCategoryEdit = new EventEmitter<string>();
  @Output() onSkillRemoved = new EventEmitter<Skill>();
  @Output() onSkillEdit = new EventEmitter<Skill>();
  user: any = null;
  isAdmin: boolean = false;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.authService.admin().subscribe((admin) => (this.isAdmin = admin));
  }
}
