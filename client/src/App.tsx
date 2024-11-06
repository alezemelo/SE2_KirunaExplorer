import React, { useEffect, useState, useCallback } from "react";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import { CssBaseline, Grid } from "@mui/material";
import "./App.css";

interface Coordinates {
  lat: number;
  lng: number;
}

export interface DocumentType {
  id: number;
  title: string;
  stakeholders: string;
  scale: string;
  issuance_date: any;
  type: string;
  connection: string[];
  language: string;
  pages: number;
  description: string;
  coordinates?: Coordinates;
}

function App() {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 67.85572,
    lng: 20.22513,
  });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/kiruna_explorer/documents/");
      if (!response.ok) throw new Error("Error fetching documents");
      const data = await response.json();
      console.log(data)

      for (let i = 0; i < data.length; i++) {

/*        if (data[i].coordinates && data[i].coordinates.lng !== undefined) {
          data[i].coordinates.long = data[i].coordinates.lng;
          delete data[i].coordinates.lng;
        }*/
        const res = await fetch(`http://localhost:3000/kiruna_explorer/linkDocuments/${data[i].id}`);
        const t = await res.json();
        console.log(t);
        let c = [];
        for (let j = 0; j < t.length; j++) {
          if (t[j].docId1 == data[i].id) {
            const temp = await fetch(`http://localhost:3000/kiruna_explorer/documents/${t[j].docId2}`);
            const t1 = await temp.json();
            c.push(t1.title + ` (${t[j].linkType})`);
          } else {
            const temp = await fetch(`http://localhost:3000/kiruna_explorer/documents/${t[j].docId1}`);
            const t2 = await temp.json();
            c.push(t2.title + ` (${t[j].linkType})`);
          }
        }
        data[i].connection = c; 
      }
      console.log(data)
      setDocuments(data);
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

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
        <Grid item xs={12} md={4}>
          <DocumentList documents={documents} setDocuments={setDocuments} fetchDocuments={fetchDocuments} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            documents={documents.map(doc => ({
              ...doc,
              coordinates: {
                lat: doc.coordinates?.lat ?? 0,
                lng: doc.coordinates?.lng ?? 0,
              },
            }))}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;






