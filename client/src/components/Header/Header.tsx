import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom"; // Import for navigation
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css"; // Import the CSS file here

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to the login page
  };


  return (
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar className="toolbar">
          <Typography variant="h5" className="title">
            Kiruna
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" className="title">
              Explore documents
            </Typography>
{       /*     <Autocomplete>
*/}              <div className="search">
                <div className="searchIcon">
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  sx={{
                    color: 'white',  // Text color
                    '& ::placeholder': {
                      color: 'white',  // Placeholder text color
                    },
                  }}
                  className="inputRoot"
                />
              </div>
              {       /*     </Autocomplete>
*/}        </Box>
          <IconButton color="inherit" onClick={handleLoginClick} edge="end">
            <AccountCircle fontSize="large"/>
          </IconButton>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
