import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "app-placeholder",
    imports: [CommonModule],
    templateUrl: "./placeholder.component.html",
    styles: ``
})
export class PlaceholderComponent {
  @Input() width: number;
  @Input() height: number;
  @Input() color: string;
}
