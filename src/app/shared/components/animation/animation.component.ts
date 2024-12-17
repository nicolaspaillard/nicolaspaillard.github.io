import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Animation, AnimationService } from "@app/shared/services/animation.service";
import { SafeHtmlPipe } from "@helpers/safehtml.pipe";
import { ButtonModule } from "primeng/button";
import { Subscription } from "rxjs";

@Component({
  selector: "app-animation",
  imports: [CommonModule, SafeHtmlPipe, ButtonModule],
  templateUrl: "./animation.component.html",
})
export class AnimationComponent implements OnDestroy {
  @Input() containerId = "animation-main";
  text: string[] = [];
  isAnimationShown: boolean = false;
  animationSubscription: Subscription;
  interval: NodeJS.Timeout;
  callback: Function;
  constructor(
    private animationService: AnimationService,
    private router: Router,
  ) {
    this.animationSubscription = this.animationService.animations(this.containerId).subscribe((animation: Animation) => this.animate(animation));
  }
  ngOnDestroy = () => this.animationSubscription.unsubscribe();
  animate = (animation: Animation) => {
    this.callback = animation.callback;
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
      } else if (line == animation.sections[section].lines.length) {
        section++;
        line = 0;
      } else {
        if (animation.sections[section].route && line === 0 && this.router.url != "/designer") this.router.navigate([animation.sections[section].route]);
        if (line === 0 && section > 0) this.text.push("<br>");
        this.text.push(animation.sections[section].lines[line]);
        document.getElementById(this.containerId)!.scrollTop = 99999999;
        line++;
      }
    }, 200);
  };
  skip = () => {
    this.callback();
    clearInterval(this.interval);
    this.isAnimationShown = false;
  };
}
