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
}

const Map: React.FC<MapProps> = (props) => {
  const [viewport, setViewport] = useState({
    latitude: 67.85394,
    longitude: 20.222309,
    zoom: 12,
  });

  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v11");
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const toggleMapStyle = () => {
    setMapStyle((prevStyle) =>
      prevStyle === "mapbox://styles/mapbox/satellite-streets-v11"
        ? "mapbox://styles/mapbox/streets-v11"
        : "mapbox://styles/mapbox/satellite-streets-v11"
    );
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
        // Update existing source
        (mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: polygonCoords },
          properties: { title: doc.title },
        });
        return;
      }

      // Add source and layer if not already present
      if (mapInstance.isStyleLoaded()) {
        console.log("Adding new source:", sourceId);
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
            "fill-color": "#FF0000", // Ensure visible color
            "fill-opacity": 0.6,
          },
        });
      } else {
        // Delay until style is loaded
        mapInstance.once("styledata", () => addPolygonsToMap(mapInstance));
      }
    });
  };

  useEffect(() => {
    if (!map || !props.documents) return;

    const handleStyleLoad = () => {
      console.log('Style loaded; adding polygons.');
      addPolygonsToMap(map);
    };

    if (map.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      map.on("styledata", handleStyleLoad);
    }
  
    return () => {
      map.off("styledata", handleStyleLoad);    };
  },[map, props.documents, mapStyle]);
    


  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyle}
        onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
        onLoad={(event) => setMap(event.target as mapboxgl.Map)}
      >
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
          <button onClick={toggleMapStyle}>Toggle Satellite View</button>
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
