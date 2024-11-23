import React, { useEffect, useState, useCallback, useRef } from "react";
import { useJsApiLoader, GoogleMap, Polygon, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "90%",
};

const center = { lat: 67.85766491972178, lng: 20.22771266622486 };

interface MapProps {
  documents: any[]; // Dati che contengono i poligoni
  pin: number;
  setNewPin: (id: number) => void;
  fetchDocuments: () => Promise<void>;
  setCoordMap: (coords: { lat: number; lng: number }) => void;
  adding: boolean;
  setAdding: (adding: boolean) => void;
  updating: boolean;
}

const MyMap: React.FC<MapProps> = (props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4", // Inserisci la tua API key
  });

  // Stato per il caricamento dei poligoni
  const [polygonsLoaded, setPolygonsLoaded] = useState(false);
  const [localDocuments, setLocalDocuments] = useState<any[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    console.log("Updating local documents:", props.documents);
    setLocalDocuments(props.documents);
    renderPolygons();
  }, [props.documents]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Funzione per il click sulla mappa
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (props.adding || props.updating) {
        const c = { lat: e.latLng?.lat()!, lng: e.latLng?.lng()! };
        props.setCoordMap(c);
      }
    },
    [props.adding, props.updating, props.setCoordMap]
  );

  // Funzione per il click su un poligono
  const onPolygonClick = useCallback(
    (e: google.maps.MapMouseEvent, id: number) => {
      if (props.adding || props.updating) {
        onMapClick(e);
      } else {
        props.setNewPin(id);
      }
    },
    [onMapClick, props.setNewPin, props.adding, props.updating]
  );

  // Funzione per il rendering dei poligoni
  const renderPolygons = useCallback(() => {
    return localDocuments.map((doc) => {
      if (doc.coordinates.type === "POLYGON" && doc.coordinates.coords) {
        const paths = doc.coordinates.coords.coordinates;

        // Verifica che ci siano almeno 3 punti nel poligono
        if (paths.length >= 3) {
          console.log("polygons rendering")
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
              onClick={(e) => onPolygonClick(e, doc.id)}
            />
          );
        } else {
          console.warn(
            `Polygon for document ID ${doc.id} has less than 3 points. Skipping...`
          );
        }
      }
      if(doc.coordinates.type=="POINT"){
        return (<Marker
          key={doc.id}
          position={{ lat: doc.coordinates.coords.lat, lng: doc.coordinates.coords.lng }}
          draggable={true}
        />)
      }
      return null;
    });
    
  }, [props.documents, onPolygonClick]);

  // Effettua il fetching dei documenti dopo il login o quando cambiano i dati
  useEffect(() => {
    const loadDocuments = async () => {
      // Chiamata per caricare i dati
      await props.fetchDocuments();
      setPolygonsLoaded(true); // Segna che i poligoni sono stati caricati
    };

    if (!polygonsLoaded) {
      loadDocuments(); // Carica i poligoni solo una volta
    }
  }, [polygonsLoaded, props.fetchDocuments]);

  // Gestione del cambio di stato quando i poligoni vengono caricati
  useEffect(() => {
    if (props.documents.length > 0) {
      setPolygonsLoaded(true); // Se i poligoni sono già presenti, segna che sono caricati
    }
  }, [props.documents]);

  useEffect(()=>{
    console.log("documents")
    console.log(props.documents)
  },[])

  const l = () => {
    console.log("loading map")
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {renderPolygons()}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MyMap;
