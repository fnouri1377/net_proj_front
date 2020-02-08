import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

export default class LinkButton extends React.Component {
  render() {
    return (
      <Link
        to={`${this.props.to}${this.props.form._id}`}
        onClick={() => this.props.getForm(this.props.form._id)}
        className={'link marginTop'}
      >
        {this.props.form.title}
      </Link>
    );
  }
}
