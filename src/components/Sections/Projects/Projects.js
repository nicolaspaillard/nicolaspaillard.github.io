import * as React from 'react'
import ProjectsList from './ProjectsList/ProjectsList';

export default function Projects() {
  var projects = [
    {name:'Nicolas Paillard', url:'https://nicolas-p.000webhostapp.com', image:'https://nicolaspaillard.mo.cloudinary.net/7kJY0BQ/w_100,c_scale/previous-Site.png', text:'Mon ancien portfolio. Développé en HTML/CSS/JS avec Bootstrap'},
    {name:'High-School', url:'https://github.com/nicolaspaillard/High-School', image:'https://nicolaspaillard.mo.cloudinary.net/z6cXPQv/w_100,c_scale/high-School.png', text:'Un portail WEB de gestion d\'établissement scolaire. Développé en ASP.NET Core MVC et s\'appuyant sur un serveur Azure Active Directory et Entity Framework pour gérer la base de données'},
  ]   

  // splits projects array in sub 2 items arrrays for responsive display
  var subgroups = projects.map((_e, i) => { return i % 2 === 0 ? projects.slice(i, i + 2) : null; }).filter(e => { return e; });
  var groups = subgroups.map((_e, i) => { return i % 2 === 0 ? subgroups.slice(i, i + 2) : null; }).filter(e => { return e; });

  return (
    <section id='projects'>
      <div class='container'>
        <h1>Projets</h1><br/><br/>
        <ProjectsList projects={groups} />  
      </div>        
    </section>
  );
}