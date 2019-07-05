import React from 'react'

export class Availability extends React.Component {
  render() {
    let available = '';
    if (this.props.available != null) {
      if (this.props.available === true) {
        available = <h5>Room available</h5>
      } else {
        available = <h5>Room unavailable</h5>
      }
    }
    return available
  }
}