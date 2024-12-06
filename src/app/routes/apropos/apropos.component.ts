import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@services/auth.service";
import { ConfirmService } from "@services/confirm.service";
import { Section, SectionsService } from "@services/sections.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { PanelModule } from "primeng/panel";
import { SectionComponent } from "./section/section.component";

type bubble = {
  icon: string;
  text: string;
  href?: string;
};

@Component({
  selector: "app-apropos",
  standalone: true,
  imports: [CommonModule, PanelModule, CardModule, DialogModule, ReactiveFormsModule, ButtonModule, CommonModule, SectionComponent, InputTextModule, InputTextareaModule],
  templateUrl: "./apropos.component.html",
})
export class AproposComponent {
  bubbles: bubble[] = [
    { icon: "heroMagnifyingGlassSolid", text: "Recherche CDI" },
    { icon: "heroCakeSolid", text: new Date().getFullYear() - 1997 + " ans" },
    { icon: "bootstrapCarFrontFill", text: "Permis B" },
    { icon: "heroMapPinSolid", text: "Montpellier, France" },
    { icon: "heroAcademicCapSolid", text: "BTS Systèmes Numériques, option Informatique et Réseaux" },
    { icon: "heroEnvelopeSolid", text: "Contacter par mail", href: "" },
  ];

  isAdmin: boolean = false;
  user: any = null;
  isDialogSectionShown: boolean = false;
  idEdit: string = "";
  formSection = new FormGroup({
    title: new FormControl("", [Validators.required]),
    text: new FormControl("", [Validators.required]),
  });
  sections: Section[] = [];
  constructor(
    private authService: AuthService,
    private sectionsService: SectionsService,
    private confirmService: ConfirmService,
  ) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.authService.admin().subscribe((admin) => (this.isAdmin = admin));
    this.sectionsService.sections().subscribe((sections) => (this.sections = sections));
  }
  openDialogSection = (section?: Section) => {
    if (section) {
      this.idEdit = section.id!;
      let tmp = new Section(section);
      delete tmp.id;
      this.formSection.setValue(tmp);
    } else {
      this.idEdit = "";
      this.formSection.reset();
    }
    this.isDialogSectionShown = true;
  };
  createSection = () => {
    this.sectionsService.createSection(this.formSection.value as Section);
  };
  updateSection = () => {
    let section: Section = this.formSection.value as Section;
    section.id = this.idEdit;
    this.sectionsService.updateSection(section);
  };
  deleteSection = (section: Section) => {
    this.confirmService.confirm({
      message: `Voulez-vous vraiment supprimer '${section.title}' ?`,
      accept: async () => {
        this.sectionsService.deleteSection(section);
      },
    });
  };
}
