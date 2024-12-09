import { Component } from "@angular/core";
import { NgxTypedJsModule } from "ngx-typed-js";
import { PlaceholderComponent } from "../../shared/components/placeholder/placeholder.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [NgxTypedJsModule, PlaceholderComponent],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  strings: string[] = ["Web", "Backend", "Frontend", "FullStack", "SQL", "TypeScript", ".NET", "Angular", "Java", "Python"];
  constructor() {}
}
