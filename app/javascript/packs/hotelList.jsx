// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Card, CardBody, CardTitle, CardImg } from 'reactstrap'
import { RoomTypeForm } from './components/roomTypeForm'

export function HotelList(props) {
  const hotels = props.data.map((hotel) =>
    <Hotel hotel={hotel} key={hotel.id}/>
  );
  return <div className="hotel-list">{hotels}</div>
}

class Hotel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false,
    }
  }
  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
    }))
  }
  render() {
    return (      
      <Card body className="mb-3" onClick={() => { this.toggleModal() } }>
        <Row className="no-gutters">
          <Col sm="3">
            <CardImg top src={this.props.hotel.cover_image} />
          </Col>
          <Col sm="6">
            <CardBody>
              <CardTitle>{this.props.hotel.name}</CardTitle>
            </CardBody>
          </Col>
        </Row>
        <RoomTypeForm hotel={this.props.hotel} isModalOpen={this.state.isModalOpen}></RoomTypeForm>
      </Card>
    );
  }
}

HotelList.propTypes = {
  hotel: PropTypes.shape(Hotel.propTypes)
}

Hotel.propTypes = {
  hotel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    cover_image: PropTypes.string.isRequired
  })
}