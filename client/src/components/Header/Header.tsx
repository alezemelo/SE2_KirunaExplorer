// Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, InputBase, Button } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search'; 
import MenuIcon from "@mui/icons-material/Menu"; 
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

interface Header {
  onToggleDocumentList: () => void;
  loggedIn: boolean;
  logOut: () => void;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  searchQuery: string;
}

const Header: React.FC<Header> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate("/login");
  };


  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar className="toolbar">
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={props.onToggleDocumentList} edge="start">
            <MenuIcon /> {/* Button to open/close document list */}
          </IconButton>
          <Typography variant="h5" className="title" style={{ marginLeft: 8 }}>
            Kiruna Explorer
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/')} edge="end" style={{ marginLeft: 'auto' }}>
            <HomeIcon /> {/* Home button to navigate to / */}
          </IconButton>
        </Box>
        {location.pathname === "/map" && (
        <Box display="flex" alignItems="center">
          <Typography variant="h6" className="title">
            Explore documents
          </Typography>
          <div className="search">
            <InputBase
              placeholder="Search…"
              value={props.searchQuery.trim()}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              sx={{
                color: 'white',
                '& ::placeholder': { color: 'white' },
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Optional: style to make the input stand out
                borderRadius: '4px',
                padding: '4px 12px',
                width: '100%',
              }}
              className="inputRoot"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  props.handleSearch();
                }
              }}
            />
            {/* Optional: Add a button for search */}
            <IconButton onClick={props.handleSearch} sx={{ color: 'white', padding: '10px' }}>
              <SearchIcon />
            </IconButton>
          </div>
        </Box>
        )}
        <div>
          {props.loggedIn ? (
            <Button
              variant="contained"
              color="error"
              onClick={props.logOut}
              startIcon={<LogoutIcon />}
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "none", // Optional: Keeps the button text in normal case
                fontSize: "1rem", // Optional: Adjust font size for better readability
              }}
            >
              Logout
            </Button>
          ) : (
            <IconButton
              color="inherit"
              onClick={handleLoginClick}
              edge="end"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          )}
        </div>
  
      </Toolbar>
    </AppBar>
  );
};

export default Header;

