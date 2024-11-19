import React, { useEffect, useState, useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import API from "../../API";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = { lat: 67.85766491972178, lng: 20.22771266622486 };

interface MapProps {
  documents: any[];
  pin: number;
  setNewPin: (id: number) => void;
  fetchDocuments: () => Promise<void>;
  setCoordMap: (coords: { lat: number; lng: number }) => void;
  adding: boolean;
  setAdding: (adding: boolean) => void;
  updating: boolean;
}

const DocumentMarkers: React.FC<{ documents: any[], handleDrag: (e: google.maps.MapMouseEvent, id: number) => void, setNewPin: (id: number) => void }> = ({ documents, handleDrag, setNewPin }) => {
  return (
    <>
      {documents.map((doc) => (
        doc.coordinates.coords && doc.coordinates.coords.lat && doc.coordinates.coords.lng && (
          <Marker
            key={doc.id}
            position={{ lat: doc.coordinates.coords.lat, lng: doc.coordinates.coords.lng }}
            draggable={true}
            onDragEnd={(e) => handleDrag(e, doc.id)}
            onClick={() => setNewPin(doc.id)}
          />
        )
      ))}
    </>
  );
};

const DocumentPolygons: React.FC<{ documents: any[], onPolygonClick: (e: google.maps.MapMouseEvent, id: number) => void }> = ({ documents, onPolygonClick }) => {
  return (
    <>
      {documents.map((doc) => (
        doc.coordinates.type === "POLYGON" && doc.coordinates.coords && (
          <Polygon
            key={doc.id}
            paths={doc.coordinates.coords.coordinates}
            options={{
              fillColor: "lightblue",
              fillOpacity: 0.4,
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onClick={(e) => onPolygonClick(e, doc.id)}
          />
        )
      ))}
    </>
  );
};

const MyMap: React.FC<MapProps> = ({ documents, pin, setNewPin, fetchDocuments, setCoordMap, adding, setAdding, updating }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [mapOptions, setMapOptions] = useState({
    fullscreenControl: false,
    mapTypeControl: true,
    mapTypeId: 'satellite' // Imposta il tipo di mappa iniziale su "satellite"
  });
  const [zoom, setZoom] = useState(12);

  const handleDrag = useCallback(async (e: google.maps.MapMouseEvent, id: number) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat !== undefined && lng !== undefined) {
      await API.updateCoordinates(id, new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(lat, lng)));
      await fetchDocuments();
    }
  }, [fetchDocuments]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (adding || updating) {
      const c = { lat: e.latLng?.lat()!, lng: e.latLng?.lng()! };
      setCoordMap(c);
    }
  }, [adding, updating, setCoordMap]);

  const onPolygonClick = useCallback((e: google.maps.MapMouseEvent, id: number) => {
    if (adding || updating) {
      onMapClick(e);
    } else {
      setNewPin(id);
    }
  }, [onMapClick, setNewPin, adding, updating]);

  useEffect(() => {
    documents.map((doc) => {
      console.log("Coordinates updated MAP:", doc.coordinates);
    });
  }, [documents]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onClick={onMapClick}
      >
        <DocumentMarkers documents={documents} handleDrag={handleDrag} setNewPin={setNewPin} />
        <DocumentPolygons documents={documents} onPolygonClick={onPolygonClick} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMap;