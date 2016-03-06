import React from 'react';

import $ from 'jquery';
import _ from 'underscore';
import 'jquery-ui';

import {Modal} from "react-bootstrap";

import DayPicker, { DateUtils }  from "react-day-picker";
import "react-day-picker/lib/style.css";

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
            tasks: props.tasks,
            showModal: false
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

            <div className="panel panel-default" id="a">
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
                                    onDateChange={(taskId) => {
                                        this.tempTaskId = taskId;
                                        this.setState({showModal: true})
                                    }}
                                />
                            );
                        })}
                    </ul>
                </div>

                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>Choose date</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DayPicker className="date-picker"
                            modifiers={{selected: day => DateUtils.isSameDay(this.state.selectedDay, day)}}
                            onDayClick={(e, day, modif) =>
                                this.setState({selectedDay: modif.indexOf("selected") > -1 ? null : day})
                            }
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-default"
                            onClick={() => this.setState({showModal: false})}
                        >
                            Close
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                this.editTask(this.tempTaskId, 'deadline-change', this.state.selectedDay);
                                this.setState({showModal: false});
                            }}
                        >
                            Save
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
