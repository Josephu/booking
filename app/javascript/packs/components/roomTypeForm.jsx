import React from 'react'
import { Container, Row, Col, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { FormMessage} from './form/formMessage'
import { Rate } from './form/rate'
import { Availability } from './form/availability'
import axios from 'axios'

export class RoomTypeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomTypes: [],
      selectedRoomTypeId: undefined,
      moveInDate: undefined,
      moveOutDate: undefined,
      averageMonthlyRate: undefined,
      available: undefined,
      alertMessage: undefined,
      alertType: undefined,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    await this.getRoomTypes();
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
    if (this.state.selectedRoomTypeId && this.state.moveInDate && this.state.moveOutDate) {
      const response = await axios.get(`/api/v1/hotels/${this.props.hotel.id}/room_types/${this.state.selectedRoomTypeId}?move_in_date=${this.state.moveInDate}&move_out_date=${this.state.moveOutDate}`)
      const roomType = response.data
      console.log(roomType)
      this.setState({
        averageMonthlyRate: roomType.average_monthly_rate,
        available: roomType.available,
        alertMessage: undefined,
        alertType: undefined
      })
    }
  };
  async handleChange(event) {
    if (['selectedRoomTypeId', 'moveInDate', 'moveOutDate'].includes(event.target.id)) {
      const state = {}
      state[event.target.id] = event.target.value
      this.setState(state, async function () {
        await this.getRoomType()
      })
    }
  }
  async handleSubmit() {
    try {
      const response = await axios.post(
        `/api/v1/hotels/${this.props.hotel.id}/room_types/${this.state.selectedRoomTypeId}/book`,
        {
          move_in_date: this.state.moveInDate,
          move_out_date: this.state.moveOutDate
        }
      )
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
    const roomTypeOptions = this.state.roomTypes.map((roomType) =>
      <option value={roomType.id} key={roomType.id}>{roomType.name}</option>
    );
    return (
      <div>
        <ModalHeader toggle={this.props.passClick}>
          <Container>
            <Row className="no-gutters">
              <Col sm="4">
                <img width="100%" src={this.props.hotel.cover_image} />
              </Col>
              <Col sm="8">
                <div className="ml-3">
                  <h2>{this.props.hotel.name}</h2>
                  <Rate rate={this.state.averageMonthlyRate} />
                  <Availability available={this.state.available} />
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm="12">
                <FormMessage alertType={this.state.alertType} >{this.state.alertMessage}</FormMessage>
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
      </div>
    );
  }
}