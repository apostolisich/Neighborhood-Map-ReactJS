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

    if(prevProps.clickedMarker !== this.props.clickedMarker) {
      let stateMarker = this.state.markers.filter(marker => marker.title === this.props.clickedMarker.title)

      this.state.maps.event.trigger(stateMarker[0], 'click')
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
      
      let infowindow = new maps.InfoWindow();

      newMarker.addListener('click', function() {
        infowindow.setContent("")
        
        if (newMarker.getAnimation() != null) {
          newMarker.setAnimation(null);
        } else {
          newMarker.setAnimation(maps.Animation.BOUNCE);
          setTimeout(function(){ newMarker.setAnimation(null); }, 1350);
        }

        fetch('https://api.foursquare.com/v2/venues/' + marker.id + '?&oauth_token=HKX2L43D2IXFD0T1NTUVZRZZGU5M3COJXIHXKE5N5IW0E0YI&v=20180727')
        .then(function(response) {
          return response.json()
        })
        .then(function(data) {
          let reviews = data.response.venue.tips.groups.filter(group => group.type === 'others' && group.name === 'All tips')
          
          let reviewItemCnt = Math.floor(Math.random()*(5+1))
          infowindow.setContent("<b>" + newMarker.title + "</b><br />" + reviews[0].items[reviewItemCnt].text)
        })
        .catch(function(error) {
          infowindow.setContent("Data couldn't be loaded")
        })

        infowindow.open(map, newMarker)
      })

      showingMarkers.push(newMarker)
    })

    this.setState({markers: showingMarkers})
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact 
          yesIWantToUseGoogleMapApiInternals={true}
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