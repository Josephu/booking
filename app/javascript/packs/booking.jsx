import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import { HotelList } from './hotelList'
import { Container } from 'reactstrap';
import axios from 'axios'

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

// export default App;
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
  )
})
