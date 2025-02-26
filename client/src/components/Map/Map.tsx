/* eslint-disable @typescript-eslint/no-explicit-any */
// There was old commented code here. If you want to see it again, check commits before 2024/09/12

import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMapGL, { Layer, Source, ViewStateChangeEvent } from "react-map-gl";
import {Button, Typography } from "@mui/material";

import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import { Document, DocumentJSON } from "../../models/document";
import { Position } from "geojson";import * as turf from '@turf/turf';
import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from "../../models/coordinates";
import API from "../../API";
import * as fs from 'fs'
import { stringToColor } from "../../Utils/utils";
import { lightBlue } from "@mui/material/colors";
import overlayStyle from "../../ReactCssStyles";
import { point, booleanPointInPolygon, Coord } from '@turf/turf';
import Legend from "./Legend";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Coordinates as CoordinatesLocal } from "../../type";
import { polygon, booleanValid } from '@turf/turf';
import { Checkbox } from "@mui/material";
import cluster from "cluster";
import './Map.css';



const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
console.log(import.meta.env)
if (!accessToken) {
  console.error("Mapbox access token is missing!");
}
mapboxgl.accessToken = accessToken!;

interface MapProps {
  documents: Document[];
  isDocumentListOpen: boolean; // Add this prop to track sidebar state
  pin: number;
  loggedIn: boolean;
  setNewPin: (id: number) => void;
  isSelectingLocation: boolean; // If we are in "Choose on Map" mode
  onLocationSelected: (lat: number, lng: number) => void; // Callback for location selection
  adding: boolean;
  updating: boolean;
  setCoordMap: any;
  geojson: any;
  fetchDocuments: any;
  drawing: boolean;
  setDrawing: any;
  setPolygon: any;
  isMunicipalityChecked: boolean;
  removePolygon: boolean;
}

