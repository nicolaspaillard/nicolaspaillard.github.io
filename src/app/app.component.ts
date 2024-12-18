import { animate, group, query, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { CanActivateFn, NavigationEnd, NavigationStart, Router, RouterModule, RouterOutlet, Routes } from "@angular/router";
import { AboutComponent } from "@routes/about/about.component";
import { DesignerComponent } from "@routes/designer/designer.component";
import { GeneratorComponent } from "@routes/generator/generator.component";
import { HomeComponent } from "@routes/home/home.component";
import { ProjectsComponent } from "@routes/projects/projects.component";
import { SkillsComponent } from "@routes/skills/skills.component";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ToastModule } from "primeng/toast";
import { CareerComponent } from "./routes/career/career.component";
import { AuthService } from "./services/auth.service";
import { EventBusService } from "./services/frontend/event-bus.service";
import { ToastService } from "./services/frontend/toast.service";

// #region routes
export const AuthGuard: CanActivateFn = (route, state) => {
  let canActivate: boolean = false;
  // prettier-ignore
  if (route.data["role"]) inject(AuthService).user().subscribe((user) => canActivate = user);
  if (!canActivate) {
    inject(ToastService).error("Erreur", "Vous devez d'abord vous connecter");
    inject(EventBusService).emit({ name: "signin" });
    inject(Router).navigate([]);
  }
  return canActivate;
};
export const slide = trigger("routeAnimations", [transition(":increment", slideTo("right")), transition(":decrement", slideTo("left"))]);
export const routes: Routes = [
  { path: "", title: "Nicolas Paillard", component: HomeComponent, data: { animation: 0 } },
  { path: "about", title: "À propos", component: AboutComponent, data: { animation: 1 } },
  { path: "career", title: "Carrière", component: CareerComponent, data: { animation: 2 } },
  { path: "skills", title: "Compétences", component: SkillsComponent, data: { animation: 3 } },
  { path: "projects", title: "Projets", component: ProjectsComponent, data: { animation: 4 } },
  { path: "designer", title: "Designer", component: DesignerComponent, data: { animation: 5 } },
  { path: "generator", title: "Générateur", component: GeneratorComponent, data: { animation: 6 } },
  { path: "**", redirectTo: "" },
];
export class CustomValidators {
  static matchPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get("password")?.value;
      const passwordrepeat = control.get("passwordrepeat")?.value;
      if (password && passwordrepeat && password != passwordrepeat) control.get("passwordrepeat")?.setErrors({ notmatching: true });
      return null;
    };
  }
}
// #endregion

@Component({
  selector: "app-root",
  animations: [slide],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ReactiveFormsModule, ButtonModule, DialogModule, ToastModule, ConfirmDialogModule, InputTextModule, PasswordModule],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  isSignupShown: boolean = false;
  isSigninShown: boolean = false;
  isTransitioning: boolean = false;
  user: any = null;
  routes: any[] = routes.filter((route) => !["", "**"].includes(route.path!));
  formSignup = new FormGroup(
    {
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      passwordrepeat: new FormControl("", [Validators.required]),
      email: new FormControl("", { validators: [Validators.required, Validators.email] }),
    },
    {
      validators: CustomValidators.matchPassword(),
    },
  );
  formSignin = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.toastService.error("Erreur", "Vous devez d'abord vous connecter");
    this.authService.user().subscribe((user) => (this.user = user));
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isTransitioning = true;
        setTimeout(() => {
          this.isTransitioning = false;
        }, 600);
      }
      if (event instanceof NavigationEnd) {
      }
    });
  }
  ngOnInit(): void {
    this.matrix();
  }

  prepareRoute = (outlet: RouterOutlet) => outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
  interval: any;
  matrix() {
    let canvas: HTMLCanvasElement = document.querySelector("canvas")!;
    let context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    context.reset();
    let letters: string[] = "ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ".split("");
    let fontSize: number = 10;
    let drops: number[] = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (let i = 0; i < canvas.width / fontSize; i++) {
      drops[i] = canvas.height + 1;
    }
    clearInterval(this.interval);
    this.interval = setInterval(() => interval(drops), 33);
    function interval(drp: number[]) {
      context.fillStyle = "rgba(0, 0, 0, .03)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drp.length; i++) {
        let text = letters[Math.floor(Math.random() * letters.length)];
        context.fillStyle = "#00ff00";
        context.fillText(text, i * fontSize, drp[i] * fontSize);
        drp[i]++;
        if (drp[i] * fontSize > canvas.height && Math.random() > 0.99) {
          drp[i] = 0;
        }
      }
    }
  }
  signup = () => {
    this.authService.signup(this.formSignup.value.email!, this.formSignup.value.password!);
    this.isSignupShown = false;
  };
  signin = () => {
    this.authService.signin(this.formSignin.value.email!, this.formSignin.value.password!);
    this.isSigninShown = false;
  };
  signout = () => {
    this.authService.signout();
  };
}
function slideTo(direction: any) {
  const optional = { optional: true };
  return [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: "0",
          width: "100%",
          height: "100%",
          [direction]: 0,
        }),
      ],
      optional,
    ),
    query(":enter", [style({ [direction]: "-100%" })]),
    group([query(":leave", [animate("600ms ease", style({ [direction]: "100%" }))], optional), query(":enter", [animate("600ms ease", style({ [direction]: "0%" }))])]),
  ];
}
