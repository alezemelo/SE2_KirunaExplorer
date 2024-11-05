import React, { useState } from "react";
import GoogleMapReact, { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import DocumentMarker from "./DocMarkers";
import "./Map.css";

// Interfaccia per le coordinate
export interface Coordinates {
  lat: number;
  lng: number;
}

// Interfaccia per i documenti
interface Document {
  id: number;
  title: string;
  coordinates: Coordinates; 
}

interface MapProps {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;
  documents: Document[];
}

const Map: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, documents }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  // Stato per le opzioni della mappa e livello di zoom
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    fullscreenControl: false,
    mapTypeControl: true,
  });
  const [zoom, setZoom] = useState(12); // Imposta il livello di zoom iniziale

  // Aggiorna le opzioni della mappa quando l'API è caricata
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

  // Gestisce i cambiamenti della mappa, compreso l'aggiornamento dello zoom
  const handleMapChange = (e: ChangeEventValue) => {
    // Aggiorna le coordinate con latitudine e longitudine
    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
    setZoom(e.zoom); // Aggiorna il livello di zoom nel stato
  };

  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" }} // La tua API Key di Google Maps
        center={coordinates}
        zoom={zoom} // Collega il livello di zoom allo stato
        options={mapOptions}
        onChange={handleMapChange}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {documents.map((document, index) => (
          <DocumentMarker
            key={`${index}-${zoom}`} // Aggiungi zoom alla chiave per forzare il re-rendering in caso di cambiamento dello zoom
            lat={document.coordinates.lat}
            lng={document.coordinates.lng}
            text={document.title}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;




