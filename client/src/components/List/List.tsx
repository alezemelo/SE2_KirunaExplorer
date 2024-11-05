// List.tsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import DocDetails from "../DocDetails/DocDetails";
import "./List.css";

// Define the type for documents
interface DocumentType {
  id: number;
  title: string;
  stakeholders: string;
  scale: string;
  issuanceDate: string;
  type: string;
  connection: string;
  language: string;
  pages: string;
  description: string;
  lat: string; 
  lng: string; 
}

interface DocumentListProps {
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, setDocuments }) => {
  const [open, setOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<DocumentType>({
    id: 0,
    title: "",
    stakeholders: "",
    scale: "",
    issuanceDate: "",
    type: "informative_doc",
    connection: "",
    language: "",
    pages: "",
    description: "",
    lat: "",
    lng: ""
  });

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentType | null>(null);
  const [targetDocumentId, setTargetDocumentId] = useState(0);
  const [targetLinkType, setTargetLinkType] = useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTargetLinkType(value);
  };


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openLinkingDialog = (document: DocumentType) => {
    setCurrentDocument(document);
    setOpenLinkDialog(true);
  };
  const closeLinkingDialog = () => setOpenLinkDialog(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocument({ ...newDocument, [e.target.name]: e.target.value });
  };

  const handleAddDocument = async () => {
    //setDocuments([...documents, newDocument]);
    /*setNewDocument({
      id: 0,
      title: "",
      stakeholders: "",
      scale: "",
      issuanceDate: "",
      type: "",
      connection: "",
      language: "",
      pages: "",
      description: "",
      lat: "",
      lng: ""
    });*/
      try {
        const b = JSON.stringify(newDocument);
        const response = await fetch("http://localhost:3000/kiruna_explorer/documents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: b, 
        });
    
        if (!response.ok) {
          throw new Error("Error: " + response.statusText);
        }
        const result = await response.json();
        console.log("res:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    closeLinkingDialog();
  };


  const linkDocument = async () => {
    /*if (currentDocument) {
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => 
          doc === currentDocument ? { ...doc, connection: targetDocument.title } : doc
        )
      );
      closeLinkingDialog();
    }*/
   if(currentDocument && targetDocumentId && targetLinkType){
    try {
      const response = await fetch("http://localhost:3000/kiruna_explorer/linkDocuments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_id1: currentDocument?.id,
          doc_id2: targetDocumentId,
          link_type: targetLinkType
        }), 
      });
  
      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }
      const result = await response.json();
      console.log("res:", result);
    } catch (error) {
      console.error("Error:", error);
    }
    handleClose()

   }
   
  };

  return (
    <div className="container">
      <Typography variant="h6">Documents</Typography>

      {/* Dialog for Adding New Document */}
      <Dialog open={open} onClose={handleClose} className="custom-dialog">
        <DialogTitle>Add a New Document</DialogTitle>
          <DialogContent>
            <TextField className="white-input" autoFocus margin="dense" label="Title" name="title" fullWidth value={newDocument.title} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Stakeholders" name="stakeholders" fullWidth value={newDocument.stakeholders} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Scale" name="scale" fullWidth value={newDocument.scale} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Issuance Date" name="issuanceDate" fullWidth value={newDocument.issuanceDate} onChange={handleChange} />
            <FormControl component="fieldset" margin="dense" fullWidth>
            <Typography variant="body1" sx={{ color: 'white', display: 'inline', marginLeft: 0 }}>Type: </Typography>
            <RadioGroup row name="type" value={newDocument.type} onChange={handleChange}>
              <FormControlLabel value="informative_doc" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="informative_doc" />
              <FormControlLabel value="prescriptive_doc" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="prescriptive_doc" />
            </RadioGroup>
          </FormControl>
            <TextField className="white-input" margin="dense" label="Language" name="language" fullWidth value={newDocument.language} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Pages" name="pages" fullWidth value={newDocument.pages} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Latitude" name="lat" fullWidth value={newDocument.lat} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Longitude" name="lng" fullWidth value={newDocument.lng} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Description" name="description" fullWidth multiline rows={4} value={newDocument.description} onChange={handleChange} />
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAddDocument} color="primary">Add Document</Button>
        </DialogActions>
      </Dialog>

      {/* Scrollable document list */}
      <Box className="scrollable-list" style={{ height: "580px", overflowY: "auto", paddingRight: "10px" }}>
        <Grid container spacing={3}>
          {documents.map((document, i) => (
            <Grid item xs={12} key={i}>
              <DocDetails document={document} onLink={() => openLinkingDialog(document)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button fullWidth variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: "38px" }}>
        Add New Document
      </Button>

      {/* Linking Dialog */}
      <Dialog open={openLinkDialog} onClose={closeLinkingDialog} className="custom-dialog">
        <DialogTitle>Link Document</DialogTitle>
        <DialogContent>
          <List>
          {documents.map((doc, index) => (
            currentDocument && doc.id !== currentDocument.id ? ( // Controllo di null
              <ListItemButton key={index} onClick={() => setTargetDocumentId(doc.id)} className="document-item">
                <ListItemText primary={doc.title} />
                <select onChange={handleSelectChange} value={targetLinkType}>
                  <option value="direct" selected>direct</option>
                  <option value="collateral">collateral</option>
                  <option value="projection">projection</option>
                  <option value="update">update</option>
                </select>
              </ListItemButton>
            ) : null
          ))}
          </List>
        </DialogContent>
        <DialogActions>
        <Button onClick={linkDocument}  color="secondary">Create</Button>
          <Button onClick={closeLinkingDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentList;



