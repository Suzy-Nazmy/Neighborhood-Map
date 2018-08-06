import React, {Component} from 'react';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from './Map.js';
import './App.css';
export class App extends React.Component {
	state = {
    center: {
      lat: 40.7484,
      lng: -73.9857
    },
    radius: 1000,
    limits: 10,
  }
    render() {
        const {loaded} = this.props;
        return (
           <div className="App">
                <header className="App-header">
			       <h1 className="App-title">Neighbourhood Map</h1>
			     </header>

                {/*Add Condition if loade*/}
                {loaded ? (
                    <Map google={this.props.google}/>
                ) : (
                    <div className="error-loading">
                        <p className="error-msg">Could not load Google Maps</p>
                    </div>
                )
                }
            </div>
        );
    }
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyAwR8GVhDt2RdFC-bKxnFRpdTVE2f51wIQ',
})(App);
