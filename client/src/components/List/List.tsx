/* eslint-disable @typescript-eslint/no-explicit-any */
// List.tsx
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { point, booleanPointInPolygon, Coord, polygon } from '@turf/turf';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
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
  MenuItem,
  Alert
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from '@mui/icons-material/Add';

import { DocumentType as DocumentLocal, User, Coordinates as CoordinateLocal } from "../../type";
import DocDetails from "../DocDetails/DocDetails";
import "./List.css";
import API from "../../API";
import CloseIcon from '@mui/icons-material/Close';
import { Document, DocumentType } from "../../models/document";
import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from "../../models/coordinates";
import { title } from "process";



interface DocumentListProps {
  newDocument: DocumentLocal;
  setNewDocument: React.Dispatch<React.SetStateAction<DocumentLocal>>;
  reset: () => DocumentLocal;
  setLinkDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setOpenLinkDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDocument: React.Dispatch<React.SetStateAction<Document | null>>;
  OpenLinkingDialog: (document:Document) => void;
  currentDocument: Document | null;
  //handleSearchLinking: () => Promise<void>;
  linkDocuments: Document[];
  openLinkDialog: boolean;
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  fetchDocuments: () => Promise<void>;
  pin: number,
  setNewPin: any;
  coordMap?: CoordinateLocal | undefined;
  setCoordMap: any;
  adding: boolean;
  setAdding: any;
  loggedIn: boolean;
  user: User | undefined;
  updating: boolean;
  setUpdating: any;
  isMunicipalityChecked: boolean;
  setIsMunicipalityChecked: any;
  geojson: any;
  drawing: boolean;
  setDrawing: any;
  polygon:any;
  setPolygon:any;
  setPin:any;
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

export const ACTUAL_STAKEHOLDERS = [
  { name: "White Arkitekter" },
  { name: "Kiruna kommun" },
  { name: "Residents" },
  { name: "LKAB" },
];




const DocumentList: React.FC<DocumentListProps> = (props) => {
  
  const [open, setOpen] = useState(false);

  const [targetDocumentId, setTargetDocumentId] = useState(0);
  const [targetLinkType, setTargetLinkType] = useState("direct");
  const [errors, setErrors] = useState<string[]>([]);
  const [stakeholderMessage, setStakeholderMessage] = useState<string>("");
  const [doctypeMessage, setDoctypeMessage] = useState<string>("");
  const [scaleMessage, setScaleMessage] = useState<string>("");
  const [oldForm, setOldForm] = useState<DocumentLocal | null>(null);
  const [searchLinkQuery, setSearchLinkQuery] = useState<string>("");
  const [linkDocuments, setLinkDocuments] = useState<Document[]>([]);
  const [linkErrors, setLinkErrors] = useState<string[]>([]);
  const [coordinates_type, setCoordinatesType] = useState<CoordinatesType>(CoordinatesType.MUNICIPALITY);
  const [dateOption, setDateOption] = useState("fullDate"); // Default to fullDate
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [stakeholderOptions, setStakeholderOptions] = useState(ACTUAL_STAKEHOLDERS);
  const [newStakeholder, setNewStakeholder] = useState("");
  const [newDoctype, setNewDoctype] = useState("");
  const [doctypeOptions, setDoctypeOptions] = useState([
    "informative_doc",
    "prescriptive_doc",
    "design_doc",
    "technical_doc",
    "material_effect",
  ]);
  const [scaleOptions, setScaleOptions] = useState(["1:100", "1:200", "1:500", "1:1000", "1:2000", "1:5000"]);
  const [newScale, setNewScale] = useState("");

  const [loading, setLoading] = useState(false);

  const handleDateOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOption(e.target.value);
    setYear("");
    setMonth("");
    setDay("");
  };

  const getIssuanceDate = () => {
    if (dateOption === "year") {
      // return year ? `${year}` : "";
      return year;
    }
    if (dateOption === "yearMonth") {
      // return year && month ? `${year}-${month.padStart(2, "0")}` : "";
      return `${year}-${month.padStart(2, "0")}`;
    }
    if (dateOption === "fullDate") {
      return year && month && day
        ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        : "";
    }
    return "";
  };

  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  const handleAddNewDoctype = async () => {
    if (!newDoctype.trim()) {
      setDoctypeMessage("Documen type name cannot be empty.");
      return;
    }

    try {
      const response = await API.addDoctype({ name: newDoctype.trim() });
      if (response.status === 201) {
        setDoctypeOptions((prev) => [...prev, newDoctype.trim()]);
        setNewDoctype("");
        setDoctypeMessage("Doctype added successfully!");
      }
    } catch (error: any) {
      console.error("Error adding doctype:", error);
      if (error.message.includes("already exists")) {
        setDoctypeMessage("Failed to add Document Type. It already exists.");
      } else if (error.message.includes("Invalid")) {
        setDoctypeMessage("Document type names must not be empty")
      } else {
        setDoctypeMessage("An error occurred while adding the stakeholder.")
      }
    }
  };


  const handleAddNewScale = async () => {

    const trimmedScale = newScale.trim();


    if (!trimmedScale) {
      setScaleMessage("Scale value cannot be empty.");
      return;
    }


    if (!/^\d+:\d+$/.test(trimmedScale)) {
      setScaleMessage("Invalid format. Scale must be formatted like '1:integer_number'.");
      return;
    }


    if (scaleOptions.includes(trimmedScale)) {
      // Set the document scale to the existing scale
      props.setNewDocument((prev) => ({ ...prev, scale: trimmedScale }));
      
      setNewScale("");
    
      setScaleMessage("This scale already exists and has been selected from the list.");
      return;
    }


    if (trimmedScale.includes("Text")) {
      setScaleMessage("Invalid format. Scale must be formatted like '1:integer_number' without text.");
      return;
    }


    const [_, secondPart] = trimmedScale.split(":");
    if (secondPart.includes(".")) {
      setScaleMessage("Invalid format. Scale must be formatted like '1:integer_number' without decimals.");
      return;
    }


    try {
      const response = await API.addScale({ value: trimmedScale });
      if (response.status === 201) {
        setScaleOptions((prev) => [...prev, trimmedScale]);
        setNewScale("");
        setScaleMessage("Scale added successfully!");
      }
    } catch (error: any) {
      console.error("Error adding scale:", error);

      if (error.message.includes("already exists")) {
        setScaleMessage("Failed to add scale. It already exists.");
      } else if (error.message.includes("Invalid")) {
        setScaleMessage("Scale must be formatted like '1:integer_number'.");
      } else {
        setScaleMessage("An error occurred while adding the scale.");
      }
    }
  };


  const handleAddNewStakeholder = async () => {
    if (!newStakeholder.trim()) {
      alert("Stakeholder name cannot be empty.");
      return;
    }

    try {
      // Add stakeholder to the database
      await API.addStakeholder({ name: newStakeholder.trim() });

      // Refresh stakeholder options from the backend
      const updatedStakeholders = await API.getAllStakeholders(); // Fetch all stakeholders from the backend
      setStakeholderOptions(updatedStakeholders);

      // Clear the input field
      setNewStakeholder("");

      setStakeholderMessage("Stakeholder added successfully!");
      //alert("Stakeholder added successfully!");
    } catch (error: any) {
      if (error.message.includes("Stakeholder already exists")) {
        setStakeholderMessage("Stakeholder already exists.");
        //alert("Stakeholder already exists.");
      } else if (error.message.includes("Invalid stakeholder name")) {
        setStakeholderMessage("Invalid stakeholder name. Please enter a valid name.");
      } else {
        setStakeholderMessage("An error occurred while adding the stakeholder.");
      }
      console.error("Error adding stakeholder:", error);
    }
  };



  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTargetLinkType(value);
  };



  useEffect(() => {
    const fetchDropdownItems = async () => {
      try {
        const [currentScales, currentDoctypes, currentStakeholders] = await Promise.all([
          API.getAllScales(),
          API.getAllDoctypes(),
          API.getAllStakeholders(),
        ])
        setScaleOptions(currentScales.map((scale) => scale.value));;
        setDoctypeOptions(currentDoctypes.map((doctype) => doctype.name));
        setStakeholderOptions(currentStakeholders);
      } catch (error) {
        alert("Error fetching scales, stakeholders and doctypes:");
      } finally {
        setLoading(false);
      }
    }
    if (open) {
      setLoading(true); // Start loading animation
      fetchDropdownItems().catch(console.error);
    }
  }, [open]);


  useEffect(() => {
    if (props.updating) {
      setOldForm(props.newDocument);
      setCoordinatesType(props.newDocument.coordinates.type);
      setOpen(true);
    }
  }, [props.updating])

  useEffect(() => {
    if (props.updating && props.newDocument.issuanceDate) {
      const dateParts = props.newDocument.issuanceDate.split("-");
      setYear(dateParts[0] || "");
      setMonth(dateParts[1] || "");
      setDay(dateParts[2] || "");
      setDateOption(
        dateParts.length === 3
          ? "fullDate"
          : dateParts.length === 2
            ? "yearMonth"
            : "year"
      );
    }
  }, [props.updating, props.newDocument.issuanceDate]);



  useEffect(() => {
    console.log(props.adding)
    console.log(props.updating)
    if (props.coordMap && (props.adding || props.updating)) {
      props.newDocument.coordinates = (new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(props.coordMap.lat, props.coordMap.lng)))
      setOpen(true);
    }
  }, [props.coordMap])


  const handleClickOpen = () => {
    setOpen(true);
    props.setAdding(true);
  };
  const handleClose = () => {
    setOpen(false);
    props.setUpdating(false);
    props.setAdding(false);
    props.setDrawing(false);
    props.setNewDocument(props.reset());
    setDoctypeMessage("");
    setStakeholderMessage("");
    setScaleMessage("");
    setErrors([]);
    setYear("");
    setMonth("");
    setDay("");
    setDateOption("fullDate");
  }

  const openLinkingDialog = (document: Document) => {
    props.setCurrentDocument(document);
    props.setOpenLinkDialog(true);

  };
  const closeLinkingDialog = () => {
    props.setOpenLinkDialog(false);
    setTargetDocumentId(0);
    setTargetLinkType("direct");
    setLinkDocuments([]);
    setSearchLinkQuery('');
    setLinkErrors([])

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "lat") {
      props.setNewDocument({
        ...props.newDocument,
        coordinates: {
          ...props.newDocument.coordinates,
          coords: {
            ...props.newDocument.coordinates?.coords,
            lat: e.target.value
          }
        }
      });
    }
    else if (e.target.name == "lng") {
      props.setNewDocument({
        ...props.newDocument,
        coordinates: {
          ...props.newDocument.coordinates,
          coords: {
            ...props.newDocument.coordinates?.coords,
            lng: e.target.value
          }
        }
      });
    }
    else {
      props.setNewDocument({ ...props.newDocument, [e.target.name]: e.target.value });
    }
  }

  const handleMapCoord = () => {
    setOpen(false);
    //setAdding(true);
  }



  const handleAddDocument = async () => {
    const newErrors = [];

    // Validazioni
    if (!props.newDocument.title) {
      newErrors.push("Title is required.");
    }
    if (!props.newDocument.stakeholders) {
      newErrors.push("Stakeholders are required.");
    }
    if (!props.newDocument.description) {
      newErrors.push("Description is required.");
    }
    if (!props.newDocument.language) {
      newErrors.push("Language is required.");
    }
    if (!props.newDocument.scale) {
      newErrors.push("Scale is required.");
    }
    if (typeof props.newDocument.title !== 'string') {
      newErrors.push("Title must be a string.");
    }
    if (typeof props.newDocument.scale !== 'string') {
      newErrors.push("Scale must be a string.");
    }
    if (typeof props.newDocument.type !== 'string') {
      newErrors.push("Type must be a string.");
    }
    if (typeof props.newDocument.language !== 'string') {
      newErrors.push("Language must be a string.");
    }
    if (props.newDocument.pages && Number(props.newDocument.pages) <= 0) { // Corretto: controlliamo pages, non language
      newErrors.push("Pages must be greater than 0");
    }
    if (props.newDocument.description && typeof props.newDocument.description !== 'string') {
      newErrors.push("Description must be a string.");
    }
    let skipCoordsCheck = false;
    if (
      (!props.newDocument.coordinates?.coords?.lat && props.newDocument.coordinates?.coords?.lng) ||
      (props.newDocument.coordinates?.coords?.lat && !props.newDocument.coordinates?.coords?.lng)
    ) {
      newErrors.push("Latitude and Longitude must be defined.");
      skipCoordsCheck = true;
    }
    if (props.newDocument.coordinates?.coords?.lat && isNaN(Number(props.newDocument.coordinates?.coords?.lat))) {
      newErrors.push("Latitude must be a number.");
      console.error("lat was not a number")
      skipCoordsCheck = true;
    }
    if (props.newDocument.coordinates?.coords?.lng && isNaN(Number(props.newDocument.coordinates?.coords?.lng))) {
      newErrors.push("Longitude must be a number.");
      console.error("lng was not a number")
      skipCoordsCheck = true;
    }


    let coordinates1
    if (!skipCoordsCheck) {
      if (
        (Number(props.newDocument.coordinates?.coords?.lat) < -90 || Number(props.newDocument.coordinates?.coords?.lat) > 90) ||
        (Number(props.newDocument.coordinates?.coords?.lng) < -180 || Number(props.newDocument.coordinates?.coords?.lng) > 180)
      ) {
        newErrors.push("Latitude and Longitude must be between -90 and 90 and -180 and 180.");
      }

      if (coordinates_type == CoordinatesType.MUNICIPALITY) {
        coordinates1 = new Coordinates(CoordinatesType.MUNICIPALITY, null);
      }
      if (coordinates_type == CoordinatesType.POINT) {
        const latLng1 = props.newDocument.coordinates?.coords;
        if (latLng1 && latLng1.lat !== null && latLng1.lng !== null) {
          if (!booleanPointInPolygon(point([latLng1.lng, latLng1.lat]), props.geojson.features[0])) {
            newErrors.push("coordinates out of the municipality area")
          } else {
            coordinates1 = new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(latLng1.lat, latLng1.lng))
          }
        } else {
          newErrors.push("Latitude and Longitude must be defined.");
        }
      } else if (coordinates_type == CoordinatesType.POLYGON){
        let validated = true;
        if(props.polygon){
          for(let i=0;i<props.polygon.length;i++){
            if(!booleanPointInPolygon(point([props.polygon[i].lng,props.polygon[i].lat]),props.geojson.features[0])){
              validated = false;
            }
          }
          if(!validated){
            newErrors.push("coordinates out of the municipality area")
          }else{
            coordinates1 = new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon(props.polygon))
          }
        }
      }
    } else {
      // skip
    }


    const issueDate = getIssuanceDate();
    if (!issueDate) {
      newErrors.push("Issuance date is required.");
    } else {
      if (!year) {
        newErrors.push("Year is required.");
      }
      if ((dateOption === "yearMonth") || (dateOption === "fullDate")) {
        if (!month) {
          newErrors.push("Month is required.");
        }
      }
      if (dateOption === "fullDate") {
        if (!day) {
          newErrors.push("Day is required.");
        }
      }
    }

    if ((dateOption === "year" && !dayjs(issueDate, 'YYYY', true).isValid()) ||
      (dateOption === "yearMonth" && !dayjs(issueDate, 'YYYY-MM', true).isValid()) ||
      (dateOption === "fullDate" && !dayjs(issueDate, 'YYYY-MM-DD', true).isValid())) {
      newErrors.push("Invalid date format.");
    }


    setErrors(newErrors);
    props.setPin(0) // This is needed to fix the bug of the random big pin which has now gotten worse

    // Procede solo se non ci sono errori
    if (newErrors.length === 0) {
      try {
        let formattedDate = issueDate;
        if (dateOption === "year") {
          formattedDate = year; // Only the year
        } else if (dateOption === "yearMonth") {
          formattedDate = `${year}-${month.padStart(2, "0")}`; // Year and month
        } else if (dateOption === "fullDate") {
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Full date
        }

        // Conversione della data
        // let date;
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

        const finalDocument: Document = new Document(
          0,
          props.newDocument.title,
          props.newDocument.type,
          props.user?.username ? props.user?.username : '',
          formattedDate,
          props.newDocument.language,
          Number(props.newDocument.pages),
          props.newDocument.stakeholders,
          props.newDocument.scale,
          props.newDocument.description,
          coordinates1
        );

        console.log(finalDocument)

        if (props.updating) {


          if (props.newDocument.description != oldForm?.description) {
            //console.log("nuovo")
            //console.log(newDocument.description)
            //console.log("vecchio")
            //console.log(oldForm?.description)
            if (props.newDocument.description) {
              await API.updateDescription(props.newDocument.id, props.newDocument.description);
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
          await API.updateCoordinates(
            props.newDocument.id,
            finalDocument.coordinates
          );

          await API.updateDocument(
            props.newDocument.id,
            {
              title: finalDocument.title,
              doctype: finalDocument.type,
              scale: finalDocument.scale,
              stakeholders: finalDocument.stakeholders,
              issuanceDate: finalDocument.issuanceDate
            }
          )

          
          props.setUpdating(false);
        }
        else {
          await API.addDocument(finalDocument);
        }
        await props.fetchDocuments();

        handleClose();
        props.setNewDocument(props.reset());

      } catch (error) {
        console.error("Error:", error);
      }
    }
  };



  const linkDocument = async () => {
    if (props.currentDocument && targetDocumentId && targetLinkType) {
      try {
        await API.createLink(props.currentDocument?.id, targetDocumentId, targetLinkType);
        await props.fetchDocuments();
        closeLinkingDialog();
      }
      catch (error) {
        setLinkErrors([...linkErrors, "A link with this type already exists for this document"]);
        console.log(error)
      }

    }

  };

  useEffect(() => {
    console.log(linkErrors)
  }, [linkErrors])

  const handleSearchLinking = async () => {
    try {
      let matchingDocs = [];
      console.log(searchLinkQuery)
      if (searchLinkQuery) {
        // Fetch matching documents based on the search query
        matchingDocs = await API.searchDocumentsByTitle(searchLinkQuery);
      } else {
        // Default to all documents if no query
        
        matchingDocs = await API.getDocuments();

      }
      // Exclude the current document
      const filteredDocs = matchingDocs.filter((doc: Document) => doc.id !== props.pin);
      console.log(filteredDocs)
      setLinkDocuments(filteredDocs);

    } catch (error) {
      console.error("Error searching documents:", error);
    }
  };




  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name == "municipality_filter") {
      console.log(event.target.checked)
      if (event.target.checked) {
        const t = props.documents.filter((doc: any) => (doc.coordinates.type == 'MUNICIPALITY'))
        if (t) {
          props.setDocuments(t)
        }
        props.setIsMunicipalityChecked(true);
        props.setNewPin(undefined);
      } else {
        await props.fetchDocuments();
        props.setIsMunicipalityChecked(false);
      }
    }
    else if (event.target.name == "coordinates_type") {
      // probably not needed
    }

  }

  // const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (itemRefs.current[props.pin]) {
      console.log(props.pin)
      itemRefs.current[props.pin]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [props.pin]);

  useEffect(() => {
    if (props.updating) {
      setCoordinatesType(props.newDocument.coordinates.type);
    }
  }, [props.updating])

  useEffect(() => {
    console.log(searchLinkQuery)
    handleSearchLinking();
  },[searchLinkQuery])


  return (
    <div className="container-list">
      <Typography variant="h6" sx={{ corlor: 'white' }}>Documents</Typography>

      {/* Document List */}
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box className="scrollable-list" sx={{ flex: 1 }}>
          <Grid container spacing={3}>
            {props.documents.map((document, i) => (
              <Grid item xs={12} key={i} ref={(el) => (itemRefs.current[document.id] = el)}>
                <DocDetails
                  document={document}
                  loggedIn={props.loggedIn}
                  user={props.user}
                  fetchDocuments={props.fetchDocuments}
                  pin={props.pin}
                  setNewPin={props.setNewPin}
                  onLink={() => openLinkingDialog(document)}
                  handleSearchLinking={handleSearchLinking}
                  updating={props.updating}
                  setUpdating={props.setUpdating}
                  newDocument={props.newDocument}
                  setNewDocument={props.setNewDocument}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ padding: '10px', flexShrink: 0 }}>
          <label>
            <input
              type="checkbox"
              checked={props.isMunicipalityChecked}
              name="municipality_filter"
              onChange={handleCheckboxChange}
            />
            All municipality documents
          </label>
        </Box>


        {props.loggedIn && props.user?.type === "urban_planner" && (
          <Box sx={{ padding: '10px', flexShrink: 0, }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              style={{ marginTop: "8px" }}
            >
              Add a new document
            </Button>
          </Box>
        )}




      </Box>



      {/* Add Document Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{props.updating ? "Update a" : "Add a New"} Document</DialogTitle>
        <DialogContent>

          <TextField
            autoFocus
            margin="dense"
            label="Title (required)"
            name="title"
            required
            fullWidth
            value={props.newDocument.title}
            onChange={handleChange}
          />

          {/* Stakeholders */}
          <FormControl fullWidth margin="dense" disabled={loading}>
            <TextField
              select
              label="Stakeholders"
              name="stakeholders"
              required
              value={props.newDocument.stakeholders || []} // Ensure it's an array
              onChange={(e) => {
                console.log(e.target.value);
                props.setNewDocument({ ...props.newDocument, stakeholders: e.target.value });
              }}
              SelectProps={{
                multiple: true, // Enable multiple selection
              }}
            >
              {stakeholderOptions.map((stakeholder) => (
                <MenuItem key={stakeholder.name} value={stakeholder.name}>
                  {stakeholder.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <TextField
            margin="dense"
            label="New Stakeholder"
            placeholder="Enter stakeholder name"
            fullWidth
            value={newStakeholder}
            onChange={(e) => setNewStakeholder(e.target.value)}
          />

          {stakeholderMessage &&
            <Alert severity={stakeholderMessage.includes("successfully") ? "success" : "error"} sx={{ marginBottom: 1 }}>
              {stakeholderMessage}
            </Alert>
          }

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{
              marginTop: "8px",
              marginBottom: "16px",
              backgroundColor: "white",
              border: "1px solid #1976d2",
              color: "#1976d2",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={async () => {
              if (!newStakeholder.trim()) {
                setStakeholderMessage("Stakeholder name cannot be empty.");
                return;
              }

              /*
              const matchedStakeholder = stakeholderOptions.find((stakeholder) => stakeholder.name.toLowerCase() === newStakeholder.trim().toLowerCase());
              if (matchedStakeholder && !newDocument.stakeholders.includes(matchedStakeholder.name)) {
                setNewDocument({...newDocument, stakeholders: [...newDocument.stakeholders, matchedStakeholder.name].join(', ')});
                setNewStakeholder(''); // Optionally reset the textbox after setting the dropdown
                console.log(newDocument)
                return;
              }
                */

              try {

                // Add the new stakeholder to the backend
                await API.addStakeholder({ name: newStakeholder.trim() });

                // Fetch the updated stakeholders from the backend
                const updatedStakeholders = await API.getAllStakeholders();
                setStakeholderOptions(updatedStakeholders);

                // Clear the input field
                setNewStakeholder("");
                setStakeholderMessage("Stakeholder added successfully!");
              } catch (error: any) {
                if (error.message.includes("Stakeholder already exists")) {
                  setStakeholderMessage("Stakeholder already exists.");
                  //alert("Stakeholder already exists.");
                } else if (error.message.includes("Invalid stakeholder name")) {
                  setStakeholderMessage("Invalid stakeholder name. Please enter a valid name.");
                } else {
                  setStakeholderMessage("An error occurred while adding the stakeholder.");
                }
                console.error("Error adding stakeholder:", error);
              }
            }}
          >
            Add Stakeholder
          </Button>




          {
            /* Document Type */

          }

          <FormControl fullWidth margin="dense" disabled={loading}>
            <TextField
              select
              label="Document Type"
              name="type"
              required
              value={props.newDocument.type}
              onChange={handleChange}
            >
              {doctypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            {/* Input and Button for Adding New Doctype */}
            <TextField
              margin="dense"
              label="New Document Type"
              placeholder="Enter document type"
              fullWidth
              value={newDoctype}
              onChange={(e) => setNewDoctype(e.target.value)}
            />

            {doctypeMessage &&
              <Alert severity={doctypeMessage.includes("successfully") ? "success" : "error"} sx={{ marginBottom: 1 }}>
                {doctypeMessage}
              </Alert>
            }

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddNewDoctype}
              style={{ marginTop: "8px" }}
            >
              Add Document Type
            </Button>
          </FormControl>

          {/* Scale */}
          <FormControl fullWidth margin="dense" disabled={loading}>
            <TextField
              select
              label="Scale (required)"
              name="scale"
              required
              value={props.newDocument.scale}
              onChange={handleChange}
            >
              {scaleOptions.map((scale) => (
                <MenuItem key={scale} value={scale}>
                  {scale}
                </MenuItem>
              ))}
            </TextField>

            {/* Input and Button for Adding New Scale */}
            <TextField
              margin="dense"
              label="New Scale"
              placeholder='Enter scale (e.g., "1:1000" or "Text")'
              fullWidth
              value={newScale}
              onChange={(e) => setNewScale(e.target.value)}
            />

            {scaleMessage &&
              <Alert severity={scaleMessage.includes("successfully") ? "success" : "error"} sx={{ marginBottom: 1 }}>
                {scaleMessage}
              </Alert>
            }

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddNewScale}
              style={{ marginTop: "8px" }}
            >
              Add Scale
            </Button>
          </FormControl>

          {/* Issuance Date */}
          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            Select Date Option:
          </Typography>
          <FormControl fullWidth margin="dense">
            <div>
              <label>
                <input
                  type="radio"
                  name="dateOption"
                  value="year"
                  checked={dateOption === "year"}
                  onChange={handleDateOptionChange}
                />
                Just Year
              </label>
              <label style={{ marginLeft: "15px" }}>
                <input
                  type="radio"
                  name="dateOption"
                  value="yearMonth"
                  checked={dateOption === "yearMonth"}
                  onChange={handleDateOptionChange}
                />
                Year and Month
              </label>
              <label style={{ marginLeft: "15px" }}>
                <input
                  type="radio"
                  name="dateOption"
                  value="fullDate"
                  checked={dateOption === "fullDate"}
                  onChange={handleDateOptionChange}
                />
                Full Date
              </label>
            </div>
          </FormControl>

          {dateOption === "year" && (
            <TextField
              margin="dense"
              label="Year"
              type="number"
              fullWidth
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          )}

          {dateOption === "yearMonth" && (
            <>
              <TextField
                margin="dense"
                label="Year"
                type="number"
                fullWidth
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Month"
                type="number"
                fullWidth
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </>
          )}
          {dateOption === "fullDate" && (
            <>
              <TextField
                margin="dense"
                label="Year"
                type="number"
                fullWidth
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Month"
                type="number"
                fullWidth
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Day"
                type="number"
                fullWidth
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </>
          )}

          {/*<FormControl component="fieldset" margin="dense" fullWidth disabled={props.updating}>
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
    </FormControl>*/}
          {/*<TextField className="white-input" margin="dense" required label="Language" name="language" fullWidth value={newDocument.language} disabled={props.updating?true:false} onChange={handleChange} />*/}
          <TextField
            select name="language"
            label="Select an option"
            value={props.newDocument.language}
            onChange={handleChange}
            fullWidth style={{ backgroundColor: 'white' }}>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Swedish">Swedish</MenuItem>
          </TextField>
          <TextField className="white-input" margin="dense" label="Pages" name="pages" type="number" fullWidth value={props.newDocument.pages} disabled={props.updating ? true : false} onChange={handleChange} />
          <label><input type="checkbox" checked={coordinates_type == CoordinatesType.MUNICIPALITY} onClick={() => setCoordinatesType(CoordinatesType.MUNICIPALITY)} name="type_of_coordinates" /><Button color="primary" >All municipality</Button></label>
          <Button color="primary" onClick={() => setCoordinatesType(CoordinatesType.POINT)}>Coordinates</Button>
          <Button color="primary" onClick={()=>{
            setCoordinatesType(CoordinatesType.POLYGON)
            props.setDrawing(true);
            setOpen(false);
            props
          }} >Draw a polygon</Button>
          {coordinates_type == CoordinatesType.POINT && <><TextField className="white-input" margin="dense" label="Latitude" type="text"/*"number"*/ name="lat" fullWidth value={props.newDocument.coordinates?.coords?.lat/* || ""*/} onChange={handleChange} />
            <TextField className="white-input" margin="dense" label="Longitude" type="text"/*"number"*/ name="lng" fullWidth value={props.newDocument.coordinates?.coords?.lng /*|| ""*/} onChange={handleChange} />
            <Button color="primary" onClick={handleMapCoord}>Choose on map</Button></>}
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            required
            rows={4}
            value={props.newDocument.description}
            onChange={handleChange}
          />
        </DialogContent>
        {errors.length > 0 && (
          <Box mt={2}>
            {errors.map((error, index) => (
              <Alert severity="error" key={index} sx={{ marginBottom: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}

        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAddDocument} color="primary">Save</Button>
        </DialogActions>
      </Dialog>








      {/* Linking Dialog */}
      <Dialog open={props.openLinkDialog} onClose={closeLinkingDialog} className="custom-dialog">
        <DialogTitle>New Connection</DialogTitle>
        <DialogContent>
          {/* Search Input */}
          <div className="search">
            <InputBase
              placeholder="Search by title…"
              value={searchLinkQuery}
              onChange={(e) => setSearchLinkQuery(e.target.value)}
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
                    <ListItemText primary={doc.title} primaryTypographyProps={{ style: { color: targetDocumentId == doc.id ? 'yellow' : 'white' } }} />
                  </ListItemButton>
                ))}
              </List>
            )
          }

          
          {linkErrors.length > 0 && (
            <div className="error-messages">
              {linkErrors.map((error, index) => (
                <p key={index} style={{ color: 'red' }}>{error}</p>
              ))}
            </div>)}
        </DialogContent>
        <select onChange={handleSelectChange} value={targetLinkType} style={{width: '100px'}}>
            <option value="direct" selected>direct</option>
            <option value="collateral">collateral</option>
            <option value="projection">projection</option>
            <option value="update">update</option>
          </select>
        <DialogActions>
          <Button onClick={linkDocument} color="primary">Create</Button>
          <Button onClick={closeLinkingDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


export default DocumentList;



