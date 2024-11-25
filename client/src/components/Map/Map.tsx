import React, { useState, useEffect } from "react";
import ReactMapGL, { ViewStateChangeEvent } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { Document, DocumentJSON } from "../../models/document";
import { Position } from "geojson";

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
if (!accessToken) {
  console.error("Mapbox access token is missing!");
}
mapboxgl.accessToken = accessToken!;

interface MapProps {
  documents: Document[];
  isDocumentListOpen: boolean; // Add this prop to track sidebar state
  pin: number;
  setNewPin: (id: number) => void;
}

const Map: React.FC<MapProps> = (props) => {
  const [viewport, setViewport] = useState({
    latitude: 67.85394,
    longitude: 20.222309,
    zoom: 12,
  });

  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/satellite-streets-v11"
  );
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [buttonText, setButtonText] = useState("Switch to Street View");


  const toggleMapStyle = () => {
    setMapStyle((prevStyle) => {
      const newStyle =
        prevStyle === "mapbox://styles/mapbox/satellite-streets-v11"
          ? "mapbox://styles/mapbox/traffic-night-v2"
          : "mapbox://styles/mapbox/satellite-streets-v11";

      setButtonText(
        newStyle === "mapbox://styles/mapbox/satellite-streets-v11"
          ? "Switch to Street View"
          : "Switch to Satellite View"
      );

      return newStyle;
    });
  };

  useEffect(() => {
    if (!map) return;

    // Call resize on the map instance whenever `isDocumentListOpen` changes
    map.resize();
  }, [props.isDocumentListOpen, map]);


  const addMarkersToMap = (mapInstance: mapboxgl.Map) => {
    console.log("Adding markers to map:", props.documents);

    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
      if (doc.getCoordinates()?.getType() !== "POINT") {
        return; // Skip non-POINT documents
      }

      const pointCoords = doc.getCoordinates()?.getLatLng();

      if (!pointCoords || pointCoords.lat === null || pointCoords.lng === null) {
        console.error(`Document ${doc.id} does not have valid POINT coordinates.`);
        return;
      }

      // Add marker with popup
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([pointCoords.lng, pointCoords.lat])
        .addTo(mapInstance);

      marker.getElement()?.addEventListener("click", () => {
        props.setNewPin(doc.id); // Set the new pin when marker is clicked
      });
    });
  };

  const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
    console.log("Adding polygons to map:", props.documents);

    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
      if (doc.getCoordinates()?.getType() !== "POLYGON") {
        console.error(`Document ${doc.id} does not have POLYGON coordinates.`);
        return;
      }

      const polygonCoords = doc.getCoordinates()?.getAsPositionArray() as Position[][];

      const sourceId = `polygon-${doc.id}`;
      if (mapInstance.getSource(sourceId)) {
        (mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: polygonCoords },
          properties: { title: doc.title },
        });
        return;
      }

      console.log("Adding new source and layer for polygon:", sourceId);
      mapInstance.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: polygonCoords },
          properties: { title: doc.title },
        },
      });

      mapInstance.addLayer({
        id: sourceId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.3,
        },
      });
    });
  };

  useEffect(() => {
    if (!map) return;

    const handleStyleLoad = () => {
      console.log("Style loaded; adding markers and polygons.");
      addMarkersToMap(map);
      addPolygonsToMap(map);
    };

    map.on("styledata", handleStyleLoad);

    return () => {
      map.off("styledata", handleStyleLoad);
    };
  }, [map, props.documents]);

  useEffect(() => {
    if (!map || !props.documents) return;

    // Re-add markers and polygons whenever the map style changes
    addMarkersToMap(map);
    addPolygonsToMap(map);
  }, [map, mapStyle, props.documents]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyle}
        onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
        onLoad={(event) => setMap(event.target as mapboxgl.Map)}
      >
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
          <button onClick={toggleMapStyle}>{buttonText}</button>
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
