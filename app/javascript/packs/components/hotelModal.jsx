import React from 'react'
import { Modal } from 'reactstrap'
import { RoomTypeForm } from './roomTypeForm'

export class HotelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
    // allow parent (hotel div) to access child (hotel modal) function `toggle`
    this.props.setupToggleModal(this.toggle);
  }
  async toggle() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }
  render() {
    return (
      <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
        <RoomTypeForm passClick={this.toggle} hotel={this.props.hotel} />
      </Modal>
    );
  }
}