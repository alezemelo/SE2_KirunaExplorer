import React, { useState, useEffect, useCallback } from "react";
import ReactMapGL, { MarkerDragEvent, Source, ViewStateChangeEvent } from "react-map-gl";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import { Document, DocumentJSON } from "../../models/document";
import { Position } from "geojson";
import * as turf from '@turf/turf';
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";
import API from "../../API";


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
  adding: boolean;
  updating: boolean;
  setCoordMap: any;
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
  const [markers,setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [geojson, setGeojson] = useState(null);


  const toggleMapStyle = () => {
    setMapStyle((prevStyle) => {
      const newStyle =
        prevStyle === "mapbox://styles/mapbox/satellite-streets-v11"
          ? "mapbox://styles/mapbox/streets-v11"
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
      const marker = new mapboxgl.Marker({ color: "red", draggable:true })
        .setLngLat([pointCoords.lng, pointCoords.lat])
        .addTo(mapInstance);

        marker.getElement().dataset.id = doc.id.toString();
        markers.push(marker);

      marker.getElement()?.addEventListener("click", () => {
        props.setNewPin(doc.id); // Set the new pin when marker is clicked
      });
      marker.on('dragend', (e) => {
        const currentLngLat = e.target.getLngLat();
        const coordinates = new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(currentLngLat.lat,currentLngLat.lng))
        handleDrag(doc.id,coordinates)
      });
    });
    //setMarkers(markers);
  };

  const handleDrag = async (id:number,coordinates:Coordinates) => {
        await API.updateCoordinates(id,coordinates)
  }

  const addPolygonsToMap = (mapInstance: mapboxgl.Map) => {
    console.log("Adding polygons to map:", props.documents);

    props.documents.forEach((doc) => {
      doc = Document.fromJSONfront(doc as unknown as DocumentJSON);
      if (doc.getCoordinates()?.getType() !== "POLYGON") {
        console.error(`Document ${doc.id} does not have POLYGON coordinates.`);
        return;
      }

      const polygonCoords = doc.getCoordinates()?.getAsPositionArray() as Position[][];
      const polygon = turf.polygon(polygonCoords);
      const centroid = turf.centerOfMass(polygon);
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]])
        .addTo(mapInstance);
        marker.getElement()?.addEventListener("click", () => {
          props.setNewPin(doc.id);
        });

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
            "fill-opacity": 0,
          },
        });


    });
  };

  useEffect(()=>{
    if(!map || !props.pin) return;
    props.documents.forEach((doc)=>{
      if (map.getLayer(`polygon-${doc.id}`)) {
        if(doc.id==props.pin){
          map.setPaintProperty(`polygon-${doc.id}`, 'fill-opacity', 0.6);
        }else{
          map.setPaintProperty(`polygon-${doc.id}`, 'fill-opacity', 0);
        }
      }
      /*console.log(markers)
      markers.forEach(marker => {
        const markerId = marker.getElement().dataset.id;
        if (markerId == props.pin.toString()) {
            marker.getElement().style.transform = 'scale(1.5)'; 
        } else {
            marker.getElement().style.transform = 'scale(1)'; 
        }
    });*/
    })
  },[props.pin,map])


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

  /*useEffect(() => {
    const getMunicipality = async() => {
      
    }
    getMunicipality();
  },[])*/

/*  useEffect(() => {
    console.log(geojson)
  },[geojson])*/

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyle}
        onMove={(event: ViewStateChangeEvent) => setViewport(event.viewState)}
        onLoad={(event) => setMap(event.target as mapboxgl.Map)}
        onClick={(e) => onMapClick(e)}
      >
      <Source id="kiruna_municipality" type="geojson" data={geojson}></Source>
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
          <button onClick={toggleMapStyle}>{buttonText}</button>
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
