import React, { useEffect, useState, useCallback } from "react";
import  { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import DocumentMarker from "./DocMarkers";
import { DocumentType, Coordinates } from "../../type" // Import from types.ts
import "./Map.css";
import {AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, MapControl, Pin} from "@vis.gl/react-google-maps";
import API from "../../API";
import { Padding, Style } from "@mui/icons-material";


interface MapProps {
  setCoordinates: (coordinates: Coordinates) => void;
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  fetchDocuments: () => Promise<void>;
  pin: number,
  setPin: any;
}

const MyMap: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, setDocuments, documents,pin, setPin, fetchDocuments }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [mapOptions, setMapOptions] = useState<MapOptions>({
    fullscreenControl: false,
    mapTypeControl: true,
  });
  const [zoom, setZoom] = useState(12);
  const [open, setOpen] = useState(0);

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

  const center = {lat: 67.85766491972178,lng: 20.22771266622486}

const handleDrag = async (e: google.maps.MapMouseEvent, id:number) => {
  const lat = e.latLng?.lat();
  const lng = e.latLng?.lng();
  if (lat !== undefined && lng !== undefined) {
    setCoordinates({ lat, lng });
    await API.updateCoordinates(id, lat.toString(), lng.toString())
    await fetchDocuments();
  }
}





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
      <Map zoom={zoom} center={coordinates} mapId={"590615088799a724"} onZoomChanged={(e)=>setZoom(e.map.getZoom()??zoom)} onCenterChanged={(e)=>{
        const c = e.map.getCenter();
        const lat = c ? c.lat() : coordinates.lat; 
        const lng = c ? c.lng() : coordinates.lng;
        setCoordinates({ lat, lng })}}
        onBoundsChanged={(e)=>{
          const newBounds = e.map.getBounds();
      if (newBounds) {
        const northEast = newBounds.getNorthEast();
        const southWest = newBounds.getSouthWest();
        setBounds({
          ne: {
            lat: northEast.lat(),
            lng: northEast.lng(),
          },
          sw: {
            lat: southWest.lat(),
            lng: southWest.lng(),
          },
        });}
        }}
        >
      {documents.map((doc) => {
          if (doc.coordinates && doc.coordinates.lat && doc.coordinates.lng) {
            return (
              <>
              <AdvancedMarker key={doc.id} position={{lat: doc.coordinates.lat,lng: doc.coordinates.lng}} onDragEnd={(e) => handleDrag(e,doc.id)} onClick={()=>{setPin(doc.id)}} >
                <Pin scale={doc.id != pin ? 1:1.5}/>
              </AdvancedMarker>
              {open==doc.id && <InfoWindow position={{lat: doc.coordinates.lat, lng: doc.coordinates.lng}} onCloseClick={()=>setOpen(0)}>
                <div style={{color: 'black'}}><p><b>Title: </b>{doc.title} </p></div>
                </InfoWindow>}
              </>
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






