import React from 'react';

export default class Task extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false
        }
    }

    render() {
        let {_id, content, done, deadLine, onTaskChange, onDateChange} = this.props;

        var closedTask = done ? {textDecoration: 'line-through'} : null;

        if (deadLine) {
            deadLine = new Date(deadLine);
            var diff = (deadLine - Date.now()) / 1000 / 3600 / 24;
            deadLine = deadLine.toLocaleDateString();

            if (diff <= 0) {
                deadLine = <span className="label label-danger deadline-label">{deadLine}</span>;
            } else if (diff > 0 && diff < 2) {
                deadLine = <span className="label label-warning deadline-label">{deadLine}</span>
            } else {
                deadLine = <span className="label label-info deadline-label">{deadLine}</span>
            }


        }

        if (this.state.editMode) {
            return (
                <li key={_id} data-id={_id} className="list-group-item task-container">
                    <input
                        ref="cbStatus"
                        type="checkbox"
                        checked={done}
                        onChange={() => onTaskChange(_id, 'status-change', this.refs.cbStatus.checked)}
                    />

                    <input
                        ref="inputContent"
                        type="text"
                        className="form-control task-text"
                        defaultValue={content}
                    />

                    {deadLine}

                    <button
                        className="btn btn-default btn-task"
                        onClick={() => {
                            onTaskChange(_id, 'content-change', this.refs.inputContent.value);
                            this.setState({editMode: false});
                        }}
                    >
                        <div className="glyphicon glyphicon-ok"></div>
                    </button>
                    <button className="btn btn-default btn-task" onClick={() => {this.setState({editMode: false})}}>
                        <div className="glyphicon glyphicon-remove"></div>
                    </button>

                    <button className="btn btn-default btn-task" onClick={() => onDateChange(_id)}>
                        <div className="glyphicon glyphicon-calendar"></div>
                    </button>
                    <button className="btn btn-default btn-task" onClick={() => onTaskChange(_id, 'delete')}>
                        <div className="glyphicon glyphicon-trash"></div>
                    </button>
                </li>
            );
        } else {
            return (
                <li key={_id} data-id={_id} className="list-group-item task-container">
                    <input
                        ref="cbStatus"
                        type="checkbox"
                        checked={done}
                        onChange={() => onTaskChange(_id, 'status-change', this.refs.cbStatus.checked)}
                    />

                    <div className="text-left task-text" style={closedTask}>{content}</div>

                    {deadLine}

                    <button className="btn btn-default btn-task" onClick={() => this.setState({editMode: true})}>
                        <div className="glyphicon glyphicon-pencil"></div>
                    </button>

                    <button className="btn btn-default btn-task" onClick={() => onDateChange(_id)}>
                        <div className="glyphicon glyphicon-calendar"></div>
                    </button>
                    <button className="btn btn-default btn-task" onClick={() => onTaskChange(_id, 'delete')}>
                        <div className="glyphicon glyphicon-trash"></div>
                    </button>

                </li>
            );
        }
    }
}
