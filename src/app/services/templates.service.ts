import { Injectable } from "@angular/core";
import { Firestore, doc, getDoc, setDoc } from "@angular/fire/firestore";
import { Template } from "@pdfme/common";
import { ReplaySubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TemplatesService {
  private _template: Subject<Template | undefined> = new ReplaySubject(1);
  template = () => this._template.asObservable();
  constructor(private db: Firestore) {
    getDoc(doc(this.db, "data", "template")).then((document) => {
      this._template.next(document.exists() ? JSON.parse(document.data()!["template"] as any) : undefined);
    });
  }
  uploadTemplate = async (template: any) => {
    try {
      await setDoc(doc(this.db, "data", "template"), { template: JSON.stringify(template) });
      this._template.next(template);
    } catch (error) {
      console.error(error);
    }
  };
}
