import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/auth.service";
import { EventBusService } from "@services/event-bus.service";
import { ToastService } from "@services/toast.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  let canActivate: boolean = false;
  // prettier-ignore
  inject(AuthService).user().subscribe((user) => canActivate = user);
  if (!canActivate) {
    inject(ToastService).error("Erreur", "Vous devez d'abord vous connecter");
    inject(EventBusService).emit({ name: "signin" });
    inject(Router).navigate([]);
  }
  return canActivate;
};
