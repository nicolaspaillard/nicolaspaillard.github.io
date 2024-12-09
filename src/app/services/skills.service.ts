import { Injectable } from "@angular/core";
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, setDoc, where } from "@angular/fire/firestore";
import { ReplaySubject, Subject } from "rxjs";

export class Skill {
  id?: string;
  category: string;
  icon: string;
  title: string;
  constructor(skill: Skill) {
    Object.assign(this, skill);
  }
}

export class Category {
  title: string;
  skills: Skill[];
  constructor(category: Category) {
    Object.assign(this, category);
  }
}

@Injectable({
  providedIn: "root",
})
export class SkillsService {
  private skills: Skill[] = [];
  private __categories: Category[] = [];
  private _categories: Subject<Category[]> = new ReplaySubject(1);
  constructor(private db: Firestore) {
    try {
      getDocs(query(collection(this.db, "data", "skills", "skills"))).then((skills) => {
        skills.docs.forEach((document) => {
          let skill: Skill = new Skill(document.data() as any);
          skill.id = document.id;
          this.skills.push(skill);
        });
        this.formatSkills();
      });
    } catch (error) {
      console.error(error);
    }
  }
  categories = () => this._categories.asObservable();
  private formatSkills = () => {
    this.__categories = [];
    for (let skill of this.skills) {
      const categoryId = this.__categories.findIndex((tmp) => tmp.title === skill.category);
      if (categoryId === -1) this.__categories.push(new Category({ title: skill.category, skills: [skill] }));
      else {
        this.__categories[categoryId].skills.push(skill);
        this.__categories[categoryId].skills = this.__categories[categoryId].skills.sort((skill1, skill2) => (skill1.title === skill2.title ? 0 : skill1.title < skill2.title ? -1 : 1));
      }
    }
    this.__categories = this.__categories.sort((category1, category2) => (category1.title === category2.title ? 0 : category1.title < category2.title ? -1 : 1));
    this._categories.next(this.__categories);
  };
  createSkill = async (skill: Skill) => {
    try {
      skill.id = (await addDoc(collection(this.db, "data", "skills", "skills"), skill)).id;
      this.skills.push(skill);
      this.formatSkills();
    } catch (error) {
      console.error(error);
    }
  };
  updateSkill = async (skill: Skill) => {
    try {
      let newSkill = new Skill(skill);
      delete newSkill.id;
      setDoc(doc(this.db, "data", "skills", "skills", skill.id!), Object.assign({}, newSkill));
      this.skills[this.skills.findIndex((tmp) => tmp.id === skill.id)] = skill;
      this.formatSkills();
    } catch (error) {
      console.error(error);
    }
  };
  deleteSkill = async (skill: Skill) => {
    try {
      deleteDoc(doc(this.db, "data", "skills", "skills", skill.id!));
      // prettier-ignore
      this.skills.splice(this.skills.findIndex((tmp) => tmp.id === skill.id),1);
      this.formatSkills();
    } catch (error) {
      console.error(error);
    }
  };
  updateCategory = async (title: string, category: Category) => {
    try {
      getDocs(query(collection(this.db, "data", "skills", "skills"), where("category", "==", title))).then(async (skills) => {
        skills.docs.forEach((document) => {
          let skill: any = document.data();
          skill.category = category.title;
          setDoc(doc(this.db, "data", "skills", "skills", document.id), Object.assign({}, skill));
          this.skills[this.skills.findIndex((tmp) => tmp.id === document.id)] = skill;
        });
        this.formatSkills();
      });
    } catch (error) {
      console.error(error);
    }
  };
  deleteCategory = async (category: string) => {
    try {
      getDocs(query(collection(this.db, "data", "skills", "skills"), where("category", "==", category))).then(async (skills) => {
        skills.docs.forEach((document) => {
          deleteDoc(doc(this.db, "data", "skills", "skills", document.id));
          // prettier-ignore
          this.skills.splice(this.skills.findIndex((tmp) => tmp.id === document.id),1);
        });
        this.formatSkills();
      });
    } catch (error) {
      console.error(error);
    }
  };
}
