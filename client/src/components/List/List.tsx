// List.tsx
import React, { useState } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
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
import { DocumentType } from "../../App";
import DocDetails, { Coordinates } from "../DocDetails/DocDetails";
import "./List.css";



interface DocumentListProps {
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  fetchDocuments:() => Promise<void>;
}

interface DocumentLocal {
  id: number;
  title: string;
  stakeholders: string;
  scale: string;
  issuanceDate: any;
  type: string;
  connection: string[];
  language: string;
  pages: number;
  description: string;
  lat?: number,
  lng?: number
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, setDocuments, fetchDocuments }) => {
  const [open, setOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<DocumentLocal>({
    id: 0,
    title: "",
    stakeholders: "",
    scale: "",
    issuanceDate: "",
    type: "informative_doc",
    connection: [],
    language: "",
    pages: 1,
    description: "",
    lat: undefined,
    lng: undefined
  });

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentType | null>(null);
  const [targetDocumentId, setTargetDocumentId] = useState(0);
  const [targetLinkType, setTargetLinkType] = useState("direct");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTargetLinkType(value);
  };


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false);
    setNewDocument({
      id: 0,
      title: "",
      stakeholders: "",
      scale: "",
      issuanceDate: "",
      type: "informative_doc",
      connection: [],
      language: "",
      pages: 1,
      description: "",
      lat: undefined,
      lng: undefined
    });
    setErrors([]);
  }

  const openLinkingDialog = (document: DocumentType) => {
    setCurrentDocument(document);
    setOpenLinkDialog(true);
  };
  const closeLinkingDialog = () => {setOpenLinkDialog(false);
    setTargetDocumentId(0);
    setTargetLinkType("direct");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocument({ ...newDocument, [e.target.name]: e.target.value });
  };

  const handleAddDocument = async () => {
    const newErrors = [];
  
    // Validazioni
    if (!newDocument.title) {
      newErrors.push("Title is required.");
    }
    if (typeof newDocument.title !== 'string') {
      newErrors.push("Title must be a string.");
    }
    if (typeof newDocument.stakeholders !== 'string') {
      newErrors.push("Stakeholders must be a string.");
    }
    if (typeof newDocument.scale !== 'string') {
      newErrors.push("Scale must be a string.");
    }
    /*if (newDocument.issuanceDate && typeof newDocument.issuanceDate !== 'string') {
      newErrors.push("Issuance Date must be a string.");
    }*/
    if (typeof newDocument.type !== 'string') {
      newErrors.push("Type must be a string.");
    }
    if (typeof newDocument.language !== 'string') {
      newErrors.push("Language must be a string.");
    }
    if (Number(newDocument.pages) <= 0) { // Corretto: controlliamo pages, non language
      newErrors.push("Pages must be greater than 0");
    }
    if (newDocument.issuanceDate != '' && (!dayjs(newDocument.issuanceDate, 'YYYY-MM-DD', true).isValid() || dayjs(newDocument.issuanceDate).isAfter(dayjs()))) {
      newErrors.push("Date is not valid");
  }
    if (newDocument.description && typeof newDocument.description !== 'string') {
      newErrors.push("Description must be a string.");
    }
    if (((!newDocument.lat && newDocument.lng) || (newDocument.lat && !newDocument.lng))) {
      newErrors.push("Latitude and Longitude must be defined."); 
    }
    if ((Number(newDocument.lat) < -90 || Number(newDocument.lat) > 90) || (Number(newDocument.lng) < -180 || Number(newDocument.lng) > 180)) {
      newErrors.push("Latitude and Longitude must be between -90 and 90 and -180 and 180.");
    }
    /*
    if (newDocument.lat !== undefined && typeof newDocument.lat !== 'number') {
      newErrors.push("Latitude must be a number.");
    }
    if (newDocument.lng !== undefined && typeof newDocument.lng !== 'number') {
      newErrors.push("Longitude must be a number.");
    }
    */
  
    setErrors(newErrors);
  
    // Procede solo se non ci sono errori
    if (newErrors.length === 0) {
      try {
        // Conversione della data
        let date;
        if(newDocument.issuanceDate == ""){
          date = undefined;
        }
        else {
          date = dayjs(newDocument.issuanceDate).isValid() ? new Date(dayjs(newDocument.issuanceDate).set('hour', 12).tz("Europe/Rome").format("YYYY-MM-DDTHH:mm:ss")) : undefined;
        }
        setNewDocument(prevDocument => ({
          ...prevDocument,
          issuanceDate: date
        }));
  
        // Creazione dell'oggetto finale
        const finalDocument = {
          id: newDocument.id,
          title: newDocument.title,
          stakeholders: newDocument.stakeholders,
          scale: newDocument.scale,
          issuanceDate: date,
          type: newDocument.type,
          connection: newDocument.connection,
          language: newDocument.language,
          pages: Number(newDocument.pages),
          description: newDocument.description,
          coordinates: newDocument.lat !== undefined && newDocument.lng !== undefined 
            ? { lat: Number(newDocument.lat), lng: Number(newDocument.lng) }
            : undefined 
        };
  
        // Invio del documento al server
        const response = await fetch("http://localhost:3000/kiruna_explorer/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalDocument),
        });
  
        if (!response.ok) {
          throw new Error("Error: " + response.statusText);
        }
        const result = await response.json();
        console.log("res:", result);
        await fetchDocuments();
  
        // Chiudi il form e resetta i dati solo se tutto è andato a buon fine
        handleClose();
        setNewDocument({
          id: 0,
          title: "",
          stakeholders: "",
          scale: "",
          issuanceDate: "",
          type: "informative_doc",
          connection: [],
          language: "",
          pages: 1,
          description: "",
          lat: undefined,
          lng: undefined
        });
  
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  


  const linkDocument = async () => {
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
      await fetchDocuments();
    } catch (error) {
      console.error("Error:", error);
    }
    closeLinkingDialog()

   }
   
  };

  return (
    <div className="container">
      <Typography variant="h6">Documents</Typography>

      {/* Dialog for Adding New Document */}
      <Dialog open={open} onClose={handleClose} className="custom-dialog">
        <DialogTitle>Add a New Document</DialogTitle>
          <DialogContent>
            <TextField className="white-input" autoFocus margin="dense" label="Title" name="title" required fullWidth value={newDocument.title} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Stakeholders" name="stakeholders" fullWidth value={newDocument.stakeholders} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Scale" name="scale" fullWidth value={newDocument.scale} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="ex. 2022-01-01" name="issuanceDate" fullWidth value={newDocument.issuanceDate} onChange={handleChange} />
            <FormControl component="fieldset" margin="dense" fullWidth>
            <Typography variant="body1" sx={{ color: 'white', display: 'inline', marginLeft: 0 }}>Type: </Typography>
            <RadioGroup row name="type" value={newDocument.type} onChange={handleChange}>
              <FormControlLabel value="informative_doc" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="informative_doc" />
              <FormControlLabel value="prescriptive_doc" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="prescriptive_doc" />
              <FormControlLabel value="design_doc" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="design_doc" />
              <FormControlLabel value="technical_doc" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="technical_doc" />
              <FormControlLabel value="material_effect" control={<Radio sx={{color: "white",'&.Mui-checked': { color: "lightblue" },}}/>} label="material_effect" />
            </RadioGroup>
          </FormControl>
            <TextField className="white-input" margin="dense" label="Language" name="language" fullWidth value={newDocument.language} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Pages" name="pages" type="number" fullWidth value={newDocument.pages} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Latitude" name="lat" fullWidth value={newDocument?.lat} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Longitude" name="lng" fullWidth value={newDocument?.lng} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Description" name="description" fullWidth multiline rows={4} value={newDocument.description} onChange={handleChange} />
          </DialogContent>
          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <p key={index} style={{ color: 'red' }}>{error}</p> 
              ))}
            </div>
          )}

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
              <DocDetails document={document} fetchDocuments={fetchDocuments} onLink={() => openLinkingDialog(document)} />
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
                {(targetDocumentId!=0 && targetDocumentId == doc.id) ? <ListItemText primary={doc.title} sx={{ color: 'yellow' }} /> : <ListItemText primary={doc.title}/> }
              </ListItemButton>
            ) : null
          ))}
          </List>
          <select onChange={handleSelectChange} value={targetLinkType}>
                  <option value="direct" selected>direct</option>
                  <option value="collateral">collateral</option>
                  <option value="projection">projection</option>
                  <option value="update">update</option>
                </select>
        </DialogContent>
        <DialogActions>
        <Button onClick={linkDocument}  color="primary">Create</Button>
          <Button onClick={closeLinkingDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentList;



