import React, { useEffect, useState, useCallback } from "react";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import { Box, Button, CssBaseline, Grid } from "@mui/material";
import { DocumentType, Coordinates } from "./type"  // Import from types.ts
import "./App.css";
import API from "./API";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


function App() {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 67.85572,
    lng: 20.22513,
  });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(true);
  const [pin, setNewPin] = useState(0);
  const [coordMap,setCoordMap] = useState<Coordinates|undefined>(undefined);//coordinates of the point choosen from the map
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
    setNewPin(0)
  };

  return (
    <>
    <div className="container">
      <CssBaseline />
      <Header onToggleDocumentList={toggleDocumentList} />
      
      <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
        <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
          {isDocumentListOpen && (
            <Grid item xs={13} md={4}>
              <DocumentList documents={documents} setDocuments={setDocuments} fetchDocuments={fetchDocuments}
               pin={pin} setNewPin={setNewPin} coordMap={coordMap} setCoordMap={setCoordMap} adding={adding} setAdding={setAdding} 
               />
            </Grid>
          )}
<Box
      sx={{
        position: 'relative', 
        height: '100vh',  
      }}
    >
      <Button
        sx={{
          position: 'absolute',
          top: '50%', 
          left: '50%', 
          transform: 'translate(0%, -50%)',  
          backgroundColor: "white",
          zIndex: "10",
          padding: "0",
          minWidth: "6px",
          height: "50px"
        }}
        onClick={toggleDocumentList}
      >
        {isDocumentListOpen?<ChevronLeftIcon />:<ChevronRightIcon/>}
      </Button>
    </Box>
          
          <Grid item xs={12} md={isDocumentListOpen ? 8 : 12}>
            <Map
              setCoordinates={setCoordinates}
              setBounds={setBounds}
              coordinates={coordinates}
              setDocuments={setDocuments}
              fetchDocuments={fetchDocuments}
              pin={pin}
              setNewPin={setNewPin}
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
      </div>
      </>
  );
}

export default App;








