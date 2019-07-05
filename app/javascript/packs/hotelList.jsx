// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import { Row, Col, Button, Card, CardBody, CardTitle, CardImg } from 'reactstrap'
import { HotelModal } from './components/hotelModal'

export class HotelList extends React.Component {
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

