// Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, InputBase } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu"; // Import icon for toggle
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface Header {
  onToggleDocumentList: () => void;
}

const Header: React.FC<Header> = ({ onToggleDocumentList }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar className="toolbar">
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={onToggleDocumentList} edge="start">
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
        <IconButton color="inherit" onClick={handleLoginClick} edge="end">
          <AccountCircle fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

