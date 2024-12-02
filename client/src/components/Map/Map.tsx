import React, { useEffect, useState, useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import API from "../../API";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";
import { useLocation } from "react-router-dom";

const containerStyle = {
  width: '100%',
  height: '90%',
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

const DocumentMarkers: React.FC<{ 
  documents: any[], 
  handleDrag: (e: google.maps.MapMouseEvent, id: number) => void, 
  setNewPin: (id: number) => void, 
  pin: number 
}> = ({ documents, handleDrag, setNewPin, pin }) => {
  const createIcon = (selected: boolean) => {
    return {
      url: selected
        ? "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
        : "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
      scaledSize: new window.google.maps.Size(selected ? 50 : 40, selected ? 50 : 40),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(25, 50),
    };
  };

  return (
    <>
      {documents && documents.map((doc) => (
        doc.coordinates.coords && doc.coordinates.coords.lat && doc.coordinates.coords.lng && (
          <Marker
            key={doc.id}
            position={{ lat: doc.coordinates.coords.lat, lng: doc.coordinates.coords.lng }}
            draggable={true}
            onDragEnd={(e) => handleDrag(e, doc.id)}
            onClick={() => setNewPin(doc.id)}
            icon={createIcon(doc.id === pin)}
          />
        )
      ))}
    </>
  );
};

const DocumentPolygons: React.FC<{ 
  documents: any[], 
  onPolygonClick: (e: google.maps.MapMouseEvent, id: number) => void 
}> = ({ documents, onPolygonClick }) => {
  return (
    <>
      {documents && documents.map((doc) => (
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
    mapTypeId: 'satellite'
  });
  const [zoom, setZoom] = useState(12);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    console.log("Documents updated MAP:", documents);

   
  }, [documents])

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
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onClick={onMapClick}
        onLoad={() => setIsMapLoaded(true)}
      >
        {!isMapLoaded && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', color: '#000' }}>
            Loading Map...
          </div>
        )}
        <DocumentMarkers
          documents={documents}
          handleDrag={handleDrag}
          setNewPin={setNewPin}
          pin={pin}
        />
        <DocumentPolygons documents={documents} onPolygonClick={onPolygonClick} />
      </GoogleMap>
    </div>
  );
};

export default MyMap;

