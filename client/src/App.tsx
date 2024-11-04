// App.tsx
import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import { CssBaseline, Grid } from "@mui/material";
import "./App.css";

interface Coordinates {
  lat: number;
  lng: number;
}

interface DocumentType {
  title: string;
  stakeholders: string;
  scale: string;
  issuanceDate: string;
  type: string;
  connection: string;
  language: string;
  pages: string;
  description: string;
  lat: string;
  lng: string;
}

function App() {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 67.85572,
    lng: 20.22513,
  });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);

  /*const [documents, setDocuments] = useState<DocumentType[]>([
    {
      title: "Compilation of responses “So what the people of Kiruna think?” (15)",
      stakeholders: "Kiruna kommun/Residents",
      scale: "text",
      issuanceDate: "2007",
      type: "Informative document",
      connection: "3",
      language: "Swedish",
      pages: "-",
      description: "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consulta- tion opportunities.",
      lat: "67.855881",
      lng: "20.282177",
    },
    {
      title: "Detail plan for Bolagsomradet Gruvstadspark (18)",
      stakeholders: "Kiruna kommun",
      scale: "1:8.0000",
      issuanceDate: "20/10/2010",
      type: "Prescriptive document",
      connection: "8",
      language: "Swedish",
      pages: "1-32",
      description: "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
      lat: "67.860669",
      lng: "20.221753",
    },
    {
      title: "Development Plan (41)",
      stakeholders: "Kiruna kommun/White Arkitekter",
      scale: "1:7,500",
      issuanceDate: "17/03/2014",
      type: "Design document",
      connection: "7",
      language: "Swedish",
      pages: "111",
      description: "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The docu- ment is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
      lat: "67.836332",
      lng: "20.267758",
    },
  ]);*/

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("http://localhost:3000/kiruna_explorer/documents/");
        if (!response.ok) throw new Error("Errore durante il caricamento dei documenti");
        const data = await response.json();
        for(let i=0; i<data.length; i++){
          const res = await fetch(`http://localhost:3000/kiruna_explorer/linkDocuments/${data[i].id}`)
          const t = await  res.json();
          data[i].connection = t.length;
        }
        setDocuments(data); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    console.log(coordinates, bounds);
  }, [coordinates, bounds]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
      <Grid item xs={12} md={4}>
          <DocumentList documents={documents} setDocuments={setDocuments} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            documents={documents.map(doc => ({
              ...doc,
              lat: doc.lat,  // Parse lat to number
              lng: doc.lng,  // Parse lng to number
            }))}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;





