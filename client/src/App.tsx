/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import Login from "./components/Login/Login";
import { Box, Button, CssBaseline, Grid } from "@mui/material";
import { Coordinates, CoordinatesAsPolygon } from "./models/coordinates";
import "./App.css";
import API from "./API";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { User, Coordinates as CoordinatesLocal } from "./type";
import { Document } from "./models/document";
import LandingPage from "./components/LandingPage/LandingPage";
import TimeDiagram from "./components/TimeDiagram/TimeDiagram";

function App() {
  const [coordinates, setCoordinates] = useState<CoordinatesLocal>({
    lat: 67.85572,
    lng: 20.22513,
  });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(true);
  const [pin, setPin] = useState(0);
  const [coordMap, setCoordMap] = useState<CoordinatesLocal | undefined>(undefined); //it is used only for points
  const [adding, setAdding] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [message, setMessage] = useState<{ msg: string; type: string } | null>({
    msg: "",
    type: "",
  });
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMunicipalityChecked, setIsMunicipalityChecked] = useState(false);
  const [geojson, setGeojson] = useState(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [polygon, setPolygon] = useState<CoordinatesAsPolygon>()  //it is only used for polygon 

  // Handle the location selected from the map
  const handleMapLocationSelected = (lat: number, lng: number) => {
    setCoordMap({ lat, lng });
    setIsSelectingLocation(false);
  };

  const fetchDocuments = useCallback(async () => {
    try {
      const data: Document[] = await API.getDocuments();
      for (let i = 0; i < data.length; i++) {
        const t = await API.getLinks(data[i].id);
        let c = [];
        for (let j = 0; j < t.length; j++) {
          if (t[j].docId1 === data[i].id) {
            const t1 = await API.getDocument(t[j].docId2);
            c.push(t1.title + ` (${t[j].linkType})`);
          } else {
            const t2 = await API.getDocument(t[j].docId1);
            c.push(t2.title + ` (${t[j].linkType})`);
          }
        }
        data[i].connection = c;
      }
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const toggleDocumentList = () => {
    setIsDocumentListOpen((prev) => !prev);
    setPin(0);
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const matchingDocs = isMunicipalityChecked ? await API.searchDocumentsByTitle(searchQuery, true) : await API.searchDocumentsByTitle(searchQuery);
        setDocuments(matchingDocs);
      } else {
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error searching documents:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.checkAuth();
        if (user) {
          setLoggedIn(true);
          setUser(user);
        } else {
          setLoggedIn(false);
          setUser(undefined);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials: any) => {
    try {
      const user = await API.login(credentials.username, credentials.password);
      if (user) {
        setLoggedIn(true);
        setUser(user || undefined);
        setMessage(null);
        navigate("/map");
      } else {
        setMessage({ msg: "Invalid credentials. Please try again.", type: "danger" });
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const success = await API.logout();
      if (success) {
        setLoggedIn(false);
        setUser(undefined);
        navigate("/login");
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
    }
  };

  useEffect(() => {
    const renderMunicipality = async () => {
      const res = await fetch('KirunaMunicipality.geojson');
      const data = await res.json();
      setGeojson(data);
    }
    renderMunicipality();
  }, []);

  // Modified setNewPin function
  const setNewPinWithScroll = (docId: any) => {
    setPin(docId);
    if (docId !== 0) {
      const element = document.getElementById(`doc-${docId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={
          /* ====================== Map Component ====================== */
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
              <Header
                onToggleDocumentList={toggleDocumentList}
                loggedIn={loggedIn}
                logOut={handleLogout}
                handleSearch={handleSearch}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
              />
              <Grid container sx={{ flex: 1, overflow: 'hidden' }}>
                {isDocumentListOpen && (
                  <Grid item xs={12} md={4} sx={{ overflow: 'auto' }}>
                    <DocumentList
                      geojson={geojson}
                      updating={updating}
                      setUpdating={setUpdating}
                      documents={documents}
                      setDocuments={setDocuments}
                      fetchDocuments={fetchDocuments}
                      pin={pin}
                      setNewPin={setNewPinWithScroll}
                      coordMap={coordMap}
                      setCoordMap={setCoordMap}
                      adding={adding}
                      setAdding={setAdding}
                      loggedIn={loggedIn}
                      user={user}
                      isMunicipalityChecked={isMunicipalityChecked}
                      setIsMunicipalityChecked={setIsMunicipalityChecked}
                      drawing={drawing}
                      setDrawing={setDrawing}
                      polygon={polygon}
                      setPolygon={setPolygon}
                      setPin={setPin}
                    />
                  </Grid>
                )}
                <Box sx={{ position: "relative", height: "400px" }}>
                  <Button
                    sx={{
                      position: "absolute",
                      top: "400px",
                      left: "50%",
                      transform: "translate(0%, -50%)",
                      backgroundColor: "white",
                      zIndex: "10",
                      padding: "0",
                      minWidth: "6px",
                      height: "50px",
                    }}
                    onClick={toggleDocumentList}
                  >
                    {isDocumentListOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </Button>
                </Box>
                <Grid item xs={12} md={isDocumentListOpen ? 8 : 12} sx={{ overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <Map
                      fetchDocuments={fetchDocuments}
                      geojson={geojson}
                      pin={pin}
                      setNewPin={setNewPinWithScroll}
                      setCoordMap={setCoordMap}
                      adding={adding}
                      documents={documents}
                      isDocumentListOpen={isDocumentListOpen}
                      isSelectingLocation={isSelectingLocation}
                      onLocationSelected={handleMapLocationSelected}
                      updating={updating}
                    drawing={drawing}
                    setDrawing={setDrawing}
                    setPolygon={setPolygon}
                      isMunicipalityChecked={isMunicipalityChecked}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          }
          /* ====================== End Of Map Component ====================== */
        />
        <Route path="/time-diagram" element={<TimeDiagram />} />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/" />
            ) : (
              <Login login={handleLogin} message={message} setMessage={setMessage} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;