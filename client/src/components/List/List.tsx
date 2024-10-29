import React from "react";
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import DocDetails from "../DocDetails/DocDetails";
import "./List.css"; 

const List = () => {
  const documents = [
    { title: "Document 1" },
    { title: "Document 2" },
    { title: "Document 3" },
    { title: "Document 4" },
    { title: "Document 5" },
    { title: "Document 6" },
    { title: "Document 7" },
    { title: "Document 8" },
    { title: "Document 9" },
  ];

  return (
    <div className="container">
      <Typography variant="h4">Documents</Typography>

      {/* Form Control section */}
      <FormControl className="form-control">
        <InputLabel>Filter</InputLabel>
        <Select className="select-empty">
          <MenuItem value="Option1">Option 1</MenuItem>
          <MenuItem value="Option2">Option 2</MenuItem>
          <MenuItem value="Option3">Option 3</MenuItem>
        </Select>
      </FormControl>

      {/* Document list section */}
      <Grid container spacing={3} className="list">
        {documents?.map((document, i) => (
          <Grid item xs={12} key={i}>
            <DocDetails document={document} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default List;
