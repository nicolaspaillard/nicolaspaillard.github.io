import { Component, OnDestroy, OnInit } from "@angular/core";
import { CareerService } from "@app/services/career.service";
import { ToastService } from "@app/services/frontend/toast.service";
import { SectionsService } from "@app/services/sections.service";
import { SkillsService } from "@app/services/skills.service";
import { TemplatesService } from "@app/services/templates.service";
import { cloneDeep, Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { date, dateTime, ellipse, image, line, multiVariableText, rectangle, svg, table, text, time } from "@pdfme/schemas";
import { Designer } from "@pdfme/ui";
import { Button } from "primeng/button";
import { FileUpload, FileUploadHandlerEvent } from "primeng/fileupload";

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

@Component({
  selector: "app-designer",
  standalone: true,
  imports: [Button, FileUpload],
  templateUrl: "./designer.component.html",
  styles: ``,
})
export class DesignerComponent implements OnInit, OnDestroy {
  designer: Designer;
  constructor(
    private templatesService: TemplatesService,
    private toastService: ToastService,
    private careerService: CareerService,
    private skillsService: SkillsService,
    private sectionsService: SectionsService,
  ) {}
  ngOnInit() {
    this.templatesService.template().subscribe(
      (template) =>
        (this.designer = new Designer({
          domContainer: document.getElementById("container")!,
          template: template ? template : blank,
          plugins: plugins,
        })),
    );
  }
  ngOnDestroy = () => this.designer.destroy();
  downloadPDF = () => {
    generate({ template: this.designer.getTemplate(), inputs: [{}], plugins: plugins }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    });
  };
  clearTemplate = () => {
    console.log(blank);
    this.designer.updateTemplate(blank);
  };
  downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(this.designer.getTemplate())], { type: "application/json" });
    const url = URL.createObjectURL(blob);
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
  auto = () => {
    this.careerService.experiences().subscribe((experiences) => {
      this.skillsService.categories().subscribe((categories) => {
        this.sectionsService.sections().subscribe((sections) => {
          let template: Template = {
            basePdf: {
              width: 210,
              height: 297,
              padding: [10, 10, 10, 10],
            },
            schemas: [
              [
                {
                  name: "title",
                  type: "text",
                  position: { x: 10, y: 10 },
                  width: 190,
                  height: 10,
                },
              ],
            ],
          };
          let inputs = [{ title: "Nicolas Paillard" }];
          let i = 2;
          // for (let section of sections) {
          //   template.schemas[0].push({
          //     name: i.toString(),
          //     type: "text",
          //     position: { x: 10, y: i * 10 },
          //     width: 10,
          //     height: 10,
          //   });
          //   inputs[0][i.toString()] = section.title;
          //   i++;
          // }
          // for (let category of categories) {
          //   template.schemas[0].push({
          //     name: i.toString(),
          //     type: "text",
          //     position: { x: 10, y: i * 10 },
          //     width: 10,
          //     height: 10,
          //   });
          //   inputs[0][i.toString()] = category.title;
          //   i++;
          // }
          for (let experience of experiences) {
            template.schemas[0].push({
              name: i.toString(),
              type: "text",
              position: { x: 10, y: i * 10 },
              width: 190,
              height: 10,
            });
            inputs[0][i.toString()] = experience.title;
            i++;
          }
          this.designer.updateTemplate(template);
          generate({ template: template, inputs: inputs, plugins: plugins }).then((pdf) => {
            const blob = new Blob([pdf.buffer], { type: "application/pdf" });
            window.open(URL.createObjectURL(blob));
          });
        });
      });
    });
  };
}
