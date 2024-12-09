import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CloudinaryModule } from "@cloudinary/ng";
import { AuthService } from "@services/auth.service";
import { ConfirmService } from "@services/confirm.service";
import { Project, ProjectsService } from "@services/projects.service";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TooltipModule } from "primeng/tooltip";
import { ProjectComponent } from "./project/project.component";

declare var cloudinary: any;

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CloudinaryModule, ButtonModule, DialogModule, ReactiveFormsModule, TooltipModule, InputGroupModule, CommonModule, CalendarModule, InputTextModule, InputTextareaModule, FileUploadModule, ProjectComponent],
  templateUrl: "./projects.component.html",
})
export class ProjectsComponent {
  isAdmin: boolean = false;
  isDialogShown: boolean = false;
  user: any = null;
  activities: string[] = [];
  formProject = new FormGroup({
    start: new FormControl(new Date(), [Validators.required]),
    end: new FormControl(new Date(), [Validators.required]),
    title: new FormControl("", [Validators.required]),
    text: new FormControl("", [Validators.required]),
    company: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
    postcode: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    activities: new FormControl("", []),
    url: new FormControl("", []),
    images: new FormControl("", []),
  });
  projects: Project[] = [];
  editing: { id: string; images: string } = { id: "", images: "" };
  constructor(
    private confirmService: ConfirmService,
    private authService: AuthService,
    private projectsService: ProjectsService,
  ) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.authService.admin().subscribe((admin) => (this.isAdmin = admin));
    this.projectsService.projects().subscribe((projects) => (this.projects = projects));
  }
  openDialog = (project?: Project) => {
    if (project) {
      this.editing = { id: project.id!, images: project.images };
      this.activities = project.activities.split(";");
      let tmp = new Project(project);
      delete tmp.id;
      this.formProject.setValue(tmp);
    } else {
      this.editing = { id: "", images: "" };
      this.formProject.reset();
      this.activities = [];
    }
    this.isDialogShown = true;
  };
  addActivity = (activity: string) => {
    this.activities.push(activity);
    this.formProject.patchValue({
      activities: this.activities.join(";"),
    });
  };
  removeActivity = (activity: string) => {
    this.activities = this.activities.filter((act) => act != activity);
    this.formProject.patchValue({
      activities: this.activities.join(";"),
    });
  };
  createProject = async (images: File[]) => {
    this.projectsService.createProject(this.formProject.value as Project, images);
  };
  updateProject = async (images: File[]) => {
    let project: Project = this.formProject.value as Project;
    project.id = this.editing.id;
    project.images = this.editing.images;
    this.projectsService.updateProject(project, images);
  };
  deleteProject = async (project: Project) => {
    this.confirmService.confirm({
      message: `Voulez-vous vraiment supprimer '${project.title}' ?`,
      accept: async () => {
        this.projectsService.deleteProject(project);
      },
    });
  };
}
