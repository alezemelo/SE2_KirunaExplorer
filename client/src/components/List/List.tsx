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
  createTheme,
  Select,
  MenuItem
} from "@mui/material";
import { DocumentType as DocumentLocal, User, Coordinates as CoordinateLocal } from "../../type";
import DocDetails from "../DocDetails/DocDetails";
import "./List.css";
import API from "../../API";
import CloseIcon from '@mui/icons-material/Close';
import { Document, DocumentType } from "../../models/document";
import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from "../../models/coordinates";
import { title } from "process";



interface DocumentListProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  fetchDocuments:() => Promise<void>;
  pin: number,
  setNewPin: any;
  coordMap?: CoordinateLocal|undefined;
  setCoordMap: any;
  adding: boolean; 
  setAdding:any;
  loggedIn: boolean;
  user: User | undefined;
  updating: boolean;
  setUpdating: any;
  isMunicipalityChecked: boolean;
  setIsMunicipalityChecked: any;
}

/*interface DocumentLocal {
  id: number;
  title: string;
  stakeholders: string;
  scale: string;
  issuanceDate: any;
  lastModifiedBy: string;
  type: string;
  connection: string[];
  language: string;
  pages: number;
  description: string;
  coordinates: any;
}*/






const DocumentList: React.FC<DocumentListProps> = (props) => {
  const reset = () => {
    /*return new Document(
      0,
      "",
      DocumentType.informative_doc,
      "admin",
      undefined,
      "",
      1,
      "",
      "",
      "",
      new Coordinates(CoordinatesType.MUNICIPALITY,null)
    )*/
      return {
        id: 0,
        title: "",
        stakeholders: "",
        scale: "",
        lastModifiedBy: "admin",
        issuanceDate: "",
        type: "informative_doc",
        connection: [],
        language: "English",
        pages: 1,
        description: "",
        coordinates: null
      }
  }
  const [open, setOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<DocumentLocal>(reset());

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [targetDocumentId, setTargetDocumentId] = useState(0);
  const [targetLinkType, setTargetLinkType] = useState("direct");
  const [errors, setErrors] = useState<string[]>([]);
  const [oldForm, setOldForm] = useState<DocumentLocal | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [linkDocuments, setLinkDocuments] = useState<Document[]>([]);
  const [linkErrors, setLinkErrors] = useState<string[]>([]);
  const [municipality, setMunicipality] = useState(true);
  const [coordinates_type, setCoordinatesType] = useState(false);
  
  
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
    if(props.updating){
      setOldForm(newDocument);
      setOpen(true);
    }
  },[props.updating])



  useEffect(()=> {
    console.log(props.adding)
    console.log(props.updating)
    if(props.coordMap && (props.adding || props.updating) ){
      newDocument.coordinates = (new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(props.coordMap.lat,props.coordMap.lng)))
      setOpen(true);
    }
  },[props.coordMap])


  const handleClickOpen = () => {
    setOpen(true);
    props.setAdding(true);
  };
  const handleClose = () => {
    setOpen(false);
    props.setUpdating(false);
    props.setAdding(false)
    setNewDocument(reset());
    setErrors([]);
  }

  const openLinkingDialog = (document: Document) => {
    setCurrentDocument(document);
    setOpenLinkDialog(true);
    
  };
  const closeLinkingDialog = () => {setOpenLinkDialog(false);
    setTargetDocumentId(0);
    setTargetLinkType("direct");
    setLinkDocuments([]);
    setSearchQuery('');
    setLinkErrors([])

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name=="lat"){
      setNewDocument({
        ...newDocument,
        coordinates: {
          ...newDocument.coordinates, 
          coords: {
            ...newDocument.coordinates?.coords, 
            lat: e.target.value
          }
        }
      });
    }
    else if(e.target.name=="lng"){
      setNewDocument({
        ...newDocument,
        coordinates: {
          ...newDocument.coordinates, 
          coords: {
            ...newDocument.coordinates?.coords, 
            lng: e.target.value
          }
        }
      });
  }
  else {
    setNewDocument({ ...newDocument, [e.target.name]: e.target.value });
  }
}

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
    if (!newDocument.stakeholders) {
      newErrors.push("stakeholder is required.");
    }
    if (!newDocument.description) {
      newErrors.push("description is required.");
    }
    if (!newDocument.language) {
      newErrors.push("language is required.");
    }
    if (!newDocument.scale) {
      newErrors.push("scale is required.");
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
    if (
      (!newDocument.coordinates?.coords?.lat && newDocument.coordinates?.coords?.lng) || 
      (newDocument.coordinates?.coords?.lat && !newDocument.coordinates?.coords?.lng)
    ) {
      newErrors.push("Latitude and Longitude must be defined.");
    }
    
    if (
      (Number(newDocument.coordinates?.coords?.lat) < -90 || Number(newDocument.coordinates?.coords?.lat) > 90) || 
      (Number(newDocument.coordinates?.coords?.lng) < -180 || Number(newDocument.coordinates?.coords?.lng) > 180)
    ) {
      newErrors.push("Latitude and Longitude must be between -90 and 90 and -180 and 180.");
    }
    if (newDocument.coordinates?.coords?.lat && isNaN(Number(newDocument.coordinates?.coords?.lat))) {
      newErrors.push("Latitude must be a number.");
      console.log(newDocument.coordinates?.coords?.lat)
    }
    if (newDocument.coordinates?.coords?.lng && isNaN(Number(newDocument.coordinates?.coords?.lng))) {
      newErrors.push("Longitude must be a number.");
    }
    
  
    setErrors(newErrors);
  
    // Procede solo se non ci sono errori
    if (newErrors.length === 0) {
      try {
        // Conversione della data
        let date;
        /*if(newDocument.issuanceDate == ""){
          date = undefined;
        }
        else {
          date = dayjs(newDocument.issuanceDate).isValid() ? new Date(dayjs(newDocument.issuanceDate).set('hour', 12).tz("Europe/Rome").format("YYYY-MM-DDTHH:mm:ss")) : undefined;
        }
        setNewDocument(prevDocument => ({
          ...prevDocument,
          issuanceDate: date
        }));*/

        function isValidDocumentType(type: string): type is DocumentType {
          return Object.values(DocumentType).includes(type as DocumentType);
      }
      if(isValidDocumentType(newDocument.type)){

        const latLng = newDocument.coordinates?.coords;
        const coordinates1 = latLng && latLng.lat !== null && latLng.lng !== null
          ? new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(latLng.lat, latLng.lng))
          : new Coordinates(CoordinatesType.MUNICIPALITY, null);

        
        const finalDocument:Document = new Document(
          0,
          newDocument.title,
          newDocument.type,
          props.user?.username?props.user?.username:'',
          date,
          newDocument.language,
          Number(newDocument.pages),
          newDocument.stakeholders,
          newDocument.scale,
          newDocument.description,
          coordinates1
        );

        console.log(finalDocument)
  
        if(props.updating){
          if(newDocument.description!=oldForm?.description){
            console.log("nuovo")
            console.log(newDocument.description)
            console.log("vecchio")
            console.log(oldForm?.description)
            if(newDocument.description){
              await API.updateDescription(newDocument.id,newDocument.description);
              await props.fetchDocuments();
            }
            /*setDocuments((prev) => 
              prev.map((doc) => 
                doc.id == newDocument.id
                  ? { ...doc, description: newDocument.description } 
                  : doc 
              )
            );*/
          }
          const latLng = newDocument.coordinates.coords;

          if (
              latLng?.lat != null && 
              latLng?.lng != null /*&& 
              (latLng.lat !== oldForm?.coordinates.coords.lat || 
               latLng.lng !== oldForm?.coordinates.coords.lng)*/
          ) {
              await API.updateCoordinates(
                  newDocument.id,
                  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(Number(latLng.lat), Number(latLng.lng)))
              );
          }
          props.setUpdating(false);
        }
        else{
          await API.addDocument(finalDocument);
          props.setAdding(false)
        }
        await props.fetchDocuments();
  
        handleClose();
        setNewDocument(reset());
      }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  


  const linkDocument = async () => {
   if(currentDocument && targetDocumentId && targetLinkType){
   try{
    await API.createLink(currentDocument?.id, targetDocumentId, targetLinkType);
    await props.fetchDocuments();
    closeLinkingDialog();
   }
   catch(error){
    setLinkErrors([...linkErrors, "A link with this type already exists for this document"]);
    console.log(error)
   }
    
   }
    
  };

  useEffect(()=>{
    console.log(linkErrors)
  },[linkErrors])

  const handleSearchLinking = async () => {
    try {
      let matchingDocs = [];
      if (searchQuery.trim()) {
        // Fetch matching documents based on the search query
        matchingDocs = await API.searchDocumentsByTitle(searchQuery);
      } else {
        // Default to all documents if no query
        
        matchingDocs = props.documents;
        
      }
  
      // Exclude the current document
      const filteredDocs = matchingDocs.filter((doc: Document) => doc.id !== props.pin );
      setLinkDocuments(filteredDocs);
  
    } catch (error) {
      console.error("Error searching documents:", error);
    }
  };


  

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked)
    if(event.target.checked){
      const t = props.documents.filter((doc:any)=>(doc.coordinates.type=='MUNICIPALITY'))
      if(t){
        props.setDocuments(t)
      }
      props.setIsMunicipalityChecked(true); 
    }else{
      await props.fetchDocuments();
      props.setIsMunicipalityChecked(false); 
    }
    
  }




  

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if ( itemRefs.current[props.pin]) {
      console.log(props.pin)
        itemRefs.current[props.pin]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}, [props.pin]);


  return (
    <div className="container">
      <Typography variant="h6" sx={{ marginTop: 2}}>Documents</Typography>

      {/* Dialog for Adding New Document */}
      <Dialog open={open} onClose={handleClose}  className="custom-dialog">
        <DialogTitle>Add a New Document</DialogTitle>
          <DialogContent>
            <TextField className="white-input" autoFocus margin="dense" label="Title" name="title" required fullWidth value={newDocument.title} disabled={props.updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Stakeholders" name="stakeholders" required fullWidth value={newDocument.stakeholders} disabled={props.updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Scale" name="scale" required fullWidth value={newDocument.scale} disabled={props.updating?true:false} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="ex. 2022-01-01" name="issuanceDate" fullWidth value={newDocument.issuanceDate} disabled={props.updating?true:false} onChange={handleChange} />
            <FormControl component="fieldset" margin="dense" fullWidth disabled={props.updating}>
  <Typography variant="body1" sx={{ color: 'white', display: 'inline', marginLeft: 0 }}>Type: </Typography>
  <RadioGroup row name="type"  value={newDocument.type} onChange={handleChange}>
        <FormControlLabel
          value="informative_doc"
          control={<Radio disabled={props.updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: props.updating ? "gray" : "white" }}>informative_doc</Typography>}
        />
        <FormControlLabel
          value="prescriptive_doc"
          control={<Radio disabled={props.updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: props.updating ? "gray" : "white" }}>prescriptive_doc</Typography>}
        />
        <FormControlLabel
          value="design_doc"
          control={<Radio disabled={props.updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: props.updating ? "gray" : "white" }}>design_doc</Typography>}
        />
        <FormControlLabel
          value="technical_doc"
          control={<Radio disabled={props.updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: props.updating ? "gray" : "white" }}>technical_doc</Typography>}
        />
        <FormControlLabel
          value="material_effect"
          control={<Radio disabled={props.updating} sx={{ color: "white", '&.Mui-disabled': { color: "gray" }, '&.Mui-checked': { color: "lightblue" } }} />}
          label={<Typography sx={{ color: props.updating ? "gray" : "white" }}>material_effect</Typography>}
        />
      </RadioGroup>
    </FormControl>
            {/*<TextField className="white-input" margin="dense" required label="Language" name="language" fullWidth value={newDocument.language} disabled={props.updating?true:false} onChange={handleChange} />*/}
            <TextField
              select name="language"
              label="Select an option"
              value={newDocument.language}
              onChange={handleChange}
              fullWidth style={{backgroundColor: 'white'}}>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Swedish">Swedish</MenuItem>
            </TextField>
            <TextField className="white-input" margin="dense" label="Pages" name="pages" type="number" fullWidth value={newDocument.pages} disabled={props.updating?true:false} onChange={handleChange} />
            <label><input type="checkbox" checked={municipality} name="type_of_coordinates"/>All municipality</label>
            <Button color="primary" >Coordinates</Button>
            <Button color="primary" >Draw a polygon</Button>
            {coordinates_type && <><TextField className="white-input" margin="dense" label="Latitude" type="number" name="lat" fullWidth value={newDocument.coordinates?.coords?.lat || ""}   onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Longitude" type="number" name="lng" fullWidth value={newDocument.coordinates?.coords?.lng || ""}   onChange={handleChange} />
            <Button color="primary" onClick={handleMapCoord}>Choose on map</Button></>}
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
      <Box ref={containerRef} className="scrollable-list" style={{ height: "580px", overflowY: "auto", paddingRight: "10px" }}>
        <Grid container spacing={3}>
          {props.documents.map((document, i) => (
            <Grid item xs={12} key={i} ref={(el) => (itemRefs.current[document.id] = el)}>
              <DocDetails  handleSearchLinking={handleSearchLinking} document={document} loggedIn={props.loggedIn} user={props.user} fetchDocuments={props.fetchDocuments} pin={props.pin} setNewPin={props.setNewPin} /*docExpand={docExpand} setDocExpand={setDocExpand}*/ updating={props.updating} setUpdating={props.setUpdating} newDocument={newDocument} setNewDocument={setNewDocument} onLink={() => openLinkingDialog(document)} />
            </Grid>
          ))
        }
        </Grid>

      </Box>
      <div>
      <label>
        <input 
          type="checkbox" 
          checked={props.isMunicipalityChecked} 
          onChange={handleCheckboxChange} 
        />
        All municipality documents
      </label>
      </div>

      {props.loggedIn && props.user?.type === "urban_planner" && (
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          onClick={handleClickOpen} 
          style={{ marginTop: "38px" }}
        >
          Add a new document
        </Button>
      )}


      {/* Linking Dialog */}
      <Dialog open={openLinkDialog} onClose={closeLinkingDialog} className="custom-dialog">
        <DialogTitle>Link Document</DialogTitle>
        <DialogContent>
          {/* Search Input */}
          <div className="search">
            <InputBase
              placeholder="Search by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: 'white',
                '& ::placeholder': { color: 'white' },
              }}
              className="inputRoot"
            />
            <Button
              onClick={handleSearchLinking}
              color="primary"
              variant="contained"
              style={{ marginLeft: '8px' }}
            >
              Search
            </Button>
            
          </div>

          


          {/* Search Results */}
          {
            linkDocuments.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No matched Document to be linked
              </Typography>
            ) : (
              <List>
                {linkDocuments.map((doc) => (
                  <ListItemButton
                    key={doc.id}
                    onClick={() => setTargetDocumentId(doc.id)}
                  >
                    <ListItemText primary={doc.title} />
                  </ListItemButton>
                ))}
              </List>
            )
          }

          <select onChange={handleSelectChange} value={targetLinkType}>
                  <option value="direct" selected>direct</option>
                  <option value="collateral">collateral</option>
                  <option value="projection">projection</option>
                  <option value="update">update</option>
                </select>
                {linkErrors.length > 0 && (
            <div className="error-messages">
              {linkErrors.map((error, index) => (
                <p key={index} style={{ color: 'red' }}>{error}</p> 
              ))}
            </div>)}
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



