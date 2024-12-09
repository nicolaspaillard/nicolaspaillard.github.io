import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@services/auth.service";
import { ConfirmService } from "@services/confirm.service";
import { Experience, ExperiencesService } from "@services/experiences.service";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TooltipModule } from "primeng/tooltip";
import { ExperienceComponent } from "./experience/experience.component";

@Component({
  selector: "app-career",
  standalone: true,
  imports: [ExperienceComponent, CommonModule, DialogModule, ReactiveFormsModule, CalendarModule, InputTextareaModule, InputTextModule, ButtonModule, InputGroupModule, TooltipModule],
  templateUrl: "./career.component.html",
})
export class CareerComponent {
  isAdmin: boolean = false;
  isDialogShown: boolean = false;
  user: any = null;
  activities: string[] = [];
  idEdit: string = "";
  formExperience = new FormGroup({
    start: new FormControl(new Date(), [Validators.required]),
    end: new FormControl(new Date(), []),
    title: new FormControl("", [Validators.required]),
    text: new FormControl("", []),
    company: new FormControl("", []),
    address: new FormControl("", []),
    postcode: new FormControl("", []),
    city: new FormControl("", []),
    activities: new FormControl("", []),
  });
  experiences: Experience[] = [];
  constructor(
    private authService: AuthService,
    private confirmService: ConfirmService,
    private experiencesService: ExperiencesService,
  ) {
    this.authService.user().subscribe((user) => (this.user = user));
    this.authService.admin().subscribe((admin) => (this.isAdmin = admin));
    this.experiencesService.experiences().subscribe((experiences) => (this.experiences = experiences));
  }
  openDialog = (experience?: Experience) => {
    if (experience) {
      this.idEdit = experience.id!;
      if (experience.activities && experience.activities.length) this.activities = experience.activities.split(";");
      let tmp = new Experience(experience);
      delete tmp.id;
      this.formExperience.setValue(tmp);
    } else {
      this.idEdit = "";
      this.formExperience.reset();
      this.activities = [];
    }
    this.isDialogShown = true;
  };
  addActivity = (activity: string) => {
    this.activities.push(activity);
    this.formExperience.patchValue({
      activities: this.activities.join(";"),
    });
  };
  removeActivity = (activity: string) => {
    this.activities = this.activities.filter((act) => act != activity);
    this.formExperience.patchValue({
      activities: this.activities.join(";"),
    });
  };
  createExperience = () => {
    this.experiencesService.createExperience(this.formExperience.value as Experience);
  };
  updateExperience = () => {
    let experience: Experience = this.formExperience.value as Experience;
    experience.id = this.idEdit;
    this.experiencesService.updateExperience(experience);
  };
  deleteExperience = (experience: Experience) => {
    this.confirmService.confirm({
      message: `Voulez-vous vraiment supprimer '${experience.title}' ?`,
      accept: async () => {
        this.experiencesService.deleteExperience(experience);
      },
    });
  };
}
