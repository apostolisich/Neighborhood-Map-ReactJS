import React, { Component } from 'react';
import Map from './Map';
import { slide as Menu } from 'react-burger-menu'
import escapeRegExp from 'escape-string-regexp'
import './App.css';

class App extends Component {
  /** State of the Component. It includes the array of markers 
   *that will render when the app loads 
   */
  state = {
    query: '',
    clickedMarker: null,
    markers: [
      {
        id: '4e2836ff18384dd0a0ddb777',
        lat: 40.6323592,
        lng: 22.9452542,
        title: 'Roman Forum Thessaloniki'
      },
      {
        id: '4e7c83db3151cef2f53f7642',
        lat: 40.636792,
        lng: 22.943661,
        title: 'Church of Panagia Chalkeon'
      },
      {
        id: '4bd0aa27b221c9b60728d4d0',
        lat: 40.633165,
        lng: 22.941090,
        title: 'Electra Palace Hotel'
      },
      {
        id: '4bd9a4d1d2cbc928b330d1ad',
        lat: 40.626855,
        lng: 22.948451,
        title: 'White Tower'
      },
      {
        id: '4fc4c7dfe4b0a6258ec4eec8',
        lat: 40.630886,
        lng: 22.959233,
        title: 'Aristotle University'
      }
    ]
  }

  /** Those styles are used for the burger menu
   * Menu implemented from: https://github.com/negomi/react-burger-menu 
   */
  styles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '25px',
        height: '25px',
        left: '15px',
        top: '12.5px'
    },
    bmBurgerBars: {
        background: '#6666b2'
    },
    bmMenu: {
      background: '#6666b2',
      padding: '10px 15px 15px 15px',
    }
  }

  /** This method updates the query property inside the state object when it's 
   * changed by the filter markers input field.
   */
  updateQuery = (query) => (
    this.setState({ query: query.trim() })
  )

  /** This method updates the clickedMarker property with the one clicked
   * from the available markers list view.
   */
  updateClickedMarker = (marker) => (
    this.setState({ clickedMarker: marker })
  )

  /** The render method of the component. This is used to render all the elements
   * of the component. 
   * The showing markers variable is used in order to filter
   * the markers of the map and the listview when the filter field is used.
   * 
   * The render method includes <Menu /> which is an open source burger menu react
   * component available in GitHub: https://github.com/negomi/react-burger-menu.
   * It also includes the <Map /> component which is another open source google 
   * maps react component available here: https://github.com/google-map-react/google-map-react
   */
  render() {
    let showingMarkers
    if(this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      showingMarkers = this.state.markers.filter(marker => match.test(marker.title))
    } else {
      showingMarkers = this.state.markers
    }

    return (
      <div>
        <div className="header-class">
          <Menu tabIndex="-1" role="navigation" aria-label="filter options" width={"300px"} styles={this.styles}>
            <h1>Thessaloniki</h1>
            <input 
              type="text" 
              placeholder="Filter Markers..." 
              value={this.state.query} 
              onChange={(event) => (this.updateQuery(event.target.value))}/>

            <ul role="menu" aria-label="List with all available markers" tabIndex="-1">
              {showingMarkers.map(marker => (
                <li tabIndex="0" role="menuitem" key={marker.id} onClick={(event) => this.updateClickedMarker(marker)}>{marker.title}</li>
              ))}
            </ul>
          </Menu>
        </div>
        
        <Map role="application" aria-label="Map with restaurant markers" markers={showingMarkers} clickedMarker={this.state.clickedMarker}/>
      </div>
      
    );
  }
}

export default App;
