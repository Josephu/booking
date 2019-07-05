import React from 'react'

export class Rate extends React.Component {
  render() {
    let rate = '';
    if (this.props.rate) {
      rate = <h5>Rate: {this.props.rate}</h5>
    }
    return rate
  }
}