// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardImg, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
      <Hotel data={hotel} key={hotel.uuid}/>
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
  toggle() {
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
                  <h2 class="ml-3">{this.props.data.name}</h2>
                </Col>
              </Row>
            </Container>
          </ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle} >Book</Button>
            <Button color="secondary" onClick={this.toggle} >Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
