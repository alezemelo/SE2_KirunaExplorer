// List.tsx
import React, { useEffect, useState, useRef } from "react";
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
  InputBase,
  Card,
  CardContent,
  IconButton,
  createTheme
} from "@mui/material";
import { DocumentType } from "../../type";
import DocDetails, { Coordinates } from "../DocDetails/DocDetails";
import "./List.css";
import API from "../../API";
import CloseIcon from '@mui/icons-material/Close';



interface DocumentListProps {
  documents: DocumentType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  fetchDocuments:() => Promise<void>;
  pin: number,
  setNewPin: any;
  coordMap?: Coordinates;
  setCoordMap: any;
  adding: boolean; 
  setAdding:any;
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

const DocumentList: React.FC<DocumentListProps> = ({ documents, setDocuments, fetchDocuments, pin, setNewPin, coordMap, setCoordMap, adding, setAdding }) => {
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
  const [oldForm, setOldForm] = useState<DocumentLocal | null>(null);
  const [updating, setUpdating] = useState(false);
  //const[document, setDocument] = useState<any>(0); //document that as to be shown in the sidebar
  //const [docExpand, setDocExpand] = useState(0);
  

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTargetLinkType(value);
  };

/*  useEffect(()=>{
    const t = documents.find((doc)=>doc.id==pin)
    if(t){setDocument(t)}
    //setDocExpand(pin);
  },[pin])*/

  useEffect(()=>{
    if(updating){
      setOldForm(newDocument);
      setOpen(true);
    }
  },[updating])



  useEffect(()=> {
    console.log(adding)
    console.log(updating)
    if(coordMap && (adding || updating) ){
      setNewDocument((prev)=>{
        return{
          ...prev,
          lat: coordMap?.lat,
          lng: coordMap?.lng
        }
      })
      setOpen(true);
    }
  },[coordMap])


  const handleClickOpen = () => {
    setOpen(true);
    setAdding(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUpdating(false);
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

  const handleMapCoord = () => {
    setOpen(false);
    //setAdding(true);
  }

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
    if (newDocument.pages && Number(newDocument.pages) <= 0) { // Corretto: controlliamo pages, non language
      newErrors.push("Pages must be greater than 0");
    }
    /*const regexYearMonth = /^\d{4}-(0[1-9]|1[0-2])$/;
    const regexYearOnly = /^\d{4}$/;
    if (newDocument.issuanceDate != '' && (!(!dayjs(newDocument.issuanceDate, 'YYYY-MM-DD', true).isValid() || regexYearMonth.test(newDocument.issuanceDate) || regexYearOnly.test(newDocument.issuanceDate)) || dayjs(newDocument.issuanceDate).isAfter(dayjs()))) {
      newErrors.push("Date is not valid");
  }*/
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
  
        if(updating){
          if(newDocument.description!=oldForm?.description){
            console.log("nuovo")
            console.log(newDocument.description)
            console.log("vecchio")
            console.log(oldForm?.description)
            await API.updateDescription(newDocument.id,newDocument.description);
            //await fetchDocuments();
            /*setDocuments((prev) => 
              prev.map((doc) => 
                doc.id == newDocument.id
                  ? { ...doc, description: newDocument.description } 
                  : doc 
              )
            );*/
          }
          if(newDocument.lat && newDocument.lng && (newDocument.lat!=oldForm?.lat || newDocument.lng!=oldForm?.lng)){
            await API.updateCoordinates(newDocument.id,newDocument.lat.toString(),newDocument.lng?.toString())
          }
          setUpdating(false);
        }
        else{
          await API.addDocument(finalDocument);
          setAdding(false)
        }
        await fetchDocuments();
  
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
    /*try {
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
    }*/
    await API.createLink(currentDocument?.id, targetDocumentId, targetLinkType);
    await fetchDocuments();
    closeLinkingDialog()

   }
    
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if ( itemRefs.current[pin]) {
        itemRefs.current[pin].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}, [pin]);

  return (
    <div className="container">
      <Typography variant="h6">Documents</Typography>

      {/* Dialog for Adding New Document */}
      <Dialog open={open} onClose={handleClose}  className="custom-dialog">
        <DialogTitle>Add a New Document</DialogTitle>
          <DialogContent>
            <TextField className="white-input" autoFocus margin="dense" label="Title" name="title" required fullWidth value={newDocument.title} disabled={updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Stakeholders" name="stakeholders" fullWidth value={newDocument.stakeholders} disabled={updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Scale" name="scale" fullWidth value={newDocument.scale} disabled={updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="ex. 2022-01-01/2022-01/2022" name="issuanceDate" fullWidth value={newDocument.issuanceDate} disabled={updating?true:false} onChange={handleChange} />
            <FormControl component="fieldset" margin="dense" fullWidth disabled={updating}>
  <Typography variant="body1" sx={{ color: 'white', display: 'inline', marginLeft: 0 }}>Type: </Typography>
  <RadioGroup row name="type" value={newDocument.type} onChange={handleChange}>
        <FormControlLabel
          value="informative_doc"
          control={<Radio disabled={updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: updating ? "gray" : "white" }}>informative_doc</Typography>}
        />
        <FormControlLabel
          value="prescriptive_doc"
          control={<Radio disabled={updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: updating ? "gray" : "white" }}>prescriptive_doc</Typography>}
        />
        <FormControlLabel
          value="design_doc"
          control={<Radio disabled={updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: updating ? "gray" : "white" }}>design_doc</Typography>}
        />
        <FormControlLabel
          value="technical_doc"
          control={<Radio disabled={updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: updating ? "gray" : "white" }}>technical_doc</Typography>}
        />
        <FormControlLabel
          value="material_effect"
          control={<Radio disabled={updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: updating ? "gray" : "white" }}>material_effect</Typography>}
        />
      </RadioGroup>
    </FormControl>
            <TextField className="white-input" margin="dense" label="Language" name="language" fullWidth value={newDocument.language} disabled={updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Pages" name="pages" type="number" fullWidth value={newDocument.pages} disabled={updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Latitude" name="lat" fullWidth value={newDocument?.lat} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Longitude" name="lng" fullWidth value={newDocument?.lng} onChange={handleChange} />
            <Button color="primary" onClick={handleMapCoord}>Choose on map</Button>
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
          <Button onClick={handleAddDocument} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Scrollable document list */}
      <Box ref={containerRef} className="scrollable-list" style={{ height: "700px", overflowY: "auto", paddingRight: "10px" }}>
        <Grid container spacing={3}>
          {documents.map((document, i) => (
            <Grid item xs={12} key={i} ref={(el) => (itemRefs.current[document.id] = el)}>
              <DocDetails document={document} fetchDocuments={fetchDocuments} pin={pin} setNewPin={setNewPin} /*docExpand={docExpand} setDocExpand={setDocExpand}*/ updating={updating} setUpdating={setUpdating} newDocument={newDocument} setNewDocument={setNewDocument} onLink={() => openLinkingDialog(document)} />
            </Grid>
          ))
        }
        </Grid>
      </Box>

      <Button fullWidth variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: "38px" }}>
        Add a new document
      </Button>

      {/* Linking Dialog */}
      <Dialog open={openLinkDialog} onClose={closeLinkingDialog} className="custom-dialog">
        <DialogTitle>Link Document</DialogTitle>
        <DialogContent>
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



