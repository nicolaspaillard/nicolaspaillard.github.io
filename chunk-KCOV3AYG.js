import{a as H,b as J}from"./chunk-TZ4J2364.js";import{a as K,b as Q}from"./chunk-B7AVLEN3.js";import{a as U}from"./chunk-AXV63KBM.js";import{C as W,D as $,E as L,F as Y,o as R,p as D,r as j,s as z,t as B,u as I,w as G,x as q,y as O,z as P}from"./chunk-7HJCJGS6.js";import{Qa as x,bb as y,cb as w}from"./chunk-WIGCV5ZO.js";import{Bb as r,Cb as c,Db as k,Hb as _,Ib as a,Jb as d,Kc as N,Lc as C,Oc as b,Ua as s,Ub as p,Va as S,Vb as h,Yb as V,Zb as A,_b as F,eb as v,ia as m,ja as u,kb as g,ra as T,sb as l}from"./chunk-IZSKTIJ7.js";import{h as M}from"./chunk-MG3ERZGY.js";function oe(i,E){if(i&1){let n=_();r(0,"div",2)(1,"p-button",3),a("onClick",function(){m(n);let e=d();return u(e.onSectionEdit.emit(e.section))}),c(),r(2,"p-button",4),a("onClick",function(){m(n);let e=d();return u(e.onSectionRemoved.emit(e.section))}),c()()}i&2&&(s(),l("text",!0),s(),l("text",!0))}var X=(()=>{class i{constructor(n){this.authService=n,this.onSectionRemoved=new T,this.onSectionEdit=new T,this.user=null,this.authService.user().subscribe(o=>this.user=o)}static{this.\u0275fac=function(o){return new(o||i)(S(x))}}static{this.\u0275cmp=v({type:i,selectors:[["app-section"]],inputs:{section:"section"},outputs:{onSectionRemoved:"onSectionRemoved",onSectionEdit:"onSectionEdit"},decls:6,vars:3,consts:[[1,"group","card","relative","h-full","p-10"],["class","absolute right-0 top-0 z-10 transition-opacity group-hover:opacity-100 lg:opacity-0",4,"ngIf"],[1,"absolute","right-0","top-0","z-10","transition-opacity","group-hover:opacity-100","lg:opacity-0"],["icon","pi pi-pencil","size","small",3,"onClick","text"],["icon","pi pi-trash","size","small","severity","danger",3,"onClick","text"]],template:function(o,e){o&1&&(r(0,"div",0),g(1,oe,3,2,"div",1),r(2,"h2"),p(3),c(),r(4,"p"),p(5),c()()),o&2&&(s(),l("ngIf",e.user&&e.user.roles.includes("admin")),s(2),h(e.section.title),s(2),h(e.section.text))},dependencies:[b,C,w,y],encapsulation:2})}}return i})();function ne(i,E){if(i&1){let n=_();r(0,"p-button",10),a("onClick",function(){m(n);let e=d();return u(e.openDialogSection())}),c()}i&2&&l("text",!0)}function re(i,E){if(i&1){let n=_();r(0,"app-section",11),a("onSectionEdit",function(){let e=m(n).$implicit,t=d();return u(t.openDialogSection(e))})("onSectionRemoved",function(){let e=m(n).$implicit,t=d();return u(t.deleteSection(e))}),c()}if(i&2){let n=E.$implicit;l("section",n)}}var ke=(()=>{class i{constructor(n,o,e){this.authService=n,this.sectionsService=o,this.confirmService=e,this.bubbles=[{icon:"heroMagnifyingGlassSolid",text:"Recherche CDI"},{icon:"heroCakeSolid",text:new Date().getFullYear()-1997+" ans"},{icon:"bootstrapCarFrontFill",text:"Permis B"},{icon:"heroMapPinSolid",text:"Montpellier, France"},{icon:"heroAcademicCapSolid",text:"BTS Syst\xE8mes Num\xE9riques, option Informatique et R\xE9seaux"},{icon:"heroEnvelopeSolid",text:"Contacter par mail",href:""}],this.user=null,this.isDialogSectionShown=!1,this.idEdit="",this.formSection=new B({title:new I("",[D.required]),text:new I("",[D.required])}),this.sections=[],this.openDialogSection=t=>{if(t){this.idEdit=t.id;let f=new H(t);delete f.id,this.formSection.setValue(f)}else this.idEdit="",this.formSection.reset();this.isDialogSectionShown=!0},this.createSection=()=>this.sectionsService.createSection(this.formSection.value).then(()=>this.isDialogSectionShown=!1),this.updateSection=()=>{let t=this.formSection.value;t.id=this.idEdit,this.sectionsService.updateSection(t).then(()=>this.isDialogSectionShown=!1)},this.deleteSection=t=>{this.confirmService.confirm({message:`Voulez-vous vraiment supprimer '${t.title}' ?`,accept:()=>M(this,null,function*(){this.sectionsService.deleteSection(t)})})},this.authService.user().subscribe(t=>this.user=t),this.sectionsService.sections().subscribe(t=>this.sections=t)}static{this.\u0275fac=function(o){return new(o||i)(S(x),S(J),S(U))}}static{this.\u0275cmp=v({type:i,selectors:[["app-about"]],decls:16,vars:10,consts:[[1,"flex","min-h-full","flex-col","items-center","justify-center","px-5","py-5","lg:px-0"],["size","large","class","mb-5 block text-center","icon","pi pi-plus",3,"text","onClick",4,"ngIf"],[3,"section","onSectionEdit","onSectionRemoved",4,"ngFor","ngForOf"],["contentStyleClass","flex flex-col gap-2",3,"visibleChange","modal","header","dismissableMask","visible"],[1,"flex","flex-col","gap-2","*:flex","*:justify-evenly","*:gap-2","[&>label]:gap-0","[&_label]:flex","[&_label]:w-full","[&_label]:flex-col",3,"formGroup"],["pInputText","","type","text","formControlName","title"],["pTextarea","","formControlName","text"],[1,"flex","justify-end","gap-2"],[3,"onClick","text"],[3,"onClick","disabled"],["size","large","icon","pi pi-plus",1,"mb-5","block","text-center",3,"onClick","text"],[3,"onSectionEdit","onSectionRemoved","section"]],template:function(o,e){o&1&&(r(0,"div",0),g(1,ne,1,1,"p-button",1)(2,re,1,1,"app-section",2),c(),r(3,"p-dialog",3),F("visibleChange",function(f){return A(e.isDialogSectionShown,f)||(e.isDialogSectionShown=f),f}),r(4,"form",4)(5,"label"),p(6," Titre "),k(7,"input",5),c(),r(8,"label"),p(9," Texte "),k(10,"textarea",6),c()(),r(11,"div",7)(12,"p-button",8),a("onClick",function(){return e.isDialogSectionShown=!1}),p(13,"Annuler"),c(),r(14,"p-button",9),a("onClick",function(){return e.idEdit.length?e.updateSection():e.createSection()}),p(15),c()()()),o&2&&(s(),l("ngIf",e.user&&e.user.roles.includes("admin")),s(),l("ngForOf",e.sections),s(),l("modal",!0)("header",(e.idEdit.length?"Modifier":"Ajouter")+" une exp\xE9rience")("dismissableMask",!0),V("visible",e.isDialogSectionShown),s(),l("formGroup",e.formSection),s(8),l("text",!0),s(2),l("disabled",!e.formSection.valid),s(),h(e.idEdit.length?"Modifier":"Ajouter"))},dependencies:[b,N,C,X,P,G,R,j,z,q,O,$,W,w,y,Y,L,Q,K],encapsulation:2})}}return i})();export{ke as AboutComponent};