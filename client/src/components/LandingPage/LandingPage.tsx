// LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import './LandingPage.css'; // Import the CSS file

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Grid container className="landing-container">
      {/* Left Side - Map */}
      <Grid
        item
        xs={12}
        md={6}
        className="landing-section landing-map"
        onClick={() => navigate('/map')}
      >
        {/* Overlay */}
        <Box className="overlay" />
        {/* Content */}
        <Box className="content">
          <Typography variant="h3" gutterBottom>
            Explore the Map
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Time Diagram */}
      <Grid
        item
        xs={12}
        md={6}
        className="landing-section landing-diagram"
        onClick={() => navigate('/time-diagram')}
      >
        {/* Overlay */}
        <Box className="overlay" />
        {/* Content */}
        <Box className="content">
          <Typography variant="h3" gutterBottom>
            View the Time Diagram
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LandingPage;