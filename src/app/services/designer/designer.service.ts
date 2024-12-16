import { Injectable } from "@angular/core";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { CareerService, Experience } from "@app/services/career.service";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cloneDeep, Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { Designer } from "@pdfme/ui";
import { cloudinaryConfig } from "src/main";
import { ToastService } from "../frontend/toast.service";
import { Section, SectionsService } from "../sections.service";
import { Category, SkillsService } from "../skills.service";
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

@Injectable({
  providedIn: "root",
})
export class DesignerService {
  designer: Designer;
  blank: Template = {
    basePdf: {
      width: 210,
      height: 297,
      padding: [10, 10, 10, 10],
    },
    schemas: [[]],
  };

  experiences: Experience[] = [];
  categories: Category[] = [];
  sections: Section[] = [];
  constructor(
    private toastService: ToastService,
    private careerService: CareerService,
    private skillsService: SkillsService,
    private sectionsService: SectionsService,
    private db: Firestore,
  ) {
    this.careerService.experiences().subscribe((experiences) => (this.experiences = experiences));
    this.skillsService.categories().subscribe((categories) => (this.categories = categories));
    this.sectionsService.sections().subscribe((sections) => (this.sections = sections));
  }
  destroy = () => this.designer.destroy();
  getTemplate = async () => await getDoc(doc(this.db, "data", "template")).then((document) => (document.exists() ? JSON.parse(document.data()!["template"]) : this.blank) as Template);
  timer: NodeJS.Timeout;
  loadTemplate = async (containerId: string) => {
    this.designer = new Designer({ domContainer: document.getElementById(containerId)!, template: await this.getTemplate(), plugins: plugins });
    this.designer.onChangeTemplate(() => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.uploadTemplate(), 3000);
    });
  };
  importTemplate = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => this.designer.updateTemplate(JSON.parse(readerEvent.target!.result!.toString()));
  };
  importModel = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => this.designer.updateTemplate(Object.assign(cloneDeep(this.designer.getTemplate()), { basePdf: readerEvent.target!.result! }));
  };
  downloadPDF = async ({ editing, replace }: { editing: boolean; replace: boolean }) => generate({ template: editing ? this.designer.getTemplate() : await this.getTemplate(), inputs: await this.getInputs(), plugins: plugins }).then((pdf) => window.open(URL.createObjectURL(new Blob([pdf.buffer], { type: "application/pdf" })), replace ? "_self" : "_blank"));
  downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(this.designer.getTemplate())], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `template.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  uploadTemplate = async () => {
    let template = this.designer.getTemplate();
    template.basePdf = this.blank.basePdf;
    try {
      await setDoc(doc(this.db, "data", "template"), { template: JSON.stringify(template) });
      this.toastService.success("Succès", "Sauvegarde effectuée");
    } catch (error) {
      this.toastService.error("Erreur", "Sauvegarde échouée");
      console.error(error);
    }
  };
  private getInputs = async () => {
    const imageB64: string = await fetch(new Cloudinary({ cloud: { cloudName: cloudinaryConfig.cloudName } }).image("nicolasPaillard/profile").resize(fill().width(500).aspectRatio("1.0")).toURL())
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }),
      );
    const formatExperiences = (experiences: Experience[]) =>
      experiences.map((experience, index) => [
        `${experience.start.toLocaleDateString("fr-FR", { month: "numeric", year: "numeric" })} - ${experience.end.toLocaleDateString("fr-FR", { month: "numeric", year: "numeric" })} : ${experience.title}` +
          (experience.text.length ? `\n\t${experience.text}` : "") +
          (experience.activities ? `\n${"\t- " + experience.activities.split(";").join("\n\t- ")}` : "") +
          (index < experiences.length - 1 ? "\n" : ""),
      ]);

    return [
      {
        title: "Nicolas Paillard",
        subtitle: "Développeur Full-Stack",
        picture: imageB64,
        intro: [[this.sections.length ? this.sections[0].text : "test"]],
        contacts: JSON.stringify([["test"], ["test"], ["test"], ["test"], ["test"]]),
        skills: JSON.stringify(this.categories.map((category) => ["\t- " + category.title + " : " + category.skills.map((skill) => skill.title).join(", ")])),
        experiences: JSON.stringify(formatExperiences(this.experiences.filter((experience) => experience.end && experience.start.getTime() != experience.end.getTime()))),
        address: "Montpellier",
        phone: JSON.stringify([["07 81 48 00 36", "tel:0781480036"]]),
        email: JSON.stringify([["paillard.nicolas.pro@gmail.com", "mailto:paillard.nicolas.pro@gmail.com"]]),
        site: JSON.stringify([["nicolaspaillard.github.io", "https://nicolaspaillard.github.io"]]),
        github: JSON.stringify([["github.com/nicolaspaillard", "https://github.com/nicolaspaillard"]]),
        gitlab: JSON.stringify([["gitlab.com/nicolaspaillard", "https://gitlab.com/nicolaspaillard"]]),
        linkedin: JSON.stringify([["nicolaspaillard.github.io", "https://nicolaspaillard.github.io"]]),
      },
    ];
  };
}
