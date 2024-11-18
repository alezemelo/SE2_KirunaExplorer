import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import DocumentList from "./components/List/List";
import Map from "./components/Map/Map";
import Login from "./components/Login/Login";
import { Box, Button, CssBaseline, Grid } from "@mui/material";
import { Coordinates } from "./models/coordinates"
import "./App.css";
import API from "./API";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./App.css";
import { User } from "./type";

const ProtectedRoute = ({ children, loggedIn }: any) => {
  // If not logged in, redirect to login
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {

  const [coordinates, setCoordinates] = useState<CoordinateLocal>({
    lat: 67.85572,
    lng: 20.22513,
  });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(true);
  const [pin, setNewPin] = useState(0);
  const [coordMap, setCoordMap] = useState<Coordinates | undefined>(undefined);
  const [adding, setAdding] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); 
  const [user, setUser] = useState<User | undefined>(undefined);
  const [message, setMessage] = useState<{ msg: string; type: string } | null>({ msg: '', type: '' });
  const navigate = useNavigate(); // Use navigate hook



  const fetchDocuments = useCallback(async () => {
    try {
      /*const response = await fetch("http://localhost:3000/kiruna_explorer/documents/");
      if (!response.ok) throw new Error("Error fetching documents");
      const data = await response.json();*/
      const data:Document[] = await API.getDocuments();

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
      console.log("Documents fetched:", data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const toggleDocumentList = () => {
    setIsDocumentListOpen((prev) => !prev);
    setNewPin(0);
  };

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.checkAuth();
        if (user) { // Proceed only if user data is returned
          setLoggedIn(true);
          setUser(user);
          console.log("User authenticated:", user);
        } else {
          setLoggedIn(false); // User not authenticated
          console.log("User not authenticated");
          setUser(undefined);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
  
    checkAuth();
  }, []);
  
  useEffect(() => {
    console.log("LoggedIn:", loggedIn);
  }, [loggedIn]);
  

  // NEW
  const handleLogin = async (credentials:any) => {
    try {
      const user = await API.login(credentials.username, credentials.password);
      if (user) {

        setLoggedIn(true);

        setUser(user || undefined);
        setMessage(null);
        navigate("/"); // Redirect to the home page
        console.log("Logged in:", user?.type);
      }else {
        console.error("Login failed");
        setMessage({ msg: 'Invalid credentials. Please try again.', type: 'danger' });
      }

    }catch(err) {
      console.error("An error occurred during login:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const success = await API.logout();
      if (success) {
        setLoggedIn(false); // Update the loggedIn state
        setUser(undefined); // Clear the user state
        navigate("/login"); // Redirect to the login page
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
    }
  };
  

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <Header onToggleDocumentList={toggleDocumentList} loggedIn={loggedIn} logOut={handleLogout}/>
              <Grid container spacing={0} style={{ width: "100%", marginTop: 10, padding: 0 }}>
                {isDocumentListOpen && (
                  <Grid item xs={13} md={4}>
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
                <Box sx={{ position: "relative", height: "100vh" }}>
                  <Button
                    sx={{
                      position: "absolute",
                      top: "50%",
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
                    setCoordinates={setCoordinates}
                    setBounds={setBounds}
                    coordinates={coordinates}
                    setDocuments={setDocuments}
                    fetchDocuments={fetchDocuments}
                    pin={pin}
                    setNewPin={setNewPin}
                    coordMap={coordMap}
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
    </>
  );
}

export default App;










