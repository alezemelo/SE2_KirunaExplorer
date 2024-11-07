import React, { useEffect, useState, useCallback } from "react";
import GoogleMapReact, { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import DocumentMarker from "./DocMarkers";
import { DocumentType, Coordinates } from "../../type" // Import from types.ts
import "./Map.css";

interface MapProps {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  fetchDocuments: () => Promise<void>;
}

const Map: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, setDocuments, documents }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [mapOptions, setMapOptions] = useState<MapOptions>({
    fullscreenControl: false,
    mapTypeControl: true,
  });
  const [zoom, setZoom] = useState(12);

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

  const handleMapChange = (e: ChangeEventValue) => {
    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
    setZoom(e.zoom);
  };



 useEffect(() => {
  documents.map((doc) => {
    console.log("Coordinates updated MAP:", doc.coordinates);
  });
  
  
 }, [documents]); 

  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" }}
        center={coordinates}
        zoom={zoom}
        options={mapOptions}
        onChange={handleMapChange}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {documents.map((doc) => {
          if (doc.coordinates && doc.coordinates.lat && doc.coordinates.lng) {
            return (
              <DocumentMarker
                key={doc.id}
                lat={doc.coordinates.lat}
                lng={doc.coordinates.lng}
                title={doc.title}
              />
            );
          }
          return null; // Return null if coordinates are undefined or incomplete
        })}
      </GoogleMapReact>
    </div>
  );
};

export default Map;






