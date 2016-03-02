import React from 'react';

export default class ProjectHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    }
  }

  render() {
    var {title, onTitleChange, onDelete} = this.props;

    if (this.state.editMode) {
      return (
        <div className="panel-heading project-header">

          <div className="glyphicon glyphicon-calendar btn-lg">

          </div>

          <input
            ref="inputTitle"
            type="text"
            className="form-control panel-title"
            defaultValue={title}
          />

          <div
            className="btn-header"
            onClick={() => {
              onTitleChange(this.refs.inputTitle.value);
              this.setState({editMode: false});
            }}
          >
            <div className="glyphicon glyphicon-ok"></div>
          </div>

          <div className="btn-header" onClick={() => {this.setState({editMode: false})}}>
            <div className="glyphicon glyphicon-remove"></div>
          </div>

          <div className="btn-header" onClick={onDelete}>
            <div className="glyphicon glyphicon-trash"></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="project-header panel-heading">

          <div className="glyphicon glyphicon-calendar btn-lg">

          </div>

          <h1 className="panel-title project-header-title">{title}</h1>

          <div className="btn-header">
            <div className="glyphicon glyphicon-pencil" onClick={() => this.setState({editMode: true})}></div>
          </div>
          <div className="btn-header">
            <div className="glyphicon glyphicon-trash" onClick={onDelete}></div>
          </div>
        </div>
      )
    }
  }
}