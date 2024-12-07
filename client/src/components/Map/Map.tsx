// import React, { useState, useEffect } from "react";
// import ReactMapGL, { ViewStateChangeEvent } from "react-map-gl";
// import mapboxgl from "mapbox-gl";
// import { Document, DocumentJSON } from "../../models/document";
// import { Position } from "geojson";
// import * as turf from "@turf/turf";
// // import { feature, point } from "@turf/turf";

// const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
// if (!accessToken) {
//   console.error("Mapbox access token is missing!");
// }
// mapboxgl.accessToken = accessToken!;

// interface MapProps {
//   documents: Document[];
//   isDocumentListOpen: boolean; // Add this prop to track sidebar state
//   pin: number;
//   setNewPin: (id: number) => void;
//   isSelectingLocation: boolean; // If we are in "Choose on Map" mode
//   onLocationSelected: (lat: number, lng: number) => void; 
// }

// const Map: React.FC<MapProps> = (props) => {
//   const [viewport, setViewport] = useState({
//     latitude: 67.85394,
//     longitude: 20.222309,
//     zoom: 12,
//   });

//   const [mapStyle, setMapStyle] = useState(
//     "mapbox://styles/mapbox/satellite-streets-v11"
//   );
//   const getRandomColor = () => {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }
//   const [map, setMap] = useState<mapboxgl.Map | null>(null);
//   const [buttonText, setButtonText] = useState("Switch to Street View");
//   // const [map, setMap] = useState<mapboxgl.Map | null>(null);
//   const [selectedMarker, setSelectedMarker] = useState<mapboxgl.Marker | null>(null);



//   const toggleMapStyle = () => {
//     setMapStyle((prevStyle) => {
//       const newStyle =
//         prevStyle === "mapbox://styles/mapbox/satellite-streets-v11"
//           ? "mapbox://styles/mapbox/traffic-night-v2"
//           : "mapbox://styles/mapbox/satellite-streets-v11";

//       setButtonText(
//         newStyle === "mapbox://styles/mapbox/satellite-streets-v11"
//           ? "Switch to Street View"
//           : "Switch to Satellite View"
//       );

//       return newStyle;
//     });
//   };

//   useEffect(() => {
//     if (!map) return;
    

//     const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
//       if (props.isSelectingLocation) {
//         const { lng, lat } = e.lngLat;

//         console.log(`Map clicked at: Latitude ${lat}, Longitude ${lng}`);

//         // Remove existing marker if any
//         if (selectedMarker) {
//           selectedMarker.remove();
//         }

//         // Add a new marker
//         const marker = new mapboxgl.Marker({ color: "green", draggable: true })
//           .setLngLat([lng, lat])
//           .addTo(map);

//         setSelectedMarker(marker);

//         // Attach a popup to the marker
//         const popup = new mapboxgl.Popup({ offset: 25 })
//           .setHTML(
//             `<div style="text-align: center;">
//               <h3>Set Location</h3>
//               <button id="confirmLocation" style="margin-top: 5px;">Confirm</button>
//             </div>`
//           )
//           .addTo(map);

//         marker.setPopup(popup);
//         popup.on("open", () => {
//           const confirmButton = document.getElementById("confirmLocation");
          
//           confirmButton?.addEventListener("click", () => {
//             // Pass the coordinates back to the parent component
//             onLocationSelected(lat, lng);
//             popup.remove();
//           });
//         });

//         // Close popup on marker click
//         marker.getElement().addEventListener("click", () => {
//           popup.remove();
//           setSelectedMarker(null); // Reset selected marker
//         });
//       }
//     };

//     map.on("click", handleMapClick);

//     return () => {
//       map.off("click", handleMapClick);
//     };
//   }, [map, isSelectingLocation, selectedMarker, onLocationSelected]);
  
  


//   const addMarkersToMap = (mapInstance: mapboxgl.Map) => {
//     console.log("Adding markers to map:", props.documents);
  
//     props.documents.forEach((doc) => {
//       doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
  
//       if (doc.getCoordinates()?.getType() !== "POINT") {
//         return; // Skip non-POINT documents
//       }
  
//       const pointCoords = doc.getCoordinates()?.getLatLng();
  
//       if (!pointCoords || pointCoords.lat === null || pointCoords.lng === null) {
//         console.error(`Document ${doc.id} does not have valid POINT coordinates.`);
//         return;
//       }
  
//       // Add marker to the map
//       const marker = new mapboxgl.Marker({ color: "red" })
//         .setLngLat([pointCoords.lng, pointCoords.lat])
//         .addTo(mapInstance);
  
//       // Add a popup with the document's title and details
//       const popup = new mapboxgl.Popup({ offset: 25 }) // Offset for better positioning
//         .setHTML(
//           `<div style="font-size: 14px; color: black;">
//             <strong>${doc.title}</strong><br />
//             ${doc.description ? doc.description : "No description available."}
//           </div>`
//         );
  
//       // Attach popup and setNewPin to marker click
//       marker.getElement()?.addEventListener("click", () => {
//         console.log(`Marker for Document ${doc.id} clicked`);
        
//         // Show the popup
//         if (pointCoords.lng !== null && pointCoords.lat !== null) {
//           popup.addTo(mapInstance).setLngLat([pointCoords.lng, pointCoords.lat]);
//         }
  
//         // Call setNewPin to handle additional actions when a marker is clicked
//         props.setNewPin(doc.id);
//       });
//     });
//   };
  

//   const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
//     console.log("Adding polygons to map as points:", props.documents);
  
//     props.documents.forEach((doc) => {
//       doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
//       if (doc.getCoordinates()?.getType() !== "POLYGON") {
//         return; // Skip non-POLYGON documents
//       }
  
//       const polygonCoords = doc.getCoordinates()?.getAsPositionArray() as Position[][];
//       if (!polygonCoords || polygonCoords.length === 0) {
//         console.error(`Document ${doc.id} does not have valid POLYGON coordinates.`);
//         return;
//       }
  
//       // Calculate the centroid of the polygon
//       const polygonFeature = turf.polygon(polygonCoords);
//       const centroid = turf.centroid(polygonFeature);
  
//       const centroidCoords = centroid.geometry.coordinates;
  
//       // Add marker at the centroid
//       const marker = new mapboxgl.Marker({ color: "blue" })
//         .setLngLat(centroidCoords as [number, number])
//         .addTo(mapInstance);
  
//       // Marker click handler to display the polygon
//       marker.getElement()?.addEventListener("click", () => {
//         console.log(`Centroid marker for Polygon Document ${doc.id} clicked`);
  
//         const sourceId = `polygon-${doc.id}`;
//         if (mapInstance.getSource(sourceId)) {
//           // Remove the polygon if it already exists
//           mapInstance.removeLayer(sourceId);
//           mapInstance.removeSource(sourceId);
//           return;
//         }
  
//         // Add the polygon layer
//         mapInstance.addSource(sourceId, {
//           type: "geojson",
//           data: polygonFeature,
//         });
  
//         mapInstance.addLayer({
//           id: sourceId,
//           type: "fill",
//           source: sourceId,
//           paint: {
//             "fill-color": getRandomColor(), // Highlight the polygon with a distinct color
//             "fill-opacity": 0.5,
//           },
//         });
  
//         // Zoom to the polygon
//         mapInstance.fitBounds(turf.bbox(polygonFeature) as mapboxgl.LngLatBoundsLike, {
//           padding: 20,
//         });
//       });
//     });
//   };
  

//   useEffect(() => {
//     if (!map) return;

//     const handleStyleLoad = () => {
//       console.log("Style loaded; adding markers and polygons.");
//       addMarkersToMap(map);
//       addPolygonsToMap(map);
//     };

//     map.on("styledata", handleStyleLoad);

//     return () => {
//       map.off("styledata", handleStyleLoad);
//     };
//   }, [map, props.documents]);

