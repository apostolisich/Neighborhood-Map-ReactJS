import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

class Map extends Component {
  state = {
    center: {
      lat: 40.633166,
      lng: 22.951842
    },
    zoom: 15,
    map: null,
    maps: null,
    markers: []
  }

  componentDidUpdate(prevProps) {
    if(prevProps.markers !== this.props.markers) {
      this.renderMarkers(this.state.map, this.state.maps, this.props.markers)
    }
  }

  renderMarkers (map, maps, markers) {
    if(this.state.map === null && this.state.maps === null) {
      this.setState({ map: map })
      this.setState({ maps: maps })
    }

    this.state.markers.forEach(marker => marker.setMap(null))
    
    let showingMarkers = []
    markers.map(marker => {
      let latlng = {
        lat: marker.lat,
        lng: marker.lng
      }
      let newMarker = new maps.Marker({
        position: latlng,
        map,
        title: marker.title
      });

      showingMarkers.push(newMarker)
    })

    this.setState({markers: showingMarkers})
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBrFTM2440iu_37qfqdya2x8GTX4J4b_GM' }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
          onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps, this.props.markers)}
        >
        
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;