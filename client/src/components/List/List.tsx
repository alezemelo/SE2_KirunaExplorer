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
    type: "",
    connection: "",
    language: "",
    pages: "",
    description: "",
    lat: "",
    lng: ""
  });

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentType | null>(null);

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

  const handleAddDocument = () => {
    setDocuments([...documents, newDocument]);
    setNewDocument({
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
    });
    handleClose();
  };

  const linkDocument = (targetDocument: DocumentType) => {
    /*if (currentDocument) {
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => 
          doc === currentDocument ? { ...doc, connection: targetDocument.title } : doc
        )
      );
      closeLinkingDialog();
    }*/
   console.log(targetDocument);
   
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
            <TextField className="white-input" margin="dense" label="Type" name="type" fullWidth value={newDocument.type} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Connection" name="connection" fullWidth value={newDocument.connection} onChange={handleChange} />
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
              <ListItemButton key={index} onClick={() => linkDocument(doc)} className="document-item">
                <ListItemText primary={doc.title} />
              </ListItemButton>
            ) : null
          ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLinkingDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentList;



