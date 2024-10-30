import React, { useState } from "react";
import { Box, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import DocDetails from "../DocDetails/DocDetails";
import "./List.css";

const List = () => {
  // Initial document list
  const [documents, setDocuments] = useState([
    { 
      title: "Compilation of responses “So what the people of Kiruna think?” (15)",
      stakeholders: "Kiruna kommun/Residents",
      scale: "text",
      issuanceDate: "2007",
      type: "Informative document",
      connection: "3",
      language: "Swedish",
      pages: "-",
      description: "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
    },
    { 
      title: "Detail plan for Bolagsomradet Gruvstadspark(18)",
      stakeholders: "Kiruna kommun",
      scale: "1:8.0000",
      issuanceDate: "20/10/2010",
      type: "Prescriptive document",
      connection: "8",
      language: "Swedish",
      pages: "1-32",
      description: "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
    },
    { 
      title: "Development Plan (41)",
      stakeholders: "Kiruna kommun/White Arkitekter",
      scale: "1:7,500",
      issuanceDate: "17/03/2014",
      type: "Design document",
      connection: "7",
      language: "Swedish",
      pages: "111",
      description: "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
    },
  ]);

  // Dialog visibility and new document data
  const [open, setOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ title: "", stakeholders: "", scale: "", issuanceDate: "", type: "", connection: "", language: "", pages: "", description: "" });

  // Handle dialog open/close
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocument({ ...newDocument, [e.target.name]: e.target.value });
  };

  // Add new document to the list
  const handleAddDocument = () => {
    setDocuments([...documents, newDocument]);
    setNewDocument({ title: "", stakeholders: "", scale: "", issuanceDate: "", type: "", connection: "", language: "", pages: "", description: "" });
    handleClose();
  };

  return (
    <div className="container">
      <Typography variant="h4">Documents</Typography>

     

      {/* Dialog for Adding New Document */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Document</DialogTitle>
        <DialogContent>
          <TextField className="card-textfield" autoFocus margin="dense" label="Title" name="title" fullWidth value={newDocument.title} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Stakeholders" name="stakeholders" fullWidth value={newDocument.stakeholders} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Scale" name="scale" fullWidth value={newDocument.scale} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Issuance Date" name="issuanceDate" fullWidth value={newDocument.issuanceDate} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Type" name="type" fullWidth value={newDocument.type} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Connection" name="connection" fullWidth value={newDocument.connection} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Language" name="language" fullWidth value={newDocument.language} onChange={handleChange} />
          <TextField className="card-textfield"margin="dense" label="Pages" name="pages" fullWidth value={newDocument.pages} onChange={handleChange} />
          <TextField className="card-textfield" margin="dense" label="Description" name="description" fullWidth multiline rows={4} value={newDocument.description} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAddDocument} color="primary">Add Document</Button>
        </DialogActions>
      </Dialog>

      {/* Scrollable document list container */}
      <Box className="scrollable-list" style={{ height: '500px', overflowY: 'auto', paddingRight: '10px' }}>
        <Grid container spacing={3}>
          {documents.map((document, i) => (
            <Grid item xs={12} key={i}>
              <DocDetails document={document} />
            </Grid>
          ))}
        </Grid>
      </Box>

       {/* Add New Document Button */}
       <Button fullWidth variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '85px' }}>
        Add New Document
      </Button>
    </div>
  );
};

export default List;
