import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@app/services/auth.service";
import { Skill } from "@app/services/skills.service";
import { ButtonModule } from "primeng/button";
import { SkillComponent } from "./skill/skill.component";

@Component({
  selector: "app-category",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkillComponent, ButtonModule],
  templateUrl: "./category.component.html",
  styles: ``,
})
export class CategoryComponent {
  @Input() title: string;
  @Input() skills: Skill[];
  @Output() onCategoryRemoved = new EventEmitter<string>();
  @Output() onCategoryEdit = new EventEmitter<string>();
  @Output() onSkillRemoved = new EventEmitter<Skill>();
  @Output() onSkillEdit = new EventEmitter<Skill>();
  user: any = null;
  constructor(private authService: AuthService) {
    this.authService.user().subscribe((user) => (this.user = user));
  }
}
