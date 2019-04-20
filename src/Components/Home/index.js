import React, { Component } from "react";
import { message } from "antd";
import "./index.css";
import axios from "axios";

const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
mapboxgl.accessToken =
  "pk.eyJ1IjoicmFiaXJvc2hhbiIsImEiOiJjanVrNXg4aTcwbzFjNDNucTE3YThrY3QzIn0.SAB8o_a-l9FuLprNGARBAA";

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: { lng: 76.3282, lat: 10.0443 },// Default CUSAT
      another: { lng: 76.32908075445818, lat: 10.04501723322933 }
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      maxBounds: new mapboxgl.LngLatBounds(
        [76.29055, 10.007523],
        [76.383933, 10.083249]
      ),
      center: [76.3282, 10.0443],
      zoom: 14
    });

    var geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [76.3282, 10.0443]
        },
        properties: {
          title: 'Mapbox',
          description: 'Washington, D.C.'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [76.32933, 10.045]
        },
        properties: {
          title: 'Mapbox',
          description: 'San Francisco, California'
        }
      }]
    };

    var that = this;
    geojson.features.forEach(function (marker) {
      // create a HTML element for each feature
      var el = document.createElement('div');
      el.className = 'marker';

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(that.map);
    });
    this.getDirections();

  }

  getDirections = () => {
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/76.3282,10.0443;76.32933,10.045.geometries=geojson&access_token=` + mapboxgl.accessToken, {
      accessToken: "pk.eyJ1IjoicmFiaXJvc2hhbiIsImEiOiJjanVrNXg4aTcwbzFjNDNucTE3YThrY3QzIn0.SAB8o_a-l9FuLprNGARBAA"
    })
      .then(res => res.json())
      .then(route => {
        console.log("route", route)
      })
  }

  checkIfWithinBounds(x, y) {
    const a = 76.29055;
    const b = 10.007523;
    const c = 76.383933;
    const d = 10.083249;

    if (x > a && x < c && y > b && y < d) return true;
    else return false;
  }

  componentWillUnmount() {
    this.map.remove();
  }


  render() {
    const style = {
      position: "absolute",
      top: "4%",
      bottom: 0,
      width: "100%"
    };

    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}
