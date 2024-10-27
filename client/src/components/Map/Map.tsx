import React from "react";
import GoogleMapReact, { ChangeEventValue, Maps, MapOptions } from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Rating from "@mui/material/Rating";
import "./Map.css"; // Import the CSS file

const Map = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const coordinates = { lat: 0, lng: 0 };

  // Define options as an object or function that returns an object
  const mapOptions: MapOptions = {
    fullscreenControl: false,
  };

  // Define the onChange function to handle map changes
  const handleMapChange = (event: ChangeEventValue) => {
    console.log("Map change event:", event);
  };

  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={mapOptions} // Pass the map options
        onChange={handleMapChange} // Correct onChange function type
      >
      </GoogleMapReact>
    </div>
  );
};

export default Map;
