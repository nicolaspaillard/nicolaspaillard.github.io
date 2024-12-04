import { Injectable } from "@angular/core";
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, setDoc } from "@angular/fire/firestore";
import { ReplaySubject, Subject } from "rxjs";

export class Section {
  id?: string;
  title: string;
  text: string;
  constructor(section: Section) {
    Object.assign(this, section);
  }
}

@Injectable({
  providedIn: "root",
})
export class SectionsService {
  private __sections: Section[] = [];
  private _sections: Subject<Section[]> = new ReplaySubject(1);
  constructor(private db: Firestore) {
    try {
      getDocs(query(collection(this.db, "data", "sections", "sections"))).then((sections) => {
        sections.docs.forEach((doc) => {
          let section: Section = new Section(doc.data() as any);
          section.id = doc.id;
          this.__sections.push(section);
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      this._sections.next(this.__sections);
    }
  }
  sections = () => this._sections.asObservable();
  createSection = async (section: Section) => {
    try {
      section.id = (await addDoc(collection(this.db, "data", "sections", "sections"), section)).id;
      this.__sections.push(section);
      this._sections.next(this.__sections);
    } catch (error) {
      console.error(error);
    }
  };
  updateSection = async (section: Section) => {
    try {
      let newSection = new Section(section);
      delete newSection.id;
      await setDoc(doc(this.db, "data", "sections", "sections", section.id!), Object.assign({}, newSection));
      this.__sections[this.__sections.findIndex((tmp) => tmp.id === section.id)] = section;
      this._sections.next(this.__sections);
    } catch (error) {
      console.error(error);
    }
  };
  deleteSection = async (section: Section) => {
    try {
      await deleteDoc(doc(this.db, "data", "sections", "sections", section.id!));
      // prettier-ignore
      this.__sections.splice(this.__sections.findIndex((tmp) => tmp.id === section.id),1);
      this._sections.next(this.__sections);
    } catch (error) {
      console.error(error);
    }
  };
}
