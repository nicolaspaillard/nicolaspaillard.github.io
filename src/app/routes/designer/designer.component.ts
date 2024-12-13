import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CareerService, Experience } from "@app/services/career.service";
import { DesignerService } from "@app/services/designer/designer.service";
import { Section, SectionsService } from "@app/services/sections.service";
import { Category, SkillsService } from "@app/services/skills.service";
import { Template } from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import { ButtonModule } from "primeng/button";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";

@Component({
  selector: "app-designer",
  imports: [ButtonModule, FileUploadModule],
  templateUrl: "./designer.component.html",
})
export class DesignerComponent implements OnInit, OnDestroy {
  experiences: Experience[] = [];
  categories: Category[] = [];
  sections: Section[] = [];
  designer: Designer;
  blank: Template = {
    basePdf: {
      width: 210,
      height: 297,
      padding: [10, 10, 10, 10],
    },
    schemas: [[]],
  };
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
  }
  ngOnInit() {
    this.loadTemplate();
  }
  ngOnDestroy() {
    this.designerService.destroy();
  }
  loadTemplate = () => this.designerService.loadTemplate("container");
  importTemplate = (event: FileUploadHandlerEvent) => this.designerService.importTemplate(event.files[0]);
  importModel = (event: FileUploadHandlerEvent) => this.designerService.importModel(event.files[0]);
  downloadPDF = () => this.designerService.downloadPDF({ editing: true, replace: false });
  downloadTemplate = () => this.designerService.downloadTemplate();
  uploadTemplate = () => this.designerService.uploadTemplate();
}
