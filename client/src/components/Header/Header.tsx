import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css"; // Import the CSS file here

const Header = () => {

  return (
      <AppBar position="static">
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
                  className="inputRoot"
                />
              </div>
              {       /*     </Autocomplete>
*/}        </Box>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
