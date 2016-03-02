import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-ui';

import ProjectHeader from './ProjectHeader.jsx'
import TaskCreator from './TaskCreator.jsx';
import Task from './Task.jsx'

export default class Project extends React.Component {
  constructor(props) {
    super(props);

    this.editTitle = this.editTitle.bind(this);
    this.editTask = this.editTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.onSort = this.onSort.bind(this);

    this.state = {
      name: props.name,
      tasks: props.tasks
    }
  }

  componentDidMount() {
    $('#tasks-list').sortable({
      items: 'li',
      update: this.onSort
    });
  }

  onSort() {
    var newTasks = _.clone(this.state.tasks, true);
    var $node = $('#tasks-list');

    var ids = $node.sortable('toArray', {attribute: 'data-id'});

    ids.forEach((id, index) => {
      var item = _.findWhere(newTasks, {_id: id});
      item.num = index;
    });

    this.editTask('', 'renum', newTasks);
    $node.sortable('cancel');
  }

  editTitle(title) {
    $.ajax({
      type: 'POST',
      url: '/actions/editProject',
      data: {
        userId: this.props.userId,
        projectId: this.props._id,
        action: 'title-change',
        value: title
      }
    }).done(() => {
      this.setState({name: title})
    })
  }

  addTask(content) {
    $.ajax({
      type: 'POST',
      url: '/actions/addTask',
      data: {
        userId: this.props.userId,
        projectId: this.props._id,
        taskContent: content
      }
    }).done((data) => {
      var {tasks} = this.state;
      tasks.push(data);
      this.setState({tasks: tasks})
    });
  }

  editTask(taskId, action, value) {
    $.ajax({
      type: 'POST',
      url: '/actions/editTask',
      data: {
        userId: this.props.userId,
        projectId: this.props._id,
        taskId: taskId,
        action: action,
        value: JSON.stringify(value)
      }
    }).done((project) => {
      this.setState({tasks: project.tasks});
    });
  }

  render() {
    var {name, tasks} = this.state;

    return (
      <div className="panel panel-default">
        <ProjectHeader
          title={name}
          onTitleChange={this.editTitle}
          onDelete={this.props.onDelete}
        />
        <div className="panel-body" style={{background: 'lightGray', flex: 1}}>
          <TaskCreator onTaskAdd={this.addTask}/>
        </div>
        <div className="panel-body">
          <ul id="tasks-list" className="list-group">
            {tasks.map((task, i) => {
              return (
                <Task
                  key={i}
                  {...task}
                  onTaskChange={this.editTask}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
