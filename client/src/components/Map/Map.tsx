import React, { useState, useEffect } from "react";
import ReactMapGL, { ViewStateChangeEvent } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { Document } from "../../models/document";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Position } from "geojson";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"; // Replace with your Mapbox token


// // Fake documents with polygon data
// const fakeDocuments = [
//   {
//     id: 1,
//     title: "Polygon Document 1",
//     coordinates: {
//       type: "POLYGON",
//       coordinates: [
//         [
//           [20.2205, 67.8550],
//           [20.2230, 67.8550],
//           [20.2230, 67.8530],
//           [20.2205, 67.8530],
//           [20.2205, 67.8550], // Close the polygon
//         ],
//       ],
//     },
//   },
//   {
//     id: 2,
//     title: "Polygon Document 2",
//     coordinates: {
//       type: "POLYGON",
//       coordinates: [
//         [
//           [20.2250, 67.8560],
//           [20.2280, 67.8560],
//           [20.2280, 67.8540],
//           [20.2250, 67.8540],
//           [20.2250, 67.8560], // Close the polygon
//         ],
//       ],
//     },
//   },
// ];

interface MapProps {
  documents: Document[];
}


const Map: React.FC<MapProps> = (props) => {  const [viewport, setViewport] = useState({
    latitude: 67.85394,
    longitude: 20.222309,
    zoom: 12,
  });

  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/satellite-streets-v11"
  );
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const toggleMapStyle = () => {
    setMapStyle((prevStyle) =>
      prevStyle === "mapbox://styles/mapbox/satellite-streets-v11"
        ? "mapbox://styles/mapbox/streets-v11"
        : "mapbox://styles/mapbox/satellite-streets-v11"
    );
  };

  const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
    props.documents.forEach((doc) => {
      if (doc.getCoordinates()?.getType() === "POLYGON" && doc.getCoordinates()?.getCoords()) {
        const sourceId = `polygon-${doc.id}`;

        // Remove existing source and layers if already present
        if (mapInstance.getSource(sourceId)) {
          mapInstance.removeLayer(sourceId);
          mapInstance.removeSource(sourceId);
        }

        mapInstance.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: doc.getCoordinates()?.getAsPositionArray() as Position[][],
            },
            properties: {
              title: doc.title,
            },
          },
        });

        mapInstance.addLayer({
          id: sourceId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "rgba(0, 0, 255, 0.3)",
            "fill-outline-color": "blue",
          },
        });

        mapInstance.addLayer({
          id: `${sourceId}-outline`,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "blue",
            "line-width": 2,
          },
        });
      }
    });
  };

  useEffect(() => {
    if (!map) return;

    // Add polygons initially
    addPolygonsToMap(map);

    // Re-add polygons after style change
    const handleStyleData = () => {
      addPolygonsToMap(map);
    };

    map.on("styledata", handleStyleData);

    return () => {
      map.off("styledata", handleStyleData);
    };
  }, [map]);

  const onMove = (event: ViewStateChangeEvent) => {
    setViewport(event.viewState);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapboxAccessToken="pk.eyJ1IjoiYWxlemVtZWxvIiwiYSI6ImNtM3NyY2Q5bTAwbWIyanM5dHI5ZDB5bDAifQ.DGkcqcS5WKlEspQ4IHCbiA"
        mapStyle={mapStyle}
        onMove={onMove}
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