const Map: React.FC<MapProps> = (props) => {
  const [viewport, setViewport] = useState({
    latitude: 67.85394,
    longitude: 20.222309,
    zoom: 13,
  });

  interface DebounceFunction {
    (...args: any[]): void;
  }

  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/satellite-streets-v11"
  );
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [buttonText, setButtonText] = useState("Switch to Street View");
  const markersRef = useRef<{ id: number, marker: mapboxgl.Marker }[]>([]);
  const [confirmChanges, setConfirmChanges] = useState(false); //open the dialog for confirmation
  const [coordinatesInfo, setCoordinatesInfo] = useState<{id: number, coordinates:Coordinates}|undefined>(undefined); //informations for the coordinates for updating
  const [selectedMarker, setSelectedMarker] = useState<mapboxgl.Marker | null>(null);
  const centroidsRef = useRef<(mapboxgl.Marker | null)[]>([]);
  const [error,setError] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<number | null>(null);
  const [clusterZoomThreshold, setClusterZoomThreshold] = useState<number>(12); // Default cluster zoom level

  const mapRef = useRef<any>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  
  const generateGeoJSON = (): GeoJSON.FeatureCollection<GeoJSON.Geometry> => ({
    type: "FeatureCollection",
    features: props.documents.flatMap((doc) => {
      const coordinatesInstance =
        doc.coordinates instanceof Coordinates
          ? doc.coordinates
          : Coordinates.fromJSON(doc.coordinates);
  
      if (!coordinatesInstance) {
        console.warn(`Document ${doc.id} has no coordinates.`);
        return [];
      }
  
      if (coordinatesInstance.getType() === "POINT") {
        // Handle point coordinates
        const pointCoords = coordinatesInstance.getLatLng();
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [pointCoords?.lng ?? 0, pointCoords?.lat ?? 0],
          },
          properties: {
            id: doc.id,
            title: doc.title,
            description: doc.description || "No description available.",
          },
        };
      } else if (coordinatesInstance.getType() === "POLYGON") {
        // Handle polygon by calculating centroid
        const polygonCoords = coordinatesInstance.getAsPositionArray();
        const polygonFeature = turf.polygon(polygonCoords);
        const centroid = turf.centroid(polygonFeature);
  
        return {
          type: "Feature",
          geometry: centroid.geometry,
          properties: {
            id: doc.id,
            title: doc.title,
            description: doc.description || "No description available.",
          },
        };
      }
  
      return [];
    }),
  });

  const addClusteringLayers = (mapInstance: mapboxgl.Map) => {
    // Remove existing layers and sources if present
    if (mapInstance.getSource("documents-cluster-source")) {
      if (mapInstance.getLayer("clusters")) mapInstance.removeLayer("clusters");
      if (mapInstance.getLayer("cluster-count")) mapInstance.removeLayer("cluster-count");
      if (mapInstance.getLayer("unclustered-points")) mapInstance.removeLayer("unclustered-points");
      mapInstance.removeSource("documents-cluster-source");
    }
  
    // Add the GeoJSON source for clustering
    mapInstance.addSource("documents-cluster-source", {
      type: "geojson",
      data: generateGeoJSON(),
      cluster: true,
      clusterMaxZoom: 22, // Clusters disappear at zoom > 14
      clusterRadius: 100,  // Pixel radius of clusters
    });
  
    // Add the cluster layer
    mapInstance.addLayer({
      id: "clusters",
      type: "circle",
      source: "documents-cluster-source",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6", // Small clusters
          10,
          "#f1f075", // Medium clusters
          50,
          "#f28cb1", // Large clusters
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          40, // Small clusters
          10, 40, // Medium clusters
          50, 40, // Large clusters
        ],
      },
    });
  
    // Add a layer for cluster count
    mapInstance.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "documents-cluster-source",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 28,
      },
    });
  
    // Add the unclustered points layer
    mapInstance.addLayer({
      id: "unclustered-points",
      type: "circle",
      source: "documents-cluster-source",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 14,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });
  
    // Handle zoom-based visibility
    const handleZoom = () => {
      const zoomLevel = mapInstance.getZoom();
  
      if (zoomLevel > clusterZoomThreshold) {
        // Show markers and polygon markers, hide clusters
        mapInstance.setLayoutProperty("clusters", "visibility", "none");
        mapInstance.setLayoutProperty("cluster-count", "visibility", "none");
        mapInstance.setLayoutProperty("unclustered-points", "visibility", "none");

        addMarkersToMap(mapInstance);
  
        // Show polygon markers explicitly
        if (centroidsRef.current.length > 0) {
          centroidsRef.current.forEach((centroid) => {
            if (centroid) centroid.getElement().style.display = "block";
          });
        }
      } else {
        // Show clusters, hide markers and polygon markers
        mapInstance.setLayoutProperty("clusters", "visibility", "visible");
        mapInstance.setLayoutProperty("cluster-count", "visibility", "visible");
        mapInstance.setLayoutProperty("unclustered-points", "visibility", "visible");
        removeAllPolygons(mapInstance); // Remove polygons when zooming up

        // Clear manual markers
        markersRef.current.forEach(({ marker }) => marker.remove());
        markersRef.current = [];
  
        // Hide polygon markers explicitly
        if (centroidsRef.current.length > 0) {
          centroidsRef.current.forEach((centroid) => {
            if (centroid) centroid.getElement().style.display = "none";
          });
        }
      }
    };

    //following code to refresh layers when zooming or updating the map:

    // mapInstance.on("move",()=>{
    //   const source = mapInstance.getSource("documents-cluster-source");
    //   if (source) {
    //     (source as mapboxgl.GeoJSONSource).setData(generateGeoJSON());
    //   }
    // });

    

    // when click on cluster it shoudl zoom on that cluster

    mapInstance.on("click", "clusters", (e) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      if (!features[0] || !features[0].properties) return;
      const clusterId = features[0].properties.cluster_id;
      const source = mapInstance.getSource("documents-cluster-source") as mapboxgl.GeoJSONSource;
      if (!source || !source.getClusterExpansionZoom) return;
      source.getClusterExpansionZoom(
        clusterId,
        (err: any, zoom: any) => {
          if (err) return;
  
          if (!features[0].geometry || !('coordinates' in features[0].geometry)) return;
          mapInstance.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
            zoom: zoom,
          });
        }
      );
    });
  
    // Attach zoom event listener
    mapInstance.on("zoom", handleZoom);
  
    // Initial visibility based on current zoom level
    handleZoom();
  };
  
  
  // Attach clustering layers to the map
  useEffect(() => {
    if (!map) return;
  
    addClusteringLayers(map);
  }, [map, clusterZoomThreshold]);

  useEffect(() => {
    if (!map) return;
  
    const updateClusterSource = () => {
      const source = map.getSource("documents-cluster-source") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(generateGeoJSON());
      }
    };
  
    updateClusterSource(); // Update cluster source immediately on map load
  
    map.on("moveend", updateClusterSource); // Update cluster source after map moves or zooms
  
    return () => {
      map.off("moveend", updateClusterSource); // Cleanup listener
    };
  }, [map, props.documents]);

  useEffect(() => {
    if (!map || !props.documents || props.documents.length === 0) return;
  
    addClusteringLayers(map); // Add clustering only when data is available
  }, [map, props.documents]);
  
  

  useEffect(() => {
    if (map) {
      map.resize();
    }
  }, [props.isDocumentListOpen]);

  useEffect(() => {
    if (!map) return;
  
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });
  
    drawRef.current = draw;
  
    if (props.drawing) {
      map.addControl(draw);
  
      const handleDrawCreate = (e: any) => {
        const features = e.features;
        const geojsondata = features[0].geometry.coordinates[0];
        const data: CoordinatesAsPoint[] = [];
        for (let i = 0; i < geojsondata.length; i++) {
          data.push(new CoordinatesAsPoint(geojsondata[i][1], geojsondata[i][0]));
        }
        const coord = new CoordinatesAsPolygon(data);
        console.log(coord);
        props.setPolygon(data);
        props.setDrawing(false);
      };
  
      map.on("draw.create", handleDrawCreate);
  
      return () => {
        map.off("draw.create", handleDrawCreate);
        if (map.hasControl(draw)) {
          map.removeControl(draw);
        }
      };
    }
  }, [map, props.drawing]);
  
  const toggleMapStyle = () => {
    setMapStyle((prevStyle) => {
      const newStyle =
        prevStyle === "mapbox://styles/mapbox/satellite-streets-v11"
          ? "mapbox://styles/mapbox/traffic-day-v2"
          : "mapbox://styles/mapbox/satellite-streets-v11";

      setButtonText(
        newStyle === "mapbox://styles/mapbox/satellite-streets-v11"
          ? "Switch to Street View"
          : "Switch to Satellite View"
      );

      return newStyle;
    });
  };

  
  const removeAllPolygons = (mapInstance: mapboxgl.Map) => {
    const sources = mapInstance.getStyle()?.sources;
    if (sources) {
      Object.keys(sources).forEach((sourceId) => {
        if (sourceId.startsWith('polygon-')) {
          const polygons_doc_id = parseInt(sourceId.split('-')[1]);
          const layerId = `polygon-layer-${polygons_doc_id}`;

          // console.log(`Removing polygon source ${sourceId}. isMunicipalityChecked is ${props.isMunicipalityChecked}`);
          if (mapInstance.getLayer(layerId)) {
            mapInstance.removeLayer(layerId);
            mapInstance.removeSource(sourceId);
          }
        }
      });
    }
    // props.setNewPin(0); // Pins don't really work rn as intended so leave commented
  };


  /* Use Effect for removing the polygons when the checkbox is checked */
  useEffect(() => {
    if (!map) return;
  
    // console.log("isMunicipalityChecked is true. Removing all polygons, which are: ");
    removeAllPolygons(map);
  }, [props.isMunicipalityChecked, map, props.removePolygon]);

  

  const addMarkersToMap = (mapInstance: mapboxgl.Map) => {
    // Remove existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    // Function to check if two markers are close
  const isClose = (coords1: [number, number], coords2: [number, number], threshold: number) => {
    const distance = Math.sqrt(
      Math.pow(coords1[0] - coords2[0], 2) + Math.pow(coords1[1] - coords2[1], 2)
    );
    return distance < threshold;
  };

  // Adjust positions for markers that are close
  const adjustedPositions: [number, number][] = [];
  const offsetStep = 0.0001; // Adjust this value for more spacing
  
    // Loop through documents to add markers
    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
  
      if (doc.getCoordinates()?.getType() !== "POINT") {
        return; // Skip non-point coordinates
      }

      const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";

    // Add a circle element as a background
    const circle = document.createElement("div");
    circle.className = "marker-circle";
    markerElement.appendChild(circle);
  
      const pointCoords = doc.getCoordinates()?.getLatLng();
      if (!pointCoords || pointCoords.lat === null || pointCoords.lng === null) {
        console.error(`Document ${doc.id} does not have valid POINT coordinates.`);
        return;
      }

      let adjustedLat = pointCoords.lat;
      let adjustedLng = pointCoords.lng;

      // Check if this marker is too close to others
      adjustedPositions.forEach((existingPos) => {
        while (isClose([adjustedLng, adjustedLat], existingPos, 0.0002)) {
          adjustedLat += offsetStep; // Offset latitude slightly
          adjustedLng += offsetStep; // Offset longitude slightly
        }
      });

      // Save the adjusted position
      adjustedPositions.push([adjustedLng, adjustedLat]);
  
      // Highlight selected marker with scale
      //console.error("props.pin is ", props.pin);
      const isSelected = props.pin === doc.id;
      const markerColor = stringToColor(doc.type);
      const markerScale = 1;
  
      // Add marker to the map
      const marker = new mapboxgl.Marker({
        color: markerColor,
        scale: markerScale,
        draggable: true,
      })
        .setLngLat([pointCoords.lng, pointCoords.lat])
        .addTo(mapInstance);
  
      // Add to reference array
      markersRef.current.push({ id: doc.id, marker });

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false })
        .setHTML(`<div style="color: black; font-weight: bold;">${doc.title}</div>`);
      marker.getElement()?.addEventListener("mouseover", () => {
        marker.setPopup(popup);
        popup.addTo(mapInstance);
      })
      marker.getElement()?.addEventListener("mouseleave", () => {
        popup.remove();
      })
      // Add marker click listener to update the selected pin
      marker.getElement().addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from propagating
        props.setNewPin(isSelected ? 0 : doc.id); // Toggle selection
        // console.error("props.pin set to ", props.pin);
      });
  
      // Add dragend listener to update coordinates
      marker.on("dragend", (e) => {
        const currentLngLat = e.target.getLngLat();
        const coordinates = new Coordinates(
          CoordinatesType.POINT,
          new CoordinatesAsPoint(currentLngLat.lat, currentLngLat.lng)
        );
  
        if (booleanPointInPolygon(point([currentLngLat.lng, currentLngLat.lat]), props.geojson.features[0])) {
          setCoordinatesInfo({ id: doc.id, coordinates });
        } else {
          setError("Marker out of Kiruna municipality");
        }
        setConfirmChanges(true);
      });
  
      // Automatically zoom to the selected marker
      if (isSelected) {
        const markerLngLat = marker.getLngLat();
        mapInstance.flyTo({
          center: [markerLngLat.lng, markerLngLat.lat],
          zoom: 14,
          speed: 1.5,
        });
      }
    });
  };
  
  
  useEffect(() => {
    /*if (!markersRef.current) return;
    const selectedMarker = markersRef.current.find((item) => item.id === props.pin);
    if (selectedMarker?.marker.getElement()) {
      markersRef.current.forEach((item) => {
        if (item.marker.getElement()) {
          item.marker.getElement().style.transform = 'scale(1)';
        }
      });
      selectedMarker.marker.getElement().style.transform = 'scale(2)';
    }*/
   if(!map) return;
   console.log("pin: "+props.pin)
    addMarkersToMap(map);
    addPolygonsToMap(map);
  }, [props.pin]);
  

  const handleDrag = async (id:number,coordinates:Coordinates) => {
    if(coordinatesInfo && error==''){
      await API.updateCoordinates(id,coordinates);
      await props.fetchDocuments();
      
    }
    setConfirmChanges(false)
  }
     
     
  
  const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
    //console.log("Adding polygons to map as points:", props.documents);
  
    // Remove existing centroid markers
    centroidsRef.current.forEach((centroid) => centroid?.remove());
    centroidsRef.current = [];
  
    // Loop through all documents
    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
  
      // Skip non-POLYGON documents
      if (doc.getCoordinates()?.getType() !== "POLYGON") {
        return;
      }
  
      const polygonCoords = doc.getCoordinates()?.getAsPositionArray() as Position[][];
      if (!polygonCoords || polygonCoords.length === 0) {
        console.error(`Document ${doc.id} does not have valid POLYGON coordinates.`);
        return;
      }

      function offsetCoordinates(coord: [number, number], index: number, offsetAmount = 0.0001): [number, number] {
        const [lng, lat] = coord;
        const offsetLng = (index % 3 - 1) * offsetAmount; // Ciclo: -offsetAmount, 0, +offsetAmount
        const offsetLat = Math.floor(index / 3) * offsetAmount; // Cambia ad ogni ciclo di 3 elementi
        return [lng + offsetLng, lat + offsetLat];
      }
  
      // Calculate the centroid of the polygon
      const polygonFeature = turf.polygon(polygonCoords);
      const centroid = turf.centroid(polygonFeature);
      const centroidCoords = centroid.geometry.coordinates;

      const polygonIndex = documents.findIndex(p => p.id === doc.id);
      const offsetCentroidCoords = offsetCoordinates(centroidCoords as [number, number], polygonIndex);
  
      // Add a marker at the centroid
      //const isSelected = selectedPolygon === doc.id; // Check if this polygon is selected
      //const markerColor = isSelected ? "red" : "blue";
  
      const marker = new mapboxgl.Marker({ color: /*markerColor*/ stringToColor(doc.type), draggable: false })
        .setLngLat(offsetCentroidCoords)
        .addTo(mapInstance);
  
      // Store the marker for cleanup later
      centroidsRef.current.push(marker);

      /*if(props.pin == 0){// Create or update the polygon source and layer
      const sourceId = `polygon-${doc.id}`;
      const layerId = `polygon-layer-${doc.id}`;

      // Remove existing layer if already added
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
        mapInstance.removeSource(sourceId);
      }}*/

      if(props.pin == doc.id){// Create or update the polygon source and layer
      const sourceId = `polygon-${doc.id}`;
      const layerId = `polygon-layer-${doc.id}`;

      // Remove existing layer if already added
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
        mapInstance.removeSource(sourceId);
      }

      // Add the polygon source and layer
      mapInstance.addSource(sourceId, {
        type: "geojson",
        data: polygonFeature,
      });

      mapInstance.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": "#4287f5",
          "fill-opacity": 0.5,
        },
      });

      // Zoom to the polygon bounds
      const bounds = new mapboxgl.LngLatBounds();
      polygonCoords[0].forEach((coord) => bounds.extend(coord as mapboxgl.LngLatLike));
      mapInstance.fitBounds(bounds, { padding: 20, duration: 1000 });}
  
      // Add click event to the marker to show the polygon area
      marker.getElement()?.addEventListener("click", () => {
        if(props.drawing){
          console.log(polygonCoords);
          const data:CoordinatesAsPoint[] = []
          for(let i=0;i<polygonCoords[0].length;i++){
            console.log(polygonCoords[0][i][1])
            data.push(new CoordinatesAsPoint(Number(polygonCoords[0][i][1]), Number(polygonCoords[0][i][0])));
          }
          const coord = new CoordinatesAsPolygon(data);
          console.log(coord)
          props.setPolygon(data);
          props.setDrawing(false);
          if(map && drawRef.current)map.removeControl(drawRef.current);
          drawRef.current = null;
          return;
        }
        // Create or update the polygon source and layer
        const sourceId = `polygon-${doc.id}`;
        const layerId = `polygon-layer-${doc.id}`;

        // Remove existing layer if already added
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
          mapInstance.removeSource(sourceId);
          if(props.pin == doc.id){
            props.setNewPin(0)
          }
        }else{
          // Add the polygon source and layer
          if(props.pin != doc.id){
            props.setNewPin(doc.id)
          }
        }

        /*if (selectedPolygon !== doc.id) {
          setSelectedPolygon(doc.id);
  
          // Create or update the polygon source and layer
          const sourceId = `polygon-${doc.id}`;
          const layerId = `polygon-layer-${doc.id}`;
  
          // Remove existing layer if already added
          if (mapInstance.getLayer(layerId)) {
            mapInstance.removeLayer(layerId);
            mapInstance.removeSource(sourceId);
          }
  
          // Add the polygon source and layer
          mapInstance.addSource(sourceId, {
            type: "geojson",
            data: polygonFeature,
          });
  
          mapInstance.addLayer({
            id: layerId,
            type: "fill",
            source: sourceId,
            paint: {
              "fill-color": "#4287f5",
              "fill-opacity": 0.5,
            },
          });
  
          // Zoom to the polygon bounds
          const bounds = new mapboxgl.LngLatBounds();
          polygonCoords[0].forEach((coord) => bounds.extend(coord as mapboxgl.LngLatLike));
          mapInstance.fitBounds(bounds, { padding: 20, duration: 1000 });

          // update the list with the selected polygon
          props.setNewPin(doc.id);
          // console.error("props.pin set to ", props.pin);
        } else {

          
          // Deselect the polygon
          setSelectedPolygon(null);
  
          // Remove the polygon layer
          const sourceId = `polygon-${doc.id}`;
          const layerId = `polygon-layer-${doc.id}`;
  
          if (mapInstance.getLayer(layerId)) {
            mapInstance.removeLayer(layerId);
            mapInstance.removeSource(sourceId);
          }

          // reset the list with the selected polygon
          props.setNewPin(0);
        }*/
      });
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false })
        .setHTML(`<div style="color: black; font-weight: bold;">${doc.title}</div>`);
      marker.getElement()?.addEventListener("mouseover", () => {
        marker.setPopup(popup);
        popup.addTo(mapInstance);
        if (!props.drawing) {
          return; 
        }

        const sourceId = `polygon-${doc.id}`;
        if (mapInstance.getSource(sourceId)) {
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
            // fill light blue
            "fill-color": "lightBlue" , // Highlight the polygon with a distinct color
            "fill-opacity": 0.5,
          },
        });
      });
      marker.getElement()?.addEventListener("mouseleave", () => {
        popup.remove();
        if (!props.drawing) {
          return; 
        }
    
        const sourceId = `polygon-${doc.id}`;
    
        // Rimuovi layer e sorgente se esistono
        if (mapInstance.getSource(sourceId)) {
            mapInstance.removeLayer(sourceId);
            mapInstance.removeSource(sourceId);
        }
    });
    });
  };
  
   
  const debounce = (func: (...args: any[]) => void, delay: number): DebounceFunction => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  const debouncedAddPolygonsToMap = debounce(addPolygonsToMap, 300);
  
  useEffect(() => {
    if (map) {
      addMarkersToMap(map);
      debouncedAddPolygonsToMap(map);
    }
  },[props.drawing])
  
   

  
  useEffect(() => {
    if (map) {
      addMarkersToMap(map);
      debouncedAddPolygonsToMap(map);
    }
  }, [map, selectedPolygon, props.documents]);
    

  

  // useEffect(() => {
  //   if (!map || !props.documents) return;

  //   // Re-add markers and polygons whenever the map style changes
  //   addMarkersToMap(map);
  //   addPolygonsToMap(map);
  // }, [map, mapStyle, props.documents]);

  useEffect(() => {
    if (!props.documents || !Array.isArray(props.documents)) {
      console.error("Invalid documents data.");
      return;
    }
    // console.error("props.pin is ", props.pin);
  
    const convertedDocuments = props.documents.map((doc) =>
      Document.fromJSONfront(doc as DocumentJSON)
    );
  
    setDocuments(convertedDocuments); // Set the converted documents into state
  }, [props.documents]);

  // useEffect(() => {
  //   if (map) {
  //     map.getSource("documents-cluster-source").setData(generateGeoJSON());
  //   }
  // }, [props.documents]);
  
  

  const onMapClick = useCallback((e: MapMouseEvent) => {
    // console.log(props.drawing)
  if((props.adding || props.updating) && !props.drawing) {
      const c = { lat: e.lngLat.lat, lng:  e.lngLat.lng};
      props.setCoordMap(c);
    }
  }, [props.adding, props.updating, props.setCoordMap, props.drawing]);


  const modalStyle: React.CSSProperties = {
    backgroundColor: 'black',
    color:'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px',
  };

  
  

 
  return (
    <div ref={mapRef} style={{ height: "100vh", width: "100%", position: "relative" }}>
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyle}
        onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
        onLoad={(event) => setMap(event.target as mapboxgl.Map)}
        onClick={(e) => onMapClick(e)}
        style={{ height: "100%", width: "100%" }}
      >
        {/* GeoJSON Source for Municipality */}
        {props.geojson && (
          <Source id="geojson-source" type="geojson" data={props.geojson}>
            {/* GeoJSON Fill Layer */}
            <Layer
              id="geojson-layer"
              type="fill"
              paint={{
                "fill-color": "rgba(0, 128, 255, 0.3)", // Semi-transparent blue
                "fill-opacity": 0.3,
              }}
            />
            {/* GeoJSON Line Layer */}
            <Layer
              id="geojson-line"
              type="line"
              paint={{
                "line-color": "#FF0000", // Red for boundaries
                "line-width": 3,
              }}
            />
          </Source>
        )}
  
        {/* Cluster Source and Layers */}
        <Source
          id="documents-cluster-source"
          type="geojson"
          data={generateGeoJSON()}
          cluster={true}
          clusterMaxZoom={12} // Clusters break apart at this zoom level
          clusterRadius={100} // Pixel radius of clusters
        >
          {/* Clustered Points */}
          <Layer
            id="clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6", // Small clusters
                10,
                "#f1f075", // Medium clusters
                50,
                "#f28cb1", // Large clusters
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                15, // Small clusters
                10, 20, // Medium clusters
                50, 25, // Large clusters
              ],
            }}
          />
  
          {/* Cluster Labels */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 18,
            }}
          />
  
          {/* Unclustered Points */}
          <Layer
            id="unclustered-points"
            type="circle"
            filter={["!", ["has", "point_count"]]}
            paint={{
              "circle-color": "#11b4da",
              "circle-radius": 8,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fff",
            }}
          />
        </Source>
  
        {/* Button to Toggle Map Style */}
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
          <button onClick={toggleMapStyle}>{buttonText}</button>
        </div>
  
        {/* Legend */}
        <Legend documents={props.documents} />
        {/* Slider to adjust cluster zoom level */}
        {/* TODO: reenable this after we discuss whether the bug can be acceptable */}
        {/* <div className="slider-container">
          <label htmlFor="clusterZoomSlider" className="slider-label" style={{ textAlign: 'center' }}>
            Cluster Zoom Level: {clusterZoomThreshold <= 12.6 ? 'Far' : clusterZoomThreshold <= 13 ? 'Medium' : 'Close'}
          </label>
          <input
            id="clusterZoomSlider"
            type="range"
            min={12}
            max={13.3}
            step={0.65}
            value={clusterZoomThreshold}
            onChange={(e) => setClusterZoomThreshold(parseFloat(e.target.value))}
          />
        </div> */}
      </ReactMapGL>
  
      {/* Confirmation Modal */}
      {confirmChanges && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            {error === "" ? (
              <>
                <h3>Do you want to change the coordinates of this document?</h3>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    if (coordinatesInfo && coordinatesInfo.id && coordinatesInfo.coordinates) {
                      handleDrag(coordinatesInfo.id, coordinatesInfo.coordinates);
                    }
                  }}
                >
                  Confirm
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    setConfirmChanges(false);
                    if (!map) return;
                    addMarkersToMap(map);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{error}</h3>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    setConfirmChanges(false);
                    setError("");
                    if (!map) return;
                    addMarkersToMap(map);
                  }}
                >
                  Go back
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
  

};

export default Map;

