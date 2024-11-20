import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import Login from "./components/Login/Login";
import { Box, Button, CssBaseline, Grid } from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import API from "./API";
import { User, Coordinates as CoordinatesLocal } from "./type";
import { Document } from "./models/document";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(true);
  const [pin, setNewPin] = useState<number>(0);
  const [coordMap, setCoordMap] = useState<CoordinatesLocal | undefined>();
  const [adding, setAdding] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();
  const [message, setMessage] = useState<{ msg: string; type: string } | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigate = useNavigate();

  const fetchDocuments = useCallback(async () => {
    try {
      const data: Document[] = await API.getDocuments();
      setDocuments(data);
      console.log("Documents fetched:", data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const toggleDocumentList = () => {
    setIsDocumentListOpen((prev) => !prev);
    setNewPin(0);
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const matchingDocs = await API.searchDocumentsByTitle(searchQuery);
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

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const user = await API.login(credentials.username, credentials.password);
      if (user) {
        setLoggedIn(true);
        setUser(user);
        setMessage(null);
        fetchDocuments();
        navigate("/");
      } else {
        setMessage({ msg: "Invalid credentials. Please try again.", type: "danger" });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const success = await API.logout();
      if (success) {
        fetchDocuments();
        setLoggedIn(false);
        setUser(undefined);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBIs9B8cOa7rusUEbiyekOZrmQZyM-eCs4" libraries={libraries}>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <Header
                onToggleDocumentList={toggleDocumentList}
                loggedIn={loggedIn}
                logOut={handleLogout}
                handleSearch={handleSearch}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
              />
              <Grid container spacing={0} style={{ height: "100vh", width: "100%", margin: 0, padding: 0 }}>
                {isDocumentListOpen && (
                  <Grid item xs={12} md={4}>
                    <DocumentList
                      updating={updating}
                      setUpdating={setUpdating}
                      documents={documents}
                      setDocuments={setDocuments}
                      fetchDocuments={fetchDocuments}
                      pin={pin}
                      setNewPin={setNewPin}
                      coordMap={coordMap}
                      setCoordMap={setCoordMap}
                      adding={adding}
                      setAdding={setAdding}
                      loggedIn={loggedIn}
                      user={user}
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
                <Grid item xs={12} md={isDocumentListOpen ? 8 : 12}>
                  <Map
                    fetchDocuments={fetchDocuments}
                    pin={pin}
                    setNewPin={setNewPin}
                    setCoordMap={setCoordMap}
                    adding={adding}
                    setAdding={setAdding}
                    documents={documents}
                    updating={updating}
                  />
                </Grid>
              </Grid>
            </div>
          }
        />
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
    </LoadScript>
  );
}

export default App;
