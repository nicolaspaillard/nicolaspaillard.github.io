import { Component } from "@angular/core";
import { NgxTypedJsModule } from "ngx-typed-js";
import { PlaceholderComponent } from "../../shared/components/placeholder/placeholder.component";

@Component({
  selector: "app-accueil",
  standalone: true,
  imports: [NgxTypedJsModule, PlaceholderComponent],
  templateUrl: "./accueil.component.html",
})
export class AccueilComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  constructor() {}
}
