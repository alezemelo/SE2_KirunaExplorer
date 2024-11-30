import React, { useEffect, useState } from "react";
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
  MenuItem,
  Alert,
  FormControl,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MapIcon from "@mui/icons-material/Map";

import { DocumentType as DocumentLocal, User, Coordinates as CoordinateLocal } from "../../type";
import { Document, DocumentType } from "../../models/document";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";
import DocDetails from "../DocDetails/DocDetails";
import API from "../../API";

export const ACTUAL_STAKEHOLDERS = [
  { name: "White Arkitekter" },
  { name: "Kiruna kommun" },
  { name: "Residents" },
  { name: "LKAB" },
];

interface DocumentListProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  fetchDocuments: () => Promise<void>;
  pin: number;
  setNewPin: any;
  coordMap?: CoordinateLocal | undefined;
  setCoordMap: any;
  adding: boolean;
  setAdding: any;
  loggedIn: boolean;
  user: User | undefined;
  updating: boolean;
  setUpdating: any;
}

const DocumentList: React.FC<DocumentListProps> = (props) => {
  const reset = () => ({
    id: 0,
    title: "",
    stakeholders: "",
    scale: "",
    lastModifiedBy: "admin",
    issuanceDate: "",
    type: "informative_doc",
    connection: [],
    language: "English", // Default to English
    pages: 1,
    description: "",
    coordinates: null,
  });

  const [open, setOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<DocumentLocal>(reset());
  const [errors, setErrors] = useState<string[]>([]);
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name!]: value });
  };

  const handleAddNewStakeholder = async () => {
    if (!newStakeholder.trim()) {
      alert("Stakeholder name cannot be empty.");
      return;
    }

    try {
      const response = await API.addStakeholder({ name: newStakeholder.trim() });
      if (response.status === 201) {
        setStakeholderOptions((prev) => [...prev, { name: newStakeholder.trim() }]);
        setNewStakeholder("");
        alert("Stakeholder added successfully!");
      } else {
        alert("Failed to add stakeholder. It may already exist.");
      }
    } catch (error) {
      console.error("Error adding stakeholder:", error);
      alert("An error occurred while adding the stakeholder.");
    }
  };

  const handleAddNewDoctype = async () => {
    if (!newDoctype.trim()) {
      alert("Doctype name cannot be empty.");
      return;
    }
  
    try {
      const response = await API.addDoctype({ name: newDoctype.trim() });
      if (response.status === 201) {
        setDoctypeOptions((prev) => [...prev, newDoctype.trim()]);
        setNewDoctype("");
        alert("Doctype added successfully!");
      } else {
        alert("Failed to add doctype. It may already exist.");
      }
    } catch (error) {
      console.error("Error adding doctype:", error);
      alert("An error occurred while adding the doctype.");
    }
  };
  

  const handleAddDocument = async () => {
    const newErrors: string[] = [];

    // Validations
    if (!newDocument.title) {
      newErrors.push("Title is required.");
    }
    if (!newDocument.language) {
      newErrors.push("Language is required.");
    }
    if (!newDocument.stakeholders) {
      newErrors.push("Stakeholder is required.");
    }
    if (!newDocument.type) {
      newErrors.push("Document type is required.");
    }
    if (!newDocument.scale) {
      newErrors.push("Scale is required.");
    }
    if (!newDocument.description) {
      newErrors.push("Description is required.");
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      return;
    }

    try {
      const latLng = newDocument.coordinates?.coords;
      const coordinates = latLng
        ? new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(latLng.lat, latLng.lng))
        : new Coordinates(CoordinatesType.MUNICIPALITY, null);

      const finalDocument = new Document(
        0,
        newDocument.title,
        newDocument.type as DocumentType,
        props.user?.username || "admin",
        newDocument.issuanceDate,
        newDocument.language,
        Number(newDocument.pages),
        newDocument.stakeholders,
        newDocument.scale,
        newDocument.description,
        coordinates
      );

      await API.addDocument(finalDocument);
      await props.fetchDocuments();
      handleClose();
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewDocument(reset());
    setErrors([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
    props.setAdding(true);
  };

  const handleSearchLinking = async () => {
    // Logic for searching and linking documents
  };

  return (
    <div className="container">
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Documents
      </Typography>

      {/* Document List */}
      <Box className="scrollable-list" style={{ height: "580px", overflowY: "auto", paddingRight: "10px" }}>
        <Grid container spacing={3}>
          {props.documents.map((document, i) => (
            <Grid item xs={12} key={i}>
              <DocDetails
                document={document}
                loggedIn={props.loggedIn}
                user={props.user}
                fetchDocuments={props.fetchDocuments}
                pin={props.pin}
                setNewPin={props.setNewPin}
                onLink={() => console.log("Link action triggered")} // Replace with actual linking logic
                handleSearchLinking={handleSearchLinking}
                updating={props.updating}
                setUpdating={props.setUpdating}
                newDocument={newDocument}
                setNewDocument={setNewDocument}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {props.loggedIn && props.user?.type === "urban_planner" && (
        <Button fullWidth variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: "38px" }}>
          Add a new document
        </Button>
      )}

      {/* Add Document Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add a New Document</DialogTitle>
        <DialogContent>
          {errors.length > 0 && (
            <Box mt={2}>
              {errors.map((error, index) => (
                <Alert severity="error" key={index} sx={{ marginBottom: 1 }}>
                  {error}
                </Alert>
              ))}
            </Box>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Title (required)"
            name="title"
            required
            fullWidth
            value={newDocument.title}
            onChange={handleChange}
          />

          {/* Stakeholders */}
          <FormControl fullWidth margin="dense">
  <TextField
    select
    label="Stakeholders"
    name="stakeholders"
    required
    value={newDocument.stakeholders}
    onChange={handleChange}
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
  onClick={handleAddNewStakeholder}
>
  Add Stakeholder
</Button>

          {
            /* Document Type */

          }

<FormControl fullWidth margin="dense">
  <TextField
    select
    label="Document Type"
    name="type"
    required
    value={newDocument.type}
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
  <Button
    variant="outlined"
    color="primary"
    onClick={handleAddNewDoctype}
    style={{ marginTop: "8px" }}
  >
    Add Document Type
  </Button>
</FormControl>

          {/* Other fields */}
          <TextField
            margin="dense"
            label="Scale (required)"
            name="scale"
            required
            fullWidth
            value={newDocument.scale}
            onChange={handleChange}
          />

          {/* Latitude and Longitude */}
          <TextField
            margin="dense"
            label="Latitude"
            name="lat"
            fullWidth
            value={newDocument.coordinates?.coords?.lat || ""}
            onChange={(e) =>
              setNewDocument({
                ...newDocument,
                coordinates: {
                  ...newDocument.coordinates,
                  coords: { ...newDocument.coordinates?.coords, lat: e.target.value },
                },
              })
            }
          />
          <TextField
            margin="dense"
            label="Longitude"
            name="lng"
            fullWidth
            value={newDocument.coordinates?.coords?.lng || ""}
            onChange={(e) =>
              setNewDocument({
                ...newDocument,
                coordinates: {
                  ...newDocument.coordinates,
                  coords: { ...newDocument.coordinates?.coords, lng: e.target.value },
                },
              })
            }
          />
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            color="primary"
            onClick={() => console.log("Map selection triggered")}
            style={{ marginTop: "16px", marginBottom: "24px", width: "100%" }}
          >
            Choose on Map
          </Button>

          {/* Description */}
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            required
            rows={4}
            value={newDocument.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleAddDocument} color="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentList;


