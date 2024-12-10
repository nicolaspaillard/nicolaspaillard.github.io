import { inject, Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, validatePassword } from "@angular/fire/auth";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { ToastService } from "./frontend/toast.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private auth = inject(Auth);
  private _user: Subject<any> = new ReplaySubject(1);
  constructor(private toastService: ToastService) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        let roles: string[] = [];
        // prettier-ignore
        user.getIdTokenResult().then((idTokenResult) => {
          if(idTokenResult.claims["admin"]) roles.push("admin")
        }).catch((error) => console.error(error));
        user["roles"] = roles;
        this._user.next(user);
      } else {
        this._user.next(null);
      }
    });
  }
  user = (): Observable<any> => this._user.asObservable();
  signup = async (email: string, password: string) => {
    const status = await validatePassword(this.auth, password);
    if (!status.isValid) {
      this.toastService.error("Erreur", "Mot de passe invalide");
      console.error(status);
    } else {
      createUserWithEmailAndPassword(this.auth, email, password).catch((error) => console.error(error));
    }
  };
  signin = async (email: string, password: string) => {
    signInWithEmailAndPassword(this.auth, email, password).catch((error) => console.error(error));
  };
  signout = () => {
    signOut(this.auth)
      .then(() => {
        this._user.next(null);
        // this.router.navigate([""]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
