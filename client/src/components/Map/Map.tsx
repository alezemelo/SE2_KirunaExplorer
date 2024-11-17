import React, { useEffect, useState, useCallback } from "react";
import  { ChangeEventValue, MapOptions } from "google-map-react";
import { useMediaQuery } from "@mui/material";
import DocumentMarker from "./DocMarkers";
import "./Map.css";
import {AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, MapControl, MapMouseEvent, Pin} from "@vis.gl/react-google-maps";
import API from "../../API";
import { Padding, Style } from "@mui/icons-material";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";



interface MapProps {
  //setCoordinates: (coordinates: Coordinates) => void;
  /*setBounds: (bounds: { ne: Coordinates; sw: Coordinates } | null) => void;
  coordinates: Coordinates;*/
  documents: any[];
  //setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  fetchDocuments: () => Promise<void>;
  pin: number,
  setNewPin: any;
  //coordMap?: Coordinates;
  setCoordMap: any;
  adding: boolean; 
  setAdding:any;
}

const MyMap: React.FC<MapProps> = ({/* setCoordinates,*//* setBounds, coordinates, setDocuments,*/ documents,pin, setNewPin, fetchDocuments, /*coordMap,*/ setCoordMap, adding, setAdding }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [mapOptions, setMapOptions] = useState<MapOptions>({
    fullscreenControl: false,
    mapTypeControl: true,
  });
  const [zoom, setZoom] = useState(12);
  const [open, setOpen] = useState(0);

  /*const handleApiLoaded = (map: any, maps: any) => {
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
  };*/

  const center = {lat: 67.85766491972178,lng: 20.22771266622486}

  const handleDrag = async (e: google.maps.MapMouseEvent, id:number) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat !== undefined && lng !== undefined) {
      //setCoordinates({ lat, lng });
      await API.updateCoordinates(id, new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(lat,lng)))
      await fetchDocuments();
    }
  }


const onMapClick = (e: MapMouseEvent) => {
  console.log(adding)
  if(adding){
    const c={lat: e.detail.latLng?.lat, lng: e.detail.latLng?.lng}
    setCoordMap(c)
    console.log(c);
    //setAdding(false);
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
    </div>*/
    
   /*<APIProvider apiKey="AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'>
    <div style={{height: "100vh"}}>
      <Map zoom={10} center={{lat: 43.64, lng: -79.41}} 
      gestureHandling={'greedy'}
      disableDefaultUI={true}
        >

      </Map>
    </div>
   </APIProvider>*/

   <APIProvider
    solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
    apiKey="AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4">
      <div style={{height: "100vh"}}>
    <Map
    mapTypeId="satellite"
      defaultZoom={12}
      defaultCenter={center}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      onClick={onMapClick}
      mapId="590615088799a724"
    >
      {documents.map((doc) => {
          if (doc.coordinates.coords && doc.coordinates.coords.lat && doc.coordinates.coords.lng) {
            return (
              <AdvancedMarker position={doc.coordinates.coords} onDragEnd={(e) => handleDrag(e,doc.id)} onClick={()=>{setNewPin(doc.id)}} >
                <Pin scale={doc.id != pin ? 1:1.5}/>
                </AdvancedMarker>
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






