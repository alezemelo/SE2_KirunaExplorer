import React, { useState } from "react";
import { Button, Box, Typography, Card, CardContent, TextField, IconButton } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import dayjs from "dayjs";
import { DocumentType } from "../../type";

export interface Coordinates {
  lat: number;
  lng: number;
}

interface DocDetailsProps {
  document: DocumentType;
  onLink: () => void;
  fetchDocuments: () => Promise<void>;
  setNewDocument: (newDocument: DocumentType) => void;
}

const DocDetails: React.FC<DocDetailsProps> = ({ document, onLink, fetchDocuments, setNewDocument }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLat, setEditLat] = useState(false);
  const [editLng, setEditLng] = useState(false);
  const [description, setDescription] = useState(document.description);
  const [lat, setLat] = useState<string>(document.coordinates?.lat.toString() || '');
  const [lng, setLng] = useState<string>(document.coordinates?.lng.toString() || '');
  const [expand, setExpand] = useState(false);

  const handleToggleExpand = () => setExpand(!expand);

  const connections = document.connection || []; 
  const displayedConnections = expand ? connections : connections.slice(0, 3);

  const renderConnections = () => (
    <Box marginTop={1}>
      <Typography variant="body2">
        <strong>Connections:</strong>
      </Typography>
      <Box display="flex" flexDirection="column" marginTop={1}>
        {connections.length > 0 ? (
          displayedConnections.map((conn, index) => (
            <Typography key={index} variant="body2">
              {conn}
            </Typography> 
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No connections available.
          </Typography>
        )}

        {connections.length > 3 && (
          <IconButton onClick={handleToggleExpand} aria-label="expand">
            {expand ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        )}
      </Box>
    </Box>
  );

  const handleLatChange = (event: React.ChangeEvent<HTMLInputElement>) => setLat(event.target.value);
  const handleLngChange = (event: React.ChangeEvent<HTMLInputElement>) => setLng(event.target.value);

  const handleSaveCoordinates = async () => {
    if(lat && lng){
      if (Number(lat) < -90 || Number(lat) > 90 || Number(lng) < -180 || Number(lng) > 180) {
        console.error("Invalid coordinates");
      } else {
        try {
          const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${document.id}/coordinates`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }),
          });

          if (!response.ok) throw new Error("Error: " + response.statusText);
          
          await fetchDocuments();
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, field: "lat" | "lng") => {
    if (event.key === 'Enter') {
      handleSaveCoordinates();
      if (field === "lat") setEditLat(false);
      if (field === "lng") setEditLng(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
  const toggleDescription = () => setShowDescription(!showDescription);
  const toggleEditDescription = () => setEditDescription(true);
  const closeEditDescription = () => {
    setEditDescription(false);
    setDescription(document.description)
  }

  const saveDescription = async () => {
    try {
      const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${document.id}/description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) throw new Error("Error: " + response.statusText);
      
      setEditDescription(false);
      await fetchDocuments();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card elevation={6} style={{ margin: "20px 0", padding: "10px" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Title: </strong>{document.title}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2"><strong>Stakeholders:</strong> {document.stakeholders}</Typography>
          <Typography variant="body2"><strong>Scale:</strong> {document.scale}</Typography>
          <Typography variant="body2"><strong>Issuance date:</strong> {document.issuance_date ? dayjs(document.issuance_date).format("YYYY-MM-DD") : ''}</Typography>
          <Typography variant="body2"><strong>Type:</strong> {document.type}</Typography>
          
          {renderConnections()}

          <Typography variant="body2"><strong>Language:</strong> {document.language}</Typography>
          <Typography variant="body2"><strong>Pages:</strong> {document.pages}</Typography>

          {/* Editable Latitude */}
          <Box display="flex" alignItems="center" gap={2} marginTop={2}>
            <Box display="flex" alignItems="center">
              <Typography variant="body2"><strong>Latitude:</strong></Typography>
              {editLat ? (
                <TextField
                  value={lat}
                  onChange={handleLatChange}
                  onBlur={() => { setEditLat(false); handleSaveCoordinates(); }}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e, "lat")}
                  autoFocus
                  variant="outlined"
                  size="small"
                  placeholder="Enter latitude"
                  style={{ marginLeft: '8px', width: '120px' }}
                />
              ) : (
                <Typography
                  variant="body2"
                  style={{ marginLeft: '8px', cursor: 'pointer', backgroundColor: '#f3f3f3', padding: '4px', borderRadius: '8px' }}
                  onClick={() => setEditLat(true)}
                >
                  {lat || "Enter latitude"}
                </Typography>
              )}
            </Box>

            {/* Editable Longitude */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2"><strong>Longitude:</strong></Typography>
              {editLng ? (
                <TextField
                  value={lng}
                  onChange={handleLngChange}
                  onBlur={() => { setEditLng(false); handleSaveCoordinates(); }}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e, "lng")}
                  autoFocus
                  variant="outlined"
                  size="small"
                  placeholder="Enter longitude"
                  style={{ marginLeft: '8px', width: '120px' }}
                />
              ) : (
                <Typography
                  variant="body2"
                  style={{ marginLeft: '8px', cursor: 'pointer', backgroundColor: '#f3f3f3', padding: '4px', borderRadius: '8px' }}
                  onClick={() => setEditLng(true)}
                >
                  {lng || "Enter longitude"}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Description Section */}
        {!editDescription && showDescription && (
          <Typography variant="body2" style={{ marginTop: "10px", whiteSpace: "pre-line", wordWrap: "break-word" }}>
            <strong>Description:</strong> {description}
          </Typography>
        )}

        {editDescription ? (
          <>
            <TextField value={description} autoFocus fullWidth multiline rows={6} onChange={handleDescriptionChange} />
            <Box display="flex" justifyContent="space-between" style={{ marginTop: "10px", width: "100%" }}>
              {/* Save Button */}
              <Button
                variant="contained"
                color="primary"
                style={{ width: "48%" }}
                onClick={saveDescription}
              >
                Save
              </Button>

              {/* Cancel Button */}
              <Button
                variant="contained"
                color="error"
                style={{ width: "48%" }}
                onClick={closeEditDescription}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : null}


        <Box display="flex" justifyContent="space-between" style={{ marginTop: "10px", width: "100%" }}>
          {/* Toggle Description Button */}
          {!editDescription && (
            <Button variant="contained" color="primary" style={{ width: "48%" }} onClick={toggleDescription}>
              {showDescription ? "Hide Description" : "Show Description"}
            </Button>
          )}

          {/* Link Document or Edit Description Button */}
          {!showDescription && !editDescription ? (
            <Button variant="contained" color="secondary" style={{ width: "48%" }} onClick={onLink}>
              Link Document
            </Button>
          ) : !editDescription ? (
            <Button variant="contained" color="secondary" style={{ width: "48%" }} onClick={toggleEditDescription}>
              Edit Description
            </Button>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DocDetails;

