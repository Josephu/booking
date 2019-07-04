// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardImg, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
  state = {
     hotels: []
  };
  async componentDidMount() {
    await this.getHotels();
  }
  getHotels = async() => {
    const response = await axios.get('/api/v1/hotels')
    const hotels = response.data
    // const hotels = [{
    //   name: 'Hotel 1',
    //   coverImage: 'https://images.app.goo.gl/Z9KHC1BSco7gRtHj6'
    // }]
    this.setState({ hotels })
  };
  render() {
     return (
      <Container className="App">
        <HotelList data={this.state.hotels}/>
      </Container>
     );
   }
}

class HotelList extends React.Component {
  render() {
    const hotels = this.props.data.map((hotel) =>
      <Hotel hotel={hotel} key={hotel.id}/>
    );
    return (
      <div className="hotel-list">
        {hotels}
      </div>
    );
  }
}

class Hotel extends React.Component {
  state = {
    isModalOpen: false
  };
  // Enable parent to trigger child function
  setupModalToggle(toggleModal) {
    this.toggleModal = toggleModal
  }
  render() {
    return (      
      <Card body className="mb-3">
        <Row className="no-gutters">
          <Col sm="3">
            <CardImg top src={this.props.hotel.cover_image} />
          </Col>
          <Col sm="6">
            <CardBody>
              <CardTitle>{this.props.hotel.name}</CardTitle>
              <Button color="primary" onClick={() => { this.toggleModal() } } >Do Something</Button>
            </CardBody>
          </Col>
        </Row>
        <HotelModal setupToggleModal={this.setupModalToggle.bind(this)} hotel={this.props.hotel}></HotelModal>
      </Card>
    );
  }
}

// export default App;
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
  )
})

class HotelModal extends React.Component {
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

class Availability extends React.Component {
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

class Rate extends React.Component {
  render() {
    let rate = '';
    if (this.props.rate) {
      rate = <h5>Rate: {this.props.rate}</h5>
    }
    return rate
  }
}

class RoomTypeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomTypes: [],
      selectedRoomTypeId: undefined,
      moveInDate: undefined,
      moveOutDate: undefined,
      averageMonthlyRate: undefined,
      available: undefined
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    await this.getRoomTypes();
  }
  async getRoomTypes() {
    const response = await axios.get('/api/v1/hotels/1/room_types')
    const roomTypes = response.data
    this.setState({ roomTypes: roomTypes })
    this.setState({ selectedRoomTypeId: roomTypes[0].id })
  };
  async getRoomType() {
    if (this.state.selectedRoomTypeId && this.state.moveInDate && this.state.moveOutDate) {
      const response = await axios.get(`/api/v1/hotels/1/room_types/${this.state.selectedRoomTypeId}?move_in_date=${this.state.moveInDate}&move_out_date=${this.state.moveOutDate}`)
      const roomType = response.data
      console.log(roomType)
      this.setState({ averageMonthlyRate: roomType.average_monthly_rate })
      this.setState({ available: roomType.available })
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
  handleSubmit(event) {
    alert('submit')
  }
  render() {
    const roomTypeOptions = this.state.roomTypes.map((roomType) =>
      <option value={roomType.id} key={roomType.id}>{roomType.name}</option>
    );

    return (
      <div>
        <ModalHeader>
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
            <Button color="secondary" onClick={this.props.passClick}>Cancel</Button>
          </FormGroup>
        </ModalFooter>
      </div>
    );
  }
}