// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardImg } from 'reactstrap';
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
        <Button color="danger">Danger!!</Button>
      </Container>
     );
   }
}

class HotelList extends React.Component {
  render() {
    console.log(this.props.data)
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
  render() {
    return (      
      <Card body className="mb-3">
        <Row className="no-gutters">
        {/* <div className="hotel">
          <h1>{this.props.data.name}</h1>
          <img src={this.props.data.cover_image} />
        </div> */}
        <Col sm="3">
          <CardImg top src={this.props.data.cover_image} />
        </Col>
        <Col sm="6">
          <CardBody>
            <CardTitle>{this.props.data.name}</CardTitle>
          </CardBody>
        </Col>        
        </Row>
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
