import { Component } from "@angular/core";
import { NgxTypedJsModule } from "ngx-typed-js";

@Component({
  selector: "app-accueil",
  standalone: true,
  imports: [NgxTypedJsModule],
  templateUrl: "./accueil.component.html",
})
export class AccueilComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  constructor() {}
}
