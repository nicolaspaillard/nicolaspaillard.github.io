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
import { Designer } from "@pdfme/ui";
import { ButtonModule } from "primeng/button";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
import { cloudinaryConfig } from "src/main";
import { date, dateTime, ellipse, image, line, link, multiVariableText, rectangle, svg, table, text, time } from "./schemas";

const plugins = {
  Text: text,
  Link: link,
  Paragraph: multiVariableText,
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
  blank: Template = {
    basePdf: {
      width: 210,
      height: 297,
      padding: [10, 10, 10, 10],
    },
    schemas: [[]],
  };
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
    this.loadTemplate();
  }
  ngOnDestroy() {
    this.designer.destroy();
  }
  loadTemplate = () => this.templatesService.template().subscribe((template) => (this.designer = new Designer({ domContainer: document.getElementById("container")!, template: template ? template : this.blank, plugins: plugins })));
  importTemplate = (event: FileUploadHandlerEvent) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.files[0]);
    fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
      const template: Template = JSON.parse(readerEvent.target!.result!.toString());
      this.designer.updateTemplate(template);
    };
  };
  importModel = (event: FileUploadHandlerEvent) => {
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
  downloadPDF = async () => generate({ template: this.designer.getTemplate(), inputs: [await this.getInputs()], plugins: plugins }).then((pdf) => window.open(URL.createObjectURL(new Blob([pdf.buffer], { type: "application/pdf" }))));
  downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(this.designer.getTemplate())], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `template.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  uploadTemplate = () => {
    let template = this.designer.getTemplate();
    template.basePdf = this.blank.basePdf;
    this.templatesService.uploadTemplate(template).then(() => this.toastService.success("Succès", "Sauvegarde effectuée"));
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
      experiences: JSON.stringify(
        this.experiences
          .filter((experience) => experience.end && experience.start.getTime() != experience.end.getTime())
          .map((experience, index) => [`${formatDate(experience.start)} - ${formatDate(experience.end)} : ${experience.title}` + (experience.text.length ? `\n\t${experience.text}` : "") + (index < this.experiences.filter((experience) => experience.end && experience.start.getTime() != experience.end.getTime()).length - 1 ? "\n" : "")]),
      ),
      address: "Montpellier",
      phone: "07 81 48 00 36",
      email: JSON.stringify([["paillard.nicolas.pro@gmail.com", "mailto:paillard.nicolas.pro@gmail.com"]]),
      site: JSON.stringify([["nicolaspaillard.github.io", "https://nicolaspaillard.github.io"]]),
      github: JSON.stringify([["github.com/nicolaspaillard", "https://github.com/nicolaspaillard"]]),
      gitlab: JSON.stringify([["gitlab.com/nicolaspaillard", "https://gitlab.com/nicolaspaillard"]]),
      linkedin: JSON.stringify([["nicolaspaillard.github.io", "https://nicolaspaillard.github.io"]]),
    };
  };
}
const formatDate = (date: Date) => date.toLocaleDateString("fr-FR", { month: "numeric", year: "numeric" });