//   useEffect(() => {
//     if (!map || !props.documents) return;

//     // Re-add markers and polygons whenever the map style changes
//     addMarkersToMap(map);
//     addPolygonsToMap(map);
//   }, [map, mapStyle, props.documents]);

//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <ReactMapGL
//         {...viewport}
//         mapStyle={mapStyle}
//         onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
//         onLoad={(event) => setMap(event.target as mapboxgl.Map)}
//       >
//         <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
//           <button onClick={toggleMapStyle}>{buttonText}</button>
//         </div>
//       </ReactMapGL>
//     </div>
//   );
// };

// export default Map;


import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMapGL, { Layer, Source, ViewStateChangeEvent } from "react-map-gl";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import { Document, DocumentJSON } from "../../models/document";
import { Position } from "geojson";import * as turf from '@turf/turf';
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";
import API from "../../API";
import * as fs from 'fs'
import { lightBlue } from "@mui/material/colors";
import overlayStyle from "../../ReactCssStyles";
import { point, booleanPointInPolygon, Coord } from '@turf/turf';

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
  setNewPin: (id: number) => void;
  isSelectingLocation: boolean; // If we are in "Choose on Map" mode
  onLocationSelected: (lat: number, lng: number) => void; // Callback for location selection
  adding: boolean;
  updating: boolean;
  setCoordMap: any;
  geojson: any;
  fetchDocuments: any;
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
  const markersRef = useRef<{ id: number, marker: mapboxgl.Marker }[]>([]);
  const [confirmChanges, setConfirmChanges] = useState(false); //open the dialog for confirmation
  const [coordinatesInfo, setCoordinatesInfo] = useState<{id: number, coordinates:Coordinates}|undefined>(undefined); //informations for the coordinates for updating
  const [selectedMarker, setSelectedMarker] = useState<mapboxgl.Marker | null>(null);
  const centroidsRef = useRef<(mapboxgl.Marker | null)[]>([]);
  const [error,setError] = useState('')

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (map) {
      map.resize();
    }
  }, [props.isDocumentListOpen]);
  
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

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (props.isSelectingLocation) {
        const { lng, lat } = e.lngLat;

        console.log(`Map clicked at: Latitude ${lat}, Longitude ${lng}`);

        // Remove existing marker if any
        if (selectedMarker) {
          selectedMarker.remove();
        }

        // Add a new marker
        const marker = new mapboxgl.Marker({ color: "green", draggable: true })
          .setLngLat([lng, lat])
          .addTo(map);

        setSelectedMarker(marker);

        // Call the parent callback with the selected location
        props.onLocationSelected(lat, lng);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, props.isSelectingLocation, props.onLocationSelected, selectedMarker]);

  const addMarkersToMap = (mapInstance: mapboxgl.Map) => {
    console.log("adding marker to map")
    markersRef.current.forEach(({ marker }) => {
      marker.remove();
    });
  
    markersRef.current = [];

    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);

      if (doc.getCoordinates()?.getType() !== "POINT") {
        return;
      }

      const pointCoords = doc.getCoordinates()?.getLatLng();

      if (!pointCoords || pointCoords.lat === null || pointCoords.lng === null) {
        console.error(`Document ${doc.id} does not have valid POINT coordinates.`);
        return;
      }
  
      const marker = new mapboxgl.Marker({ color: "red", draggable: true, scale: props.pin==doc.id ? 1.5 : 1 })
        .setLngLat([pointCoords.lng, pointCoords.lat])
        .addTo(mapInstance);

      if(doc.id == props.pin){
        const markerLngLat = marker.getLngLat();
        mapInstance.fitBounds(
          [
            [markerLngLat.lng - 0.0001, markerLngLat.lat - 0.0001],
            [markerLngLat.lng + 0.0001, markerLngLat.lat + 0.0001],
          ],
          {
            padding: 20,
            maxZoom: 12,
          }
        );
      }
  
      markersRef.current.push({ id: doc.id, marker });
  
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<div style="font-size: 14px; color: black;">
            <strong>${doc.title}</strong><br />
            ${doc.description ? doc.description : "No description available."}
          </div>`
        );
  
      marker.getElement()?.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior
      
        if (pointCoords.lng !== null && pointCoords.lat !== null) {
          popup.addTo(mapInstance).setLngLat([pointCoords.lng, pointCoords.lat]);
        }
      
        if (props.pin !== doc.id) {  
          props.setNewPin(doc.id);
        } else if (props.pin !== 0) {
          props.setNewPin(0);
        }
      });
  
      marker.on('dragend', (e) => {
        const currentLngLat = e.target.getLngLat();
        const coordinates = new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(currentLngLat.lat, currentLngLat.lng));
        if(booleanPointInPolygon(point([currentLngLat.lng,currentLngLat.lat]),props.geojson.features[0])){
          setCoordinatesInfo({ id: doc.id, coordinates: coordinates });
        }else{
          setError('Marker out of Kiruna municipality')
        }
        setConfirmChanges(true);
      });
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
    console.log("Adding polygons to map as points:", props.documents);

    centroidsRef.current.forEach((centroid) => centroid?.remove());
    centroidsRef.current = [];

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

      console.log("add marker")
      // Add marker at the centroid
      const marker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat(centroidCoords as [number, number])
        .addTo(mapInstance);

      centroidsRef.current.push(marker);


      if(props.pin == doc.id){
        // Zoom to the polygon
        mapInstance.fitBounds(turf.bbox(polygonFeature) as mapboxgl.LngLatBoundsLike, {
          padding: 20,
        });
      }
  
      // Marker click handler to display the polygon
      marker.getElement()?.addEventListener("click", () => {
        console.log(`Centroid marker for Polygon Document ${doc.id} clicked`);

        if(props.pin!=doc.id){
          props.setNewPin(doc.id)
        }
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
            // fill light blue
            "fill-color": "lightBlue" , // Highlight the polygon with a distinct color
            "fill-opacity": 0.5,
          },
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

  const onMapClick = useCallback((e: MapMouseEvent) => {
    if (props.adding || props.updating) {
      const c = { lat: e.lngLat.lat, lng:  e.lngLat.lng};
      props.setCoordMap(c);
    }
  }, [props.adding, props.updating, props.setCoordMap]);


  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
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
    <div ref={mapRef} style={{ height: "100vh", width: "100%" }}>
      {confirmChanges && <div style={overlayStyle} >
        <div style={modalStyle}>
          {error == '' ?
            <><h3>Do you want to change the coordinates of this document</h3>
              <button style={buttonStyle} onClick={() => {
                if (coordinatesInfo && coordinatesInfo.id && coordinatesInfo?.coordinates)
                  handleDrag(coordinatesInfo.id, coordinatesInfo.coordinates)
              }} >Confirm</button>
              <button style={buttonStyle} onClick={() => {
                setConfirmChanges(false);
                if (!map) return;
                addMarkersToMap(map)
              }}>Cancel</button></>
            :
            <><h3>{error}</h3><button style={buttonStyle} onClick={() => {
              setConfirmChanges(false);
              setError('')
              if (!map) return;
              addMarkersToMap(map)
            }}>Go back</button></>}
        </div>
      </div>}
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyle}
        onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
        onLoad={(event) => setMap(event.target as mapboxgl.Map)}
        onClick={(e) => onMapClick(e)}
      >
             {props.geojson && <Source id="geojson-source" type="geojson" data={props.geojson}>
                    <Layer
                        id="geojson-layer"
                        type="fill"
                        paint={{
                            "fill-color": "#0080ff",
                            "fill-opacity": 0
                        }}
                    />
                    <Layer
                        id="geojson-line"
                        type="line"
                        paint={{
                            "line-color": "#FF0000", 
                            "line-width": 3         
                        }}
                    />
                </Source>}
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
          <button onClick={toggleMapStyle}>{buttonText}</button>
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
