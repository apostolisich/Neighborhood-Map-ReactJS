import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

window.gm_authFailure = function() {
  document.getElementById('map').style.display = "none";
  document.getElementById('error-div').style.display = "block";
  console.log("console");
}

class Map extends Component {
  /** The state of this component. It includes the default properties of the map.
   */
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

  /** This is one of react's lifecycle methods. It is used when the component
   * receives new props. It includes two logical tests. 
   * 
   * The first one checks if a different markers array is passed and re-renders
   * the markers on the map. This is used when the markers listview is filtered.
   * 
   * The second test checks if a marker on the listview is clicked. If it's
   * true, it finds the correct marker from the this.state.markers array 
   * which includes the drawn markers on the map, and triggers the click 
   * even on that marker.
   */
  componentDidUpdate(prevProps) {
    if(prevProps.markers !== this.props.markers) {
      this.renderMarkers(this.state.map, this.state.maps, this.props.markers)
    }

    if(prevProps.clickedMarker !== this.props.clickedMarker) {
      let stateMarker = this.state.markers.filter(marker => marker.title === this.props.clickedMarker.title)

      this.state.maps.event.trigger(stateMarker[0], 'click')
    }
  }

  

  /** This method is used to render the markers on the map. It loops through all the markers
   * that was passed as props in the component and are now saved in the state of the component.
   * 
   * For each marker item, it creates a new Google Maps Marker with the given lat, lng and title.
   * It also adds a 'click' function on each marker which is used to open an info window on top of 
   * the marker. This info window is filled with a random review from the Fourquare API. If no 
   * review was found, then the info window informs the user about that.
   */
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
        infowindow.setContent("Loading...")
        
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

  /** The render method includes only one component, the GoogleMapReact component which
   * is available through the library mentioned in the App.js file. For this component
   * we set our Google Map API key, and the center and zoom values. 
   * 
   * We also use the onGoogleApiLoaded method which is called after the Google API is
   * loaded and renders all the markers. It has two parameters. The map parameter is
   * our current map and the maps parameter is the google.maps from the JavaScript API
   * which includes all the functionality available for the API.
   * More info about the API: https://developers.google.com/maps/documentation/javascript/tutorial
   */
  render() {
    return (
      <div id="container">
        <div id="map" style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact 
            yesIWantToUseGoogleMapApiInternals={true}
            bootstrapURLKeys={{ key: 'AIzaSyBrFTM2440iu_37qfqdya2x8GTX4J4b_GM' }}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
            onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps, this.props.markers)}
          >
          
          </GoogleMapReact>
        </div>

        <div id="error-div">
          <h2>Maps couldn't be loaded</h2>
          <p>Please check your internet connection and reload the page!</p>
        </div>
      </div>
    );
  }
}

export default Map;