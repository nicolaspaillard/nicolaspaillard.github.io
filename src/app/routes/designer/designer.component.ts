import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CareerService, Experience } from "@app/services/career.service";
import { DesignerService } from "@app/services/designer/designer.service";
import { Section, SectionsService } from "@app/services/sections.service";
import { Category, SkillsService } from "@app/services/skills.service";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
import { SplitButton } from "primeng/splitbutton";

@Component({
  selector: "app-designer",
  imports: [ButtonModule, FileUploadModule, SplitButton],
  templateUrl: "./designer.component.html",
})
export class DesignerComponent implements OnInit, OnDestroy {
  experiences: Experience[] = [];
  categories: Category[] = [];
  sections: Section[] = [];
  menuItems: MenuItem[] = [];
  constructor(
    private careerService: CareerService,
    private skillsService: SkillsService,
    private sectionsService: SectionsService,
    private designerService: DesignerService,
    private router: Router,
  ) {
    this.careerService.experiences().subscribe((experiences) => (this.experiences = experiences));
    this.skillsService.categories().subscribe((categories) => (this.categories = categories));
    this.sectionsService.sections().subscribe((sections) => (this.sections = sections));
    if (this.router.url === "/cv") this.designerService.downloadPDF({ editing: false, replace: true });
    this.menuItems = [
      {
        label: "Réinitialiser",
        icon: "pi pi-trash",
        command: () => this.resetTemplate(),
      },
      {
        label: "Recharger",
        icon: "pi pi-refresh",
        command: () => this.loadTemplate(),
      },
      {
        label: "Importer modèle",
        icon: "pi pi-upload",
        command: () => (document.querySelector("#upload-model button")! as HTMLElement).click(),
      },
      {
        label: "Importer template",
        icon: "pi pi-upload",
        command: () => (document.querySelector("#upload-template button")! as HTMLElement).click(),
      },
      {
        label: "Télécharger",
        icon: "pi pi-download",
        command: () => this.downloadTemplate(),
      },
      {
        label: "Générer",
        icon: "pi pi-file-pdf",
        command: () => this.downloadPDF(),
      },
    ];
  }
  ngOnInit() {
    this.loadTemplate();
  }
  ngOnDestroy() {
    this.designerService.destroy();
  }
  resetTemplate = () => this.designerService.resetTemplate();
  loadTemplate = () => this.designerService.init("container");
  importTemplate = (event: FileUploadHandlerEvent) => this.designerService.importTemplate(event.files[0]);
  importModel = (event: FileUploadHandlerEvent) => this.designerService.importModel(event.files[0]);
  downloadPDF = () => this.designerService.downloadPDF({ editing: true, replace: false });
  downloadTemplate = () => this.designerService.downloadTemplate();
  uploadTemplate = () => this.designerService.uploadTemplate();
}
