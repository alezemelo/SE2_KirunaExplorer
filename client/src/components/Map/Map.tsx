import React, { useEffect, useState, useCallback } from "react";
import  { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import DocumentMarker from "./DocMarkers";
import { DocumentType, Coordinates } from "../../type" // Import from types.ts
import "./Map.css";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";


interface MapProps {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  fetchDocuments: () => Promise<void>;
}

const MyMap: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, setDocuments, documents }) => {
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
    /*<div className="mapContainer">
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
    */
   <APIProvider apiKey="AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4">
    <div style={{height: "100vh"}}>
      <Map zoom={zoom} center={{lat: 67.85766491972178,lng: 20.22771266622486}} mapId={"590615088799a724"}>
      {documents.map((doc) => {
          if (doc.coordinates && doc.coordinates.lat && doc.coordinates.lng) {
            return (
              <AdvancedMarker key={doc.id} position={{lat: doc.coordinates.lat,lng: doc.coordinates.lng}}></AdvancedMarker>
            );
          }
          return null; // Return null if coordinates are undefined or incomplete
        })}
      </Map>
    </div>
   </APIProvider>
  );
};

export default MyMap;






