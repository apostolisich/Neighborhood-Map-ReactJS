import React, { Component } from 'react';
import Map from './Map';
import { slide as Menu } from 'react-burger-menu'
import escapeRegExp from 'escape-string-regexp'
import './App.css';

class App extends Component {
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

  updateQuery = (query) => (
    this.setState({ query: query.trim() })
  )

  setClickedMarker = (marker) => (
    this.setState({ clickedMarker: marker })
  )

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
        <Menu width={"300px"} styles={this.styles}>
          <h1>Thessaloniki</h1>
          <input 
            type="text" 
            placeholder="Filter Markers..." 
            value={this.state.query} 
            onChange={(event) => (this.updateQuery(event.target.value))}/>

          <ul>
            {showingMarkers.map(marker => (
              <li key={marker.id} onClick={(event) => this.setClickedMarker(marker)}>{marker.title}</li>
            ))}
          </ul>
        </Menu>
        </div>
        
        <Map markers={showingMarkers} clickedMarker={this.state.clickedMarker}/>
      </div>
      
    );
  }
}

export default App;
