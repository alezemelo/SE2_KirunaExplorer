import React, { useEffect, useRef, useCallback } from "react";
import { GoogleMap, Polygon, Marker } from "@react-google-maps/api";
import { Coordinates, CoordinatesAsPoint, CoordinatesType,CoordinatesAsPolygon } from "../../models/coordinates";
import API from "../../API";

const containerStyle = {
  width: "100%",
  height: "90%",
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

const MyMap: React.FC<MapProps> = ({
  documents,
  pin,
  setNewPin,
  fetchDocuments,
  setCoordMap,
  adding,
  setAdding,
  updating,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const tempMarkerRef = useRef<google.maps.Marker | null>(null);

  const handleDrag = useCallback(
    async (id: number, lat: number, lng: number) => {
      const newCoords = new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(lat, lng));
      await API.updateCoordinates(id, newCoords);
      await fetchDocuments();
    },
    [fetchDocuments]
  );

  const initializeMarkers = useCallback(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each document
    documents.forEach((doc) => {
      if (doc.coordinates.type === "POINT" && doc.coordinates.coords) {
        const { lat, lng } = doc.coordinates.coords;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          title: doc.title,
          draggable: true,
        });

        marker.addListener("click", () => setNewPin(doc.id));
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) {
            handleDrag(doc.id, position.lat(), position.lng());
          }
        });

        markersRef.current.push(marker);
      }
    });
  }, [documents, handleDrag, setNewPin]);

  const renderPolygonsAndPoints = useCallback(() => {
    return documents.map((doc) => {
      if (doc.coordinates.type === CoordinatesType.POLYGON && doc.coordinates.coords instanceof CoordinatesAsPolygon) {
        const paths = doc.coordinates.coords.getCoordinates().map((point: CoordinatesAsPoint) => ({
          lat: point.getLat(),
          lng: point.getLng(),
        }));
  
        if (paths.length < 3) {
          console.warn(`Polygon for document ID ${doc.id} has less than 3 points. Skipping...`);
          return null;
        }
  
        return (
          <Polygon
            key={doc.id}
            paths={paths}
            options={{
              fillColor: "lightblue",
              fillOpacity: 0.4,
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        );
      } else if (doc.coordinates.type === CoordinatesType.POINT && doc.coordinates.coords instanceof CoordinatesAsPoint) {
        const { lat, lng } = doc.coordinates.coords;
  
        return (
          <Marker
            key={doc.id}
            position={{ lat, lng }}
            title={doc.title}
          />
        );
      } else {
        console.error(`Coordinates for document ID ${doc.id} are not valid. Skipping...`);
        return null;
      }
    });
  }, [documents]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!adding && !updating) return;

      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();

      if (lat !== undefined && lng !== undefined) {
        setCoordMap({ lat, lng });

        // Add a temporary marker to indicate the selected location
        if (tempMarkerRef.current) {
          tempMarkerRef.current.setMap(null);
        }

        tempMarkerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current!,
          title: "Selected Location",
        });
      }
    },
    [adding, updating, setCoordMap]
  );

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(document.getElementById("map-container") as HTMLElement, {
        center,
        zoom: 12,
        mapTypeId: "satellite",
        fullscreenControl: false,
        mapTypeControl: true,
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      initializeMarkers();
    }
  }, [documents, initializeMarkers]);

  return (
    <div id="map-container" style={containerStyle} onClick={() => mapRef.current?.addListener('click', onMapClick)}>
      {renderPolygonsAndPoints()}
    </div>
  );
};

export default MyMap;


