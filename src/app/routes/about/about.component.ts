import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@app/shared/services/auth.service";
import { ConfirmService } from "@app/shared/services/frontend/confirm.service";
import { Section, SectionsService } from "@app/shared/services/sections.service";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { SectionComponent } from "./section/section.component";

type bubble = {
  icon: string;
  text: string;
  href?: string;
};

@Component({
  selector: "app-about",
  imports: [CommonModule, SectionComponent, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, TextareaModule, InputNumberModule],
  templateUrl: "./about.component.html",
})
export class AboutComponent {
  bubbles: bubble[] = [
    { icon: "heroMagnifyingGlassSolid", text: "Recherche CDI" },
    { icon: "heroCakeSolid", text: new Date().getFullYear() - 1997 + " ans" },
    { icon: "bootstrapCarFrontFill", text: "Permis B" },
    { icon: "heroMapPinSolid", text: "Montpellier, France" },
    { icon: "heroAcademicCapSolid", text: "BTS Systèmes Numériques, option Informatique et Réseaux" },
    { icon: "heroEnvelopeSolid", text: "Contacter par mail", href: "" },
  ];
  user: any = null;
  isDialogSectionShown: boolean = false;
  idEdit: string = "";
  formSection = new FormGroup({
    rank: new FormControl(0, [Validators.required]),
    text: new FormControl("", [Validators.required]),
  });
  sections: Section[] = [];
  constructor(
    private authService: AuthService,
    private sectionsService: SectionsService,
    private confirmService: ConfirmService,
  ) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.sectionsService.sections().subscribe((sections) => (this.sections = sections));
  }
  openDialog = (section?: Section) => {
    if (section) {
      this.idEdit = section.id!;
      let tmp = new Section(section);
      delete tmp.id;
      this.formSection.setValue(tmp);
    } else {
      this.idEdit = "";
      this.formSection.setValue({ rank: this.sections[this.sections.length - 1].rank + 1, text: "" });
    }
    this.isDialogSectionShown = true;
  };
  createSection = () => this.sectionsService.createSection(this.formSection.value as Section).then(() => (this.isDialogSectionShown = false));
  updateSection = () => {
    let section: Section = this.formSection.value as Section;
    section.id = this.idEdit;
    this.sectionsService.updateSection(section).then(() => (this.isDialogSectionShown = false));
  };
  deleteSection = (section: Section) => {
    this.confirmService.confirm({
      message: `Voulez-vous vraiment supprimer '${section.text}' ?`,
      accept: async () => {
        this.sectionsService.deleteSection(section);
      },
    });
  };
}
