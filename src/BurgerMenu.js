import React from 'react'
import { slide as Menu } from 'react-burger-menu'

class BurgerMenu extends React.Component {
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

  render () {
    return (
      <Menu width={"300px"} styles={this.styles}>
        <h1>Thessaloniki</h1>
        <input type="text" placeholder="Filter Markers..." />
        <ul>
          {this.props.markers.map(marker => (
            <li key={marker.title}>{marker.title}</li>
          ))}
        </ul>
      </Menu>
    );
  }
}

export default BurgerMenu