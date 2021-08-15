import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import './Map.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

let coordinates = { lat: 34, lng: 5 };

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    coordinates.lat = position.coords.latitude;
    coordinates.lng = position.coords.longitude;
  });
}


const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(coordinates.lng);
  const [lat, setLat] = useState(coordinates.lat);
  const [zoom, setZoom] = useState(1.5);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // map.on('load', () => {

    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(function(position) {
    //         setLat(position.coords.latitude);
    //         setLng(position.coords.longitude);
    //       });
    //     }
    //     map.flyTo({
    //        center: [
    //           lng, // Example data
    //           lat // Example data
    //        ],
    //        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    //     });
    // });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new MapboxGeocoder({accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl}));
    
    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
    }));

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    const marker = new mapboxgl.Marker();
    map.on('click', (e) => {
      marker.setLngLat(e.lngLat).addTo(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;
