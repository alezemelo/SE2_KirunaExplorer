import React, { useState } from "react";
import GoogleMapReact, { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import DocumentMarker from "./DocMarkers";
import "./Map.css";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Document {
  lat: string;
  lng: string;
  title: string;
}

interface MapProps {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;
  documents: Document[];
}

const Map: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, documents }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  // State for map options and zoom level
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    fullscreenControl: false,
    mapTypeControl: true,
  });
  const [zoom, setZoom] = useState(12); // Set initial zoom level

  // Update map options when API loads
  const handleApiLoaded = (map: any, maps: any) => {
    setMapOptions({
      fullscreenControl: false,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.DEFAULT,
        position: maps.ControlPosition.TOP_RIGHT,
      },
    });
  };

  // Handle map changes, including zoom updates
  const handleMapChange = (e: ChangeEventValue) => {
    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
    setZoom(e.zoom); // Update zoom level in state
  };

  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" }}
        center={coordinates}
        zoom={zoom} // Bind zoom level to state
        options={mapOptions}
        onChange={handleMapChange}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {documents.map((document, index) => (
          <DocumentMarker
            key={`${index}-${zoom}`} // Include zoom in key to force re-render on zoom change
            lat={parseFloat(document.lat)}
            lng={parseFloat(document.lng)}
            text={document.title}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;




