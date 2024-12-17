import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { Animation, AnimationService } from "@app/shared/services/animation.service";
import { SafeHtmlPipe } from "@helpers/safehtml.pipe";
import { Subscription } from "rxjs";

@Component({
  selector: "app-animation",
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: "./animation.component.html",
})
export class AnimationComponent implements OnDestroy {
  @Input() containerId = "animation-main";
  text: string[] = [];
  isAnimationShown: boolean = false;
  animationSubscription: Subscription;
  constructor(private animationService: AnimationService) {
    this.animationSubscription = this.animationService.animations(this.containerId).subscribe((animation: Animation) => this.animate(animation));
  }
  ngOnDestroy(): void {
    this.animationSubscription.unsubscribe();
  }
  interval: NodeJS.Timeout;
  animate = (animation: Animation) => {
    this.isAnimationShown = true;
    this.text = [];
    let section = 0,
      line = 0;
    this.interval = setInterval(() => {
      if (section >= animation.sections.length) {
        clearInterval(this.interval);
        animation.callback();
        this.isAnimationShown = false;
        return;
      } else if (line == animation.sections[section].length) {
        section++;
        line = 0;
      } else {
        this.text.push(animation.sections[section][line]);
        document.getElementById(this.containerId)!.scrollTop = 99999999;
        line++;
      }
    }, 100);
  };
  skip = () => {};
}
