import React, { useState, useEffect } from "react";
import ReactMapGL, { ViewStateChangeEvent } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { Document, DocumentJSON } from "../../models/document";
import { Position } from "geojson";
import * as turf from "@turf/turf";
import { feature, point } from "@turf/turf";

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
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
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


  // const addMarkersToMap = (mapInstance: mapboxgl.Map) => {
  //   console.log("Adding markers to map:", props.documents);

  //   props.documents.forEach((doc) => {
  //     doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
  //     if (doc.getCoordinates()?.getType() !== "POINT") {
  //       return; // Skip non-POINT documents
  //     }

  //     const pointCoords = doc.getCoordinates()?.getLatLng();

  //     if (!pointCoords || pointCoords.lat === null || pointCoords.lng === null) {
  //       console.error(`Document ${doc.id} does not have valid POINT coordinates.`);
  //       return;
  //     }

  //     // Add marker with popup
  //     const marker = new mapboxgl.Marker({ color: "red" })
  //       .setLngLat([pointCoords.lng, pointCoords.lat])
  //       .addTo(mapInstance);

  //     marker.getElement()?.addEventListener("click", () => {
  //       props.setNewPin(doc.id); // Set the new pin when marker is clicked
  //     });
  //   });
  // };
  // const addMarkersToMap = (mapInstance: mapboxgl.Map) => {
  //   console.log("Adding markers to map:", props.documents);
  
  //   props.documents.forEach((doc) => {
  //     doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
  
  //     if (doc.getCoordinates()?.getType() !== "POINT") {
  //       return; // Skip non-POINT documents
  //     }
  
  //     const pointCoords = doc.getCoordinates()?.getLatLng();
  
  //     if (!pointCoords || pointCoords.lat === null || pointCoords.lng === null) {
  //       console.error(`Document ${doc.id} does not have valid POINT coordinates.`);
  //       return;
  //     }
  
  //     // Add marker with popup
  //     const marker = new mapboxgl.Marker({ color: "red" })
  //       .setLngLat([pointCoords.lng, pointCoords.lat])
  //       .addTo(mapInstance);
  
  //     // Marker click handler to display the area
  //     marker.getElement()?.addEventListener("click", () => {
  //       console.log(`Marker for Document ${doc.id} clicked`);
  
  //       // Remove any previous area layer
  //       const areaLayerId = `area-layer-${doc.id}`;
  //       if (mapInstance.getSource(areaLayerId)) {
  //         mapInstance.removeLayer(areaLayerId);
  //         mapInstance.removeSource(areaLayerId);
  //       }
  
  //       // Add a circular area (e.g., 500m radius) around the point
  //       const radiusInMeters = 500;
  //       if (pointCoords.lng !== null && pointCoords.lat !== null) {
  //         const circleFeature = turf.point([pointCoords.lng, pointCoords.lat]);

  //       const circle = turf.circle(circleFeature, radiusInMeters / 1000, {
  //         steps: 64,
  //         units: "kilometers",
  //       });
  
  //       mapInstance.addSource(areaLayerId, {
  //         type: "geojson",
  //         data: circle,
  //       });
  
  //       mapInstance.addLayer({
  //         id: areaLayerId,
  //         type: "fill",
  //         source: areaLayerId,
  //         paint: {
  //           "fill-color": "#007cbf",
  //           "fill-opacity": 0.4,
  //         },
  //       });
  
  //       // Zoom to the area
  //       mapInstance.fitBounds(turf.bbox(circle) as mapboxgl.LngLatBoundsLike, {
  //         padding: 20,
  //         });
  //       }
  //     })
  //   })
  // };  
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
  
      // Add marker to the map
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([pointCoords.lng, pointCoords.lat])
        .addTo(mapInstance);
  
      // Add a popup with the document's title and details
      const popup = new mapboxgl.Popup({ offset: 25 }) // Offset for better positioning
        .setHTML(
          `<div style="font-size: 14px; color: black;">
            <strong>${doc.title}</strong><br />
            ${doc.description ? doc.description : "No description available."}
          </div>`
        );
  
      // Attach popup and setNewPin to marker click
      marker.getElement()?.addEventListener("click", () => {
        console.log(`Marker for Document ${doc.id} clicked`);
        
        // Show the popup
        if (pointCoords.lng !== null && pointCoords.lat !== null) {
          popup.addTo(mapInstance).setLngLat([pointCoords.lng, pointCoords.lat]);
        }
  
        // Call setNewPin to handle additional actions when a marker is clicked
        props.setNewPin(doc.id);
      });
    });
  };
  
  
  // // const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
  //   console.log("Adding polygons to map:", props.documents);

  //   props.documents.forEach((doc) => {
  //     doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
  //     if (doc.getCoordinates()?.getType() !== "POLYGON") {
  //       console.error(`Document ${doc.id} does not have POLYGON coordinates.`);
  //       return;
  //     }

  //     const polygonCoords = doc.getCoordinates()?.getAsPositionArray() as Position[][];

  //     const sourceId = `polygon-${doc.id}`;
  //     if (mapInstance.getSource(sourceId)) {
  //       (mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
  //         type: "Feature",
  //         geometry: { type: "Polygon", coordinates: polygonCoords },
  //         properties: { title: doc.title },
  //       });
  //       return;
  //     }

  //     console.log("Adding new source and layer for polygon:", sourceId);
  //     mapInstance.addSource(sourceId, {
  //       type: "geojson",
  //       data: {
  //         type: "Feature",
  //         geometry: { type: "Polygon", coordinates: polygonCoords },
  //         properties: { title: doc.title },
  //       },
  //     });

  //     mapInstance.addLayer({
  //       id: sourceId,
  //       type: "fill",
  //       source: sourceId,
  //       paint: {
  //         // make color random
          
  //         "fill-color": getRandomColor(),
  //         "fill-opacity": 0.3,
  //       },
  //     });
  //   });
  // };
  const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
    console.log("Adding polygons to map as points:", props.documents);
  
    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
      if (doc.getCoordinates()?.getType() !== "POLYGON") {
        return; // Skip non-POLYGON documents
      }
  
      const polygonCoords = doc.getCoordinates()?.getAsPositionArray() as Position[][];
      if (!polygonCoords || polygonCoords.length === 0) {
        console.error(`Document ${doc.id} does not have valid POLYGON coordinates.`);
        return;
      }
  
      // Calculate the centroid of the polygon
      const polygonFeature = turf.polygon(polygonCoords);
      const centroid = turf.centroid(polygonFeature);
  
      const centroidCoords = centroid.geometry.coordinates;
  
      // Add marker at the centroid
      const marker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat(centroidCoords as [number, number])
        .addTo(mapInstance);
  
      // Marker click handler to display the polygon
      marker.getElement()?.addEventListener("click", () => {
        console.log(`Centroid marker for Polygon Document ${doc.id} clicked`);
  
        const sourceId = `polygon-${doc.id}`;
        if (mapInstance.getSource(sourceId)) {
          // Remove the polygon if it already exists
          mapInstance.removeLayer(sourceId);
          mapInstance.removeSource(sourceId);
          return;
        }
  
        // Add the polygon layer
        mapInstance.addSource(sourceId, {
          type: "geojson",
          data: polygonFeature,
        });
  
        mapInstance.addLayer({
          id: sourceId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#FF5733", // Highlight the polygon with a distinct color
            "fill-opacity": 0.5,
          },
        });
  
        // Zoom to the polygon
        mapInstance.fitBounds(turf.bbox(polygonFeature) as mapboxgl.LngLatBoundsLike, {
          padding: 20,
        });
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
