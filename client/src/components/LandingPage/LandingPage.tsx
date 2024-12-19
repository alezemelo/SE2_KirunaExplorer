// LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import './LandingPage.css'; // Import the CSS file

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography 
        variant="h2" 
        className="welcome-text"
        sx={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          zIndex: 1000,
          textAlign: 'center',
          width: '100%',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textShadow: '4px 4px 6px rgba(0,0,0,0.5)',
          animation: 'fadeIn 1.5s ease-in'
        }}
      >
        Welcome to Kiruna Explorer
      </Typography>
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
    </Box>
  );
};

export default LandingPage;