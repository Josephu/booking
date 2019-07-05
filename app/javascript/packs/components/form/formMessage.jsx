import React from 'react'
import { Alert } from 'reactstrap';

export class FormMessage extends React.Component {
  render() {
    let alertMessage = '';
    if (this.props.children) {
      alertMessage = <Alert color={this.props.alertType}>{this.props.children}</Alert>
    }
    return alertMessage
  }
}