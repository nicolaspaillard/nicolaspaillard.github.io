import { Component, OnDestroy, OnInit } from "@angular/core";
import { CareerService, Experience } from "@app/services/career.service";
import { ToastService } from "@app/services/frontend/toast.service";
import { Section, SectionsService } from "@app/services/sections.service";
import { Category, SkillsService } from "@app/services/skills.service";
import { TemplatesService } from "@app/services/templates.service";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cloneDeep, Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { date, dateTime, ellipse, image, line, multiVariableText, rectangle, svg, table, text, time } from "@pdfme/schemas";
import { Designer } from "@pdfme/ui";
import { ButtonModule } from "primeng/button";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
import { cloudinaryConfig } from "src/main";

const blank: Template = {
  basePdf: {
    width: 210,
    height: 297,
    padding: [10, 10, 10, 10],
  },
  schemas: [[]],
};
const plugins = {
  Text: text,
  // Link: link,
  "Multi-Variable Text": multiVariableText,
  Table: table,
  Line: line,
  Rectangle: rectangle,
  Ellipse: ellipse,
  Image: image,
  SVG: svg,
  DateTime: dateTime,
  Date: date,
  Time: time,
};
const font = {
  Roboto_bold: {
    data: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlfCxc4EsA.woff2",
  },
};
@Component({
  selector: "app-designer",
  imports: [ButtonModule, FileUploadModule],
  templateUrl: "./designer.component.html",
})
export class DesignerComponent implements OnInit, OnDestroy {
  designer: Designer;
  experiences: Experience[] = [];
  categories: Category[] = [];
  sections: Section[] = [];
  constructor(
    private templatesService: TemplatesService,
    private toastService: ToastService,
    private careerService: CareerService,
    private skillsService: SkillsService,
    private sectionsService: SectionsService,
  ) {
    this.careerService.experiences().subscribe((experiences) => (this.experiences = experiences));
    this.skillsService.categories().subscribe((categories) => (this.categories = categories));
    this.sectionsService.sections().subscribe((sections) => (this.sections = sections));
  }
  ngOnInit() {
    this.templatesService.template().subscribe((template) => (this.designer = new Designer({ domContainer: document.getElementById("container")!, template: template ? template : blank, plugins: plugins })));
  }
  ngOnDestroy = () => this.designer.destroy();
  downloadPDF = async () => generate({ template: this.designer.getTemplate(), inputs: [await this.getInputs()], plugins: plugins }).then((pdf) => window.open(URL.createObjectURL(new Blob([pdf.buffer], { type: "application/pdf" }))));
  clearTemplate = () => this.designer.updateTemplate(blank);
  downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(this.designer.getTemplate())], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `template.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  logTemplate = () => console.log(this.designer.getTemplate());
  uploadTemplate = () => {
    let template = this.designer.getTemplate();
    template.basePdf = blank.basePdf;
    this.templatesService.uploadTemplate(template).then(() => this.toastService.success("Succès", "Sauvegarde effectuée"));
  };
  loadTemplate = (event: FileUploadHandlerEvent) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.files[0]);
    fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
      const template: Template = JSON.parse(readerEvent.target!.result!.toString());
      this.designer.updateTemplate(template);
    };
  };
  loadModel = (event: FileUploadHandlerEvent) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.files[0]);
    fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
      this.designer.updateTemplate(
        Object.assign(cloneDeep(this.designer.getTemplate()), {
          basePdf: readerEvent.target!.result!,
        }),
      );
    };
  };
  getInputs = async () => {
    let imageB64: string = await fetch(new Cloudinary({ cloud: { cloudName: cloudinaryConfig.cloudName } }).image("nicolasPaillard/profile").resize(fill().width(500).aspectRatio("1.0")).toURL())
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }),
      );
    return {
      title: "Nicolas Paillard",
      subtitle: "Développeur Full-Stack",
      picture: imageB64,
      intro: [[this.sections.length ? this.sections[0].text : "test"]],
      contacts: JSON.stringify([["test"], ["test"], ["test"], ["test"], ["test"]]),
      skills: JSON.stringify(this.categories.map((category) => ["\t- " + category.title + " : " + category.skills.map((skill) => skill.title).join(", ")])),
    };
  };
}
