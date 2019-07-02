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
      <Hotel data={hotel} key={hotel.id}/>
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
  setupModalToggle = (toggleModal) => {
    this.toggleModal = toggleModal
  }
  render() {
    return (      
      <Card body className="mb-3">
        <Row className="no-gutters">
          <Col sm="3">
            <CardImg top src={this.props.data.cover_image} />
          </Col>
          <Col sm="6">
            <CardBody>
              <CardTitle>{this.props.data.name}</CardTitle>
              <Button color="primary" onClick={() => { this.toggleModal() } } >Do Something</Button>
            </CardBody>
          </Col>
        </Row>
        <HotelModal setupToggleModal={this.setupModalToggle.bind(this)} data={this.props.data}></HotelModal>
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
      <div>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
          <ModalHeader>
            <Container>
              <Row className="no-gutters">
                <Col sm="4">
                  <img width="100%" src={this.props.data.cover_image} />
                </Col>
                <Col sm="8">
                  <h2 className="ml-3">{this.props.data.name}</h2>
                </Col>
              </Row>
            </Container>
          </ModalHeader>
          <ModalBody>
            <RoomTypeForm passClick={this.toggle}/>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

class RoomTypeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomTypes: [],
      selectedRoomTypeId: undefined,
      moveInDate: undefined,
      moveOutDate: undefined
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    await this.getRoomTypes();
  }
  getRoomTypes = async () => {
    const response = await axios.get('/api/v1/hotels/1/room_types')
    const roomTypes = response.data
    this.setState({ roomTypes: roomTypes })
  };
  async handleChange(event) {
    if (event.target.id === 'roomTypeSelect') {
      this.setState({ selectedRoomTypeId: event.target.value })
    }
    if (event.target.id === 'moveInDateSelect') {
      this.setState({ moveInDate: event.target.value })
    }
    if (event.target.id === 'moveOutDateSelect') {
      this.setState({ moveOutDate: event.target.value })
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
      <Form>
        <FormGroup>
          <Label for="roomTypeSelect">Room Type</Label>
          <Input type="select" name="select" id="roomTypeSelect" onChange={this.handleIChange}>
            {roomTypeOptions}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="moveInDateSelect">Move In Date</Label>
          <Input
            type="date"
            name="date"
            id="moveInDateSelect"
            placeholder="move in date"
          />
        </FormGroup>
        <FormGroup>
          <Label for="moveOutDateSelect">Move Out Date</Label>
          <Input
            type="date"
            name="date"
            id="moveOutDateSelect"
            placeholder="move out date"
          />
        </FormGroup>
        <FormGroup>
          <Button className="mr-2" color="success" onClick={this.handleSubmit}>Book</Button>
          <Button color="secondary" onClick={this.props.passClick}>Cancel</Button>
        </FormGroup>
      </Form>
    );
  }
}