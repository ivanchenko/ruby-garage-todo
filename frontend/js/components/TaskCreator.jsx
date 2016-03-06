import React from 'react';

export default class TaskCreator extends React.Component {
    render() {
        let {onTaskAdd} = this.props;
        return (
            <form className="input-group" onSubmit={(e) => e.preventDefault()}>
                <span className="input-group-addon">
                    <div className="glyphicon glyphicon-plus"></div>
                </span>
                <input ref="task" type="text" className="form-control"/>
                <span className="input-group-btn">
                    <button
                        className="btn btn-default"
                        onClick={() => {
                            if (this.refs.task.value) {
                                onTaskAdd(this.refs.task.value);
                                this.refs.task.value = '';
                            }
                        }}>
                        Add Task
                    </button>
                </span>
            </form>
        );
    }
}
