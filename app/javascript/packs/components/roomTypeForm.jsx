import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Container, Row, Col, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import axios from 'axios'

export class RoomTypeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      roomTypes: [],
      selectedRoomTypeId: undefined,
      form: {
        move_in_date: undefined,
        move_out_date: undefined,
      },
      averageMonthlyRate: undefined,
      available: undefined,
      alertMessage: undefined,
      alertType: undefined,
    }
  }
  componentDidUpdate(oldProps) {
    const newProps = this.props
    if (oldProps.isModalOpen !== newProps.isModalOpen) {
      this.setState({ isOpen: newProps.isModalOpen })
    }
  }
  componentDidMount() {
    this.getRoomTypes()
  }
  toggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      alertMessage: undefined,
    }))
  }
  async getRoomTypes() {
    const response = await axios.get(`/api/v1/hotels/${this.props.hotel.id}/room_types`)
    const roomTypes = response.data
    this.setState({
      roomTypes: roomTypes,
      selectedRoomTypeId: roomTypes[0].id
    })
  };
  async getRoomType() {
    const { selectedRoomTypeId, form } = this.state;

    if (!selectedRoomTypeId || !form.move_in_date || !form.move_out_date) return;

    const response = await axios.get(`/api/v1/hotels/${this.props.hotel.id}/room_types/${selectedRoomTypeId}`, { params: form })
    const roomType = response.data
    this.setState({
      averageMonthlyRate: roomType.average_monthly_rate,
      available: roomType.available,
      alertMessage: undefined,
      alertType: undefined
    })
  };
  handleChange = async (event) => {
    const alertMessage = undefined
    if (event.target.id === 'selectedRoomTypeId') {
      this.setState({
        selectedRoomTypeId: event.target.value,
        alertMessage
      }, () => this.getRoomType())
    }
    else if (event.target.id === 'moveInDate') {
      const form = {
        move_in_date: event.target.value,
        move_out_date: this.state.form.move_out_date
      }
      this.setState({ form , alertMessage }, () => this.getRoomType())
    }
    else if (event.target.id === 'moveOutDate') {
      const form = {
        move_in_date: this.state.form.move_in_date,
        move_out_date: event.target.value,
      }
      this.setState({ form, alertMessage }, () => this.getRoomType())
    }
  }
  handleSubmit = async () => {
    try {
      const { selectedRoomTypeId, form } = this.state;
      const response = await axios.post(`/api/v1/hotels/${this.props.hotel.id}/room_types/${selectedRoomTypeId}/book`, form)
      const roomType = response.data
      this.setState({
        averageMonthlyRate: roomType.average_monthly_rate,
        available: roomType.available,
        alertMessage: 'successfully booked a room',
        alertType: 'success'
      })
    } catch (error) {
      let alertMessage = error.message
      if (error.response && error.response.data) {
        alertMessage = error.response.data.message
      }
      this.setState({
        alertMessage: alertMessage,
        alertType: 'danger'
      })
    }
  }
  render() {
    const { hotel} = this.props
    const { alertMessage, alertType } = this.state
    const roomTypeOptions = this.state.roomTypes.map((roomType) =>
      <option value={roomType.id} key={roomType.id}>{roomType.name}</option>
    );
    const Availability = ({ available }) => {
      if (available == null) return null
      return available ? <h5>Room available</h5> : <h5>Room unavailable</h5>
    }
    const Rate = ({ rate }) => {
      if (rate == null) return null
      return <h5>Rate: { rate }</h5>
    }
    const message = alertMessage ? <Alert color={alertType}>{alertMessage}</Alert> : null
    return (
      <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          <Container>
            <Row className="no-gutters">
              <Col sm="4">
                <img width="100%" src={hotel.cover_image} />
              </Col>
              <Col sm="8">
                <div className="ml-3">
                  <h2>{hotel.name}</h2>
                  <Rate rate={this.state.averageMonthlyRate} />
                  <Availability available={this.state.available} />
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm="12">
                {message}
              </Col>
            </Row>
          </Container>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="selectedRoomTypeId">Room Type</Label>
              <Input type="select" name="select" id="selectedRoomTypeId" onChange={this.handleChange}>
                {roomTypeOptions}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="moveInDate">Move In Date</Label>
              <Input
                type="date"
                name="date"
                id="moveInDate"
                placeholder="move in date"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="moveOutDate">Move Out Date</Label>
              <Input
                type="date"
                name="date"
                id="moveOutDate"
                placeholder="move out date"
                onChange={this.handleChange}
              />
            </FormGroup>
          </Form>      
        </ModalBody>
        <ModalFooter>
          <FormGroup>
            <Button className="mr-2" color="success" onClick={this.handleSubmit}>Book</Button>
          </FormGroup>
        </ModalFooter>
      </Modal>
    );
  }
}

RoomTypeForm.propTypes = {
  hotel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    cover_image: PropTypes.string.isRequired
  }),
  isModalOpen: PropTypes.bool.isRequired
}

RoomTypeForm.defaultProps = {
  isModalOpen: false 
}
