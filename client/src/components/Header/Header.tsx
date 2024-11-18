// Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, InputBase, Button } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu"; // Import icon for toggle
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface Header {
  onToggleDocumentList: () => void;
  loggedIn: boolean;
  logOut: () => void;
}

const Header: React.FC<Header> = (props) => {
  const navigate = useNavigate();

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
            Kiruna
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" className="title">
            Explore documents
          </Typography>
          <div className="search">
            <InputBase
              placeholder="Search…"
              sx={{
                color: 'white',
                '& ::placeholder': { color: 'white' },
              }}
              className="inputRoot"
            />
          </div>
        </Box>
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

