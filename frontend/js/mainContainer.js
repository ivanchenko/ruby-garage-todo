import React from 'react';
import $ from 'jquery';

import Project from './components/Project.jsx';
import {getCookie} from './helpers/cookie';

export default class Container extends React.Component {
  constructor(props) {
    super(props);

    this.addProject = this.addProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);

    this.userId = getCookie('userId');
    this.state = {projects: []}
  }

  componentDidMount() {
    $.ajax({
      method: 'POST',
      url: '/actions/getAllProjects',
      data: {
        userId: this.userId
      }
    }).done((projects) => {
      this.setState({projects: projects});
    }).fail((err) => {
      console.log(err);
      this.setState({projects: []});
    });
  }

  addProject() {
    $.ajax({
      type: 'POST',
      url: '/actions/addProject',
      data: {
        userId: this.userId,
        projectName: 'New Project'
      }
    }).done((project) => {
      var {projects} = this.state;
      projects.push(project);
      this.setState({projects: projects});
    });
  }

  deleteProject(projectId) {
    $.ajax({
      type: 'POST',
      url: '/actions/editProject',
      data: {
        userId: this.userId,
        projectId: projectId,
        action: 'delete'
      }
    }).done((projects) => {
      console.log(projects);
      this.setState({projects: projects});
    })
  }

  render() {
    return (
      <div>
        <div className="main-header clearfix">
          <h4>John Smith</h4>

          <button className="btn btn-lg btn-add-project" onClick={this.addProject}>
            {'Add TODO List'}
          </button>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {this.state.projects.map((project, i) => {
                return (
                  <Project
                    key={i}
                    userId={this.userId}
                    {...project}
                    onDelete={() => this.deleteProject(project._id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}