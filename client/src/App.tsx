import React, { useEffect, useState, useCallback } from "react";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import { Box, Button, CssBaseline, Grid } from "@mui/material";
import { DocumentType, Coordinates } from "./type"  // Import from types.ts
import "./App.css";
import API from "./API";




function App() {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 67.85572,
    lng: 20.22513,
  });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(true);
  const [pin, setPin] = useState(0);
  const [coordMap,setCoordMap] = useState<Coordinates|undefined>(undefined);//coordinates of the point choosen on the map
  const [adding, setAdding] = useState(false);//mode for taking coordinate from map

  const fetchDocuments = useCallback(async () => {
    try {
      /*const response = await fetch("http://localhost:3000/kiruna_explorer/documents/");
      if (!response.ok) throw new Error("Error fetching documents");
      const data = await response.json();*/
      const data = await API.getDocuments();

      for (let i = 0; i < data.length; i++) {
        /*const res = await fetch(`http://localhost:3000/kiruna_explorer/linkDocuments/${data[i].id}`);
        const t = await res.json();*/
        const t = await API.getLinks(data[i].id)
        let c = [];
        for (let j = 0; j < t.length; j++) {
          if (t[j].docId1 == data[i].id) {
            /*const temp = await fetch(`http://localhost:3000/kiruna_explorer/documents/${t[j].docId2}`);
            const t1 = await temp.json();*/
            const t1 = await API.getDocument(t[j].docId2)
            c.push(t1.title + ` (${t[j].linkType})`);
          } else {
            /*const temp = await fetch(`http://localhost:3000/kiruna_explorer/documents/${t[j].docId1}`);
            const t2 = await temp.json();*/
            const t2 = await API.getDocument(t[j].docId1)
            c.push(t2.title + ` (${t[j].linkType})`);
          }
        }
        data[i].connection = c;
      }

      setDocuments(data);
      console.log("Documents fetched:", data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    console.log(coordinates, bounds);
  }, [coordinates, bounds]);

  const toggleDocumentList = () => {
    setIsDocumentListOpen((prev) => !prev);
    setPin(0)
  };

  return (
    <>
      <CssBaseline />
      <Header onToggleDocumentList={toggleDocumentList} />

      <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
        <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
          {isDocumentListOpen && (
            <Grid item xs={13} md={4}>
              <DocumentList documents={documents} setDocuments={setDocuments} fetchDocuments={fetchDocuments}
               pin={pin} setNewPin={setPin} coordMap={coordMap} setCoordMap={setCoordMap} adding={adding} setAdding={setAdding} />
            </Grid>
          )}
<Box
      sx={{
        position: 'relative',  // Imposta il contenitore come riferimento per il posizionamento
        height: '100vh',  // Imposta l'altezza del contenitore alla finestra
      }}
    >
      <Button
        sx={{
          position: 'absolute',
          top: '50%',  // Posiziona il bottone al 50% della sua altezza
          left: '50%',  // Posiziona il bottone al 50% della larghezza
          transform: 'translate(-50%, -50%)',  // Centra il bottone esattamente a metà
        }}
      >
        Centered Button
      </Button>
    </Box>
          
          <Grid item xs={12} md={isDocumentListOpen ? 8 : 12} style={{ height: "100vh" }}>
            <Map
              setCoordinates={setCoordinates}
              setBounds={setBounds}
              coordinates={coordinates}
              setDocuments={setDocuments}
              fetchDocuments={fetchDocuments}
              pin={pin}
              setPin={setPin}
              coordMap={coordMap}
              setCoordMap={setCoordMap}
              adding={adding} setAdding={setAdding}
              documents={documents.map((doc) => ({
                ...doc,
                coordinates: {
                  lat: doc.coordinates?.lat ?? 0,
                  lng: doc.coordinates?.lng ?? 0,
                },
              }))}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;








