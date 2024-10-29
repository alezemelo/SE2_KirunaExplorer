import React from "react";
import GoogleMapReact, { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import "./Map.css"; // Import the CSS file

// Define types for Coordinates and MapProps
interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;
}

const Map: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const mapOptions: MapOptions = {
    fullscreenControl: false,
  };

  // Define handleMapChange function with correct typing
  const handleMapChange = (e: ChangeEventValue) => {
    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
    
  };

  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={12}
        margin={[50, 50, 50, 50]}
        options={mapOptions}
        onChange={handleMapChange}
      />
    </div>
  );
};

export default Map;

