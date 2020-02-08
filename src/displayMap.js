import React from 'react';
import Map from './map';

export default class DisplayMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: this.props.lat,
      lng: this.props.lng
    }
  }
  
  static defaultProps = {
    //lat : 18.5204,
    lat: 35.92464453144099,
    //lng : 73.8567
    lng: 51.4599609375,
    draggable: true,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat !== this.state.lat || nextProps.lng !== this.state.lng) {
      //Perform some operation
      this.setState({ lat: nextProps.lat, lng: nextProps.lng });
    }
  }

  render() {
    return (
      <Map
        google={this.props.google}
        center={{ lat: this.state.lat, lng: this.state.lng }}
        height='300px'
        zoom={15}
        onChange={this.props.onChange}
        name={this.props.name}
        draggable={this.props.draggable}
      />
    )
  }
}