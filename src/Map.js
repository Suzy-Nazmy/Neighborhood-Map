import React, {Component} from 'react';
import './index.css';
import Sidenav from './Sidenav';
import mapStyle from './mapStyle';

const foursquare = require('react-foursquare')({
    clientID: 'SD22CDMBHSGKTUELLMKNM5SLOLQD1CEK50HFXHTDPWXW2BQR',
    clientSecret: 'IADZ1ZKDJAQRJYJQTJS0MXSPPBCH5S1HOWS2X53JTKKFXH5A',
});

class Map extends Component {
	
    state = {
        map: {},
        locations: [
            {
                title: 'Caffe e Vino',
                type: 'Caffe',
                venue_id: '4acbe4fbf964a52040c820e3',
                location: {lat: 40.689807316555346, lng: -73.97828826952299},
                visible: true
            },
			{
                title: 'Taboo bar',
                type: 'restaurant',
                venue_id: '523500d811d2e5a544fe3c3d',
                location: {lat: 40.74966812133789, lng: -73.99472045898438},
                visible: true
            },
            {
                title: 'White Summers Caffee',
                type: 'cafe',
                venue_id: '554804e3498e7fd004d28714',
                location: {lat: 40.720332241409665, lng: -73.99869598754455},
                visible: true
            },
			{
                title: 'Le Cafe Resturant',
                type: 'restaurant',
                venue_id: '4f326ce819836c91c7d699a5',
                location: {lat: 40.75119, lng: -73.992497},
                visible: true
            },
            {
                title: 'Aramark Caffee',
                type: 'cafe',
                venue_id: '50dc8b88e4b0298a12b9479c',
                location: {lat: 40.71480526932376, lng: -74.01191744159783},
                visible: true
            },
			{
                title: 'Subway Resturant',
                type: 'restaurant',
                venue_id: '4cbba8269552b60cab76e18b',
                location: {lat: 40.738639, lng: -73.982689},
                visible: true
            },
            
            {
                title: 'Caffee',
                type: 'cafe',
                venue_id: '514a2018e4b0a8c84eeef8f0',
                location: {lat: 40.62092596652842, lng: -74.00225967250508},
                visible: true
            },
            {
                title: 'Aleef Coffee',
                type: 'cafe',
                venue_id: '4b507f67f964a520352527e3',
                location: {lat: 40.75607987443464, lng: -73.9927852712405},
                visible: true
            }
        ],
        infoWindow: {},
        markers: [],
        searchQuery: 'all',
        tips: []
    };
    // filter based on type 
    filter = (searchQuery) => {
        const map = this.state.map;
        const markers = this.state.markers;
        
        markers.forEach(marker => marker.setMap(null))

        const selectLocations = this.state.locations.map((location) => {
            if ((location.type === searchQuery) || (searchQuery === 'all')) {
                location.visible = true
            } else {
                location.visible = false
            }
            return location
        });

        this.setState({selectLocations, searchQuery});
        this.setMarkers(map)

    };


    componentDidMount() {
        this.loadMap(); // call loadMap function
        console.log(this.loadMap);
        let tips = [];
        this.state.locations.forEach(location => {
            const params = {'venue_id': location.venue_id, 'sort': 'popular'};
            foursquare.venues.getVenueTips(params).then((response) => {
                // assemble photo via API instructions
                if (response.meta.code === 200) {
                    tips.push({text: response.response.tips.items[0].text, title: location.title})
                } else {
                    tips.push({text:"Sorry, Couldn't call data from Foursquare", title: location.title})
                }

            }).then(() => this.setState({tips})).catch(e=>console.log(e))
        })
    }

    setMarkers(map) {
        let defaultIcon = this.makeMarkerIcon('ede10b ');
        let markers = this.state.locations.filter(location => location.visible).map(location => {
            const marker = new window.google.maps.Marker({
                position: {lat: location.location.lat, lng: location.location.lng},
                map,
                title: location.title
            });

            marker.addListener('click', () => {
                this.state.map.panTo(marker.getPosition());
                this.state.infoWindow.setContent(`
                    <div tabIndex="1" name=${marker.title}>
                        <p>${marker.title}</p>
                        <p>${this.state.tips[0].text}</p>
                        
                    </div>`);
                this.state.infoWindow.open(map, marker)
            });

            marker.addListener('mouseover', function() {
                this.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(() => this.setAnimation(null), 400)
            });

            marker.addListener('mouseout', function() {
                this.setAnimation(null)
            });
              
            return marker;
        });
        this.setState({markers})
    }


    //LoadMap function 
    loadMap() {
        
        if(this.props && this.props.google) {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: {lat: 40.7484, lng: -73.9857},
                 zoom: mapStyle.zoom,
              styles: mapStyle.styles,
              mapTypeControl: mapStyle.mapTypeControl
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: 'content'
            });
            this.setState({map, infoWindow});
            this.setMarkers(map);
        }
    }
makeMarkerIcon(markerColor) {
    var markerImage = new this.props.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new this.props.google.maps.Size(21, 34),
      new this.props.google.maps.Point(0, 0),
      new this.props.google.maps.Point(10, 34),
      new this.props.google.maps.Size(21,34));
    return markerImage;
  }

    render() {
        const {searchQuery, locations, map, infoWindow, markers, tips} = this.state;
		const style = {
            width: '87vw',
            height: '90vh',
        }
    
        return (
            <div className="container" role="main">
                <div className="map-container">
                    <div id="map" aria-hidden="true" style={style} role="application"/>
                </div>

                <Sidenav searchQuery={searchQuery} locations={locations} tips={tips} markers={markers} map={map}
                         infoWindow={infoWindow} filter={this.filter}/>
            </div>
        )
    }
}


export default Map;