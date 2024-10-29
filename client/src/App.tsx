import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import { CssBaseline, Grid } from '@mui/material';
import './App.css';

// Define type for Coordinates
interface Coordinates {
  lat: number;
  lng: number;
}

function App() {
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 67.85572 , lng: 20.22513 });
  const [bounds, setBounds] = useState<{ ne: Coordinates; sw: Coordinates } | null>(null);


  useEffect(() => {
    console.log(coordinates, bounds);
  }, [coordinates, bounds]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid container spacing={0} style={{ width: '100%', margin: 0 }}>
        <Grid item xs={12} md={4}>
          <List />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map 
            setCoordinates={setCoordinates} 
            setBounds={setBounds} 
            coordinates={coordinates} 
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;



