import * as React from 'react'
import './ProjectsList.css'
import { Link } from 'gatsby'
import Container from '../../../Container/Container'

export default function ProjectsList(props) {
  const containersList = props.projects.map((group) => {return (
    <Container flex class={'main'}>{
      group.map((subgroup) => { return (
        <Container split width={"auto"}>
          <Container flex>{
            subgroup.map((project) => {return (
              <Container split class={'mb1'} width={50}>
                <div class='project-card'>
                  <Link to={project.url} class='project-link'>
                    <h2 class='project-name'>{project.name}</h2>     
                  </Link>
                  <img class='project-img' src={project.image} loading="lazy"/>
                  <p class='project-text'><i>{project.text}</i></p>
                </div>
              </Container>
            )})
          }</Container>
        </Container>
      )})
    }</Container>
  )});
  
  return (
    containersList
  );
};