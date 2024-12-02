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
  MenuItem,
  Alert,
  FormControl,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from '@mui/icons-material/Add';

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
  selectedFile: File | null;
  setSelectedFile: any;
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
  const [dateOption, setDateOption] = useState("fullDate"); // Default to fullDate
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const handleDateOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOption(e.target.value);
    setYear("");
    setMonth("");
    setDay("");
  };

  const getIssuanceDate = () => {
    if (dateOption === "year") return year;
    if (dateOption === "yearMonth") return `${year}-${month}`;
    if (dateOption === "fullDate") return `${year}-${month}-${day}`;
    return "";
  };

  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  const handleMapLocationSelected = (lat: number, lng: number) => {
    setNewDocument((prev) => ({
      ...prev,
      coordinates: { coords: { lat, lng } },
    }));
    setIsSelectingLocation(false); // Exit location selection mode
  };



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

  const handleAddNewScale = async () => {
    if (!newScale.trim()) {
      alert("Scale value cannot be empty.");
      return;
    }

    try {
      const response = await API.addScale({ value: newScale.trim() });
      if (response.status === 201) {
        setScaleOptions((prev) => [...prev, newScale.trim()]);
        setNewScale("");
        alert("Scale added successfully!");
      } else {
        alert("Failed to add scale. It may already exist.");
      }
    } catch (error) {
      console.error("Error adding scale:", error);
      alert("An error occurred while adding the scale.");
    }
  }


  // const handleAddDocument = async () => {
  //   const newErrors: string[] = [];

  //   if (!newDocument.title) newErrors.push("Title is required.");
  //   if (!newDocument.language) newErrors.push("Language is required.");
  //   if (!Array.isArray(newDocument.stakeholders) || newDocument.stakeholders.length === 0) {
  //     newErrors.push("At least one stakeholder is required.");
  //   } else {
  //     // Ensure selected stakeholders exist in the database
  //     const validStakeholders = stakeholderOptions.map((s) => s.name);
  //     const invalidStakeholders = newDocument.stakeholders.filter(
  //       (s: string) => !validStakeholders.includes(s)
  //     );
  //     if (invalidStakeholders.length > 0) {
  //       newErrors.push(`Invalid stakeholders: ${invalidStakeholders.join(", ")}`);
  //     }
  //   }
  //   if (!newDocument.type) newErrors.push("Document type is required.");
  //   if (!newDocument.scale) newErrors.push("Scale is required.");
  //   if (!newDocument.description) newErrors.push("Description is required.");
  //   if (dateOption === "year" && !year) newErrors.push("Year is required.");
  //   if (dateOption === "yearMonth" && (!year || !month)) newErrors.push("Year and month are required.");
  //   if (dateOption === "fullDate" && (!year || !month || !day)) {
  //     newErrors.push("Year, month, and day are required.");
  //   }

  //   setErrors(newErrors);

  //   if (newErrors.length > 0) return;

  //   try {
  //     const finalDocument = new Document(
  //       0,
  //       newDocument.title,
  //       newDocument.type as DocumentType,
  //       props.user?.username || "admin",
  //       getIssuanceDate(),
  //       newDocument.language,
  //       Number(newDocument.pages),
  //       newDocument.stakeholders, // Ensure stakeholders are valid and exist in the backend
  //       newDocument.scale,
  //       newDocument.description,
  //       newDocument.coordinates
  //         ? new Coordinates(
  //             CoordinatesType.POINT,
  //             new CoordinatesAsPoint(newDocument.coordinates.coords.lat, newDocument.coordinates.coords.lng)
  //           )
  //         : new Coordinates(CoordinatesType.MUNICIPALITY, null)
  //     );

  //     await API.addDocument(finalDocument); // Save the document
  //     await props.fetchDocuments(); // Refresh the document list
  //     handleClose(); // Close the dialog
  //   } catch (error) {
  //     console.error("Error adding document:", error);
  //     alert("An error occurred while adding the document.");
  //   }
  // };

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

      alert("Stakeholder added successfully!");
    } catch (error: any) {
      if (error.message.includes("Stakeholder already exists")) {
        alert("Stakeholder already exists.");
      } else if (error.message.includes("Invalid stakeholder name")) {
        alert("Invalid stakeholder name. Please enter a valid name.");
      } else {
        alert("An error occurred while adding the stakeholder.");
      }
      console.error("Error adding stakeholder:", error);
    }
  };

  const handleAddDocument = async () => {
    const newErrors: string[] = [];

    if (!newDocument.title) newErrors.push("Title is required.");
    if (!newDocument.language) newErrors.push("Language is required.");
    if (!Array.isArray(newDocument.stakeholders) || newDocument.stakeholders.length === 0) {
      newErrors.push("At least one stakeholder is required.");
    } else {
      // Validate stakeholders against the backend
      const validStakeholders = stakeholderOptions.map((s) => s.name);
      const invalidStakeholders = newDocument.stakeholders.filter(
        (s: string) => !validStakeholders.includes(s)
      );
      if (invalidStakeholders.length > 0) {
        newErrors.push(`Invalid stakeholders: ${invalidStakeholders.join(", ")}`);
      }
    }
    if (!newDocument.type) newErrors.push("Document type is required.");
    if (!newDocument.scale) newErrors.push("Scale is required.");
    if (!newDocument.description) newErrors.push("Description is required.");
    if (dateOption === "year" && !year) newErrors.push("Year is required.");
    if (dateOption === "yearMonth" && (!year || !month)) newErrors.push("Year and month are required.");
    if (dateOption === "fullDate" && (!year || !month || !day)) {
      newErrors.push("Year, month, and day are required.");
    }

    setErrors(newErrors);

    if (newErrors.length > 0) return;

    try {
      const finalDocument = new Document(
        0,
        newDocument.title,
        newDocument.type as DocumentType,
        props.user?.username || "admin",
        getIssuanceDate(),
        newDocument.language,
        Number(newDocument.pages),
        newDocument.stakeholders, // Validated stakeholders
        newDocument.scale,
        newDocument.description,
        newDocument.coordinates
          ? new Coordinates(
            CoordinatesType.POINT,
            new CoordinatesAsPoint(newDocument.coordinates.coords.lat, newDocument.coordinates.coords.lng)
          )
          : new Coordinates(CoordinatesType.MUNICIPALITY, null)
      );

      await API.addDocument(finalDocument); // Save the document
      await props.fetchDocuments(); // Refresh the document list
      handleClose(); // Close the dialog
    } catch (error) {
      console.error("Error adding document:", error);
      alert("An error occurred while adding the document.");
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

  const [scaleOptions, setScaleOptions] = useState(["1:100", "1:200", "1:500", "1:1000", "1:2000", "1:5000"]);
  const [newScale, setNewScale] = useState("");






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
                selectedFile={props.selectedFile}
                setSelectedFile={props.setSelectedFile}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {props.loggedIn && props.user?.type === "urban_planner" && (
        <Button startIcon={<AddIcon />} fullWidth variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: "38px" }}>
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
              value={newDocument.stakeholders || []} // Ensure it's an array
              onChange={(e) => {
                setNewDocument({ ...newDocument, stakeholders: e.target.value });
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
                alert("Stakeholder name cannot be empty.");
                return;
              }

              try {
                // Add the new stakeholder to the backend
                await API.addStakeholder({ name: newStakeholder.trim() });

                // Fetch the updated stakeholders from the backend
                const updatedStakeholders = await API.getAllStakeholders();
                setStakeholderOptions(updatedStakeholders);

                // Clear the input field
                setNewStakeholder("");
                alert("Stakeholder added successfully!");
              } catch (error: any) {
                if (error.message.includes("Stakeholder already exists")) {
                  alert("Stakeholder already exists.");
                } else if (error.message.includes("Invalid stakeholder name")) {
                  alert("Invalid stakeholder name. Please enter a valid name.");
                } else {
                  alert("An error occurred while adding the stakeholder.");
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
          <FormControl fullWidth margin="dense">
            <TextField
              select
              label="Scale (required)"
              name="scale"
              required
              value={newDocument.scale}
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
            onClick={() => setIsSelectingLocation(true)} // Enable map selection mode
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

