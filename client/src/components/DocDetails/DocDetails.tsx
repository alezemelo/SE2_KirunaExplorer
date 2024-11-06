import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Button, TextField, IconButton } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { DocumentType } from "../../App";

export interface Coordinates {
  lat: number;
  lng: number;
}

interface DocDetailsProps {
  document: DocumentType;
  onLink: () => void;
  fetchDocuments: () => Promise<void>;
}

const DocDetails: React.FC<DocDetailsProps> = ({ document, onLink, fetchDocuments }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLat, setEditLat] = useState(false);
  const [editLng, setEditLng] = useState(false);
  const [description, setDescription] = useState(document.description);
  const [lat, setLat] = useState<string>(document.coordinates?.lat.toString() || '');
  const [lng, setLng] = useState<string>(document.coordinates?.lng.toString() || '');
  const [expand, setExpand] = useState(false);

  const handleToggleExpand = () => setExpand(!expand);

  const displayedConnections = expand ? document.connection : document.connection.slice(0, 3);

  const renderConnections = () => (
    <Typography variant="body2">
      <strong>Connections:</strong>
      <Box display="flex" flexDirection="column" marginTop={1}>
        {displayedConnections.map((conn, index) => (
          <div key={index}>{conn}</div>
        ))}
        {document.connection.length > 3 && (
          <IconButton onClick={handleToggleExpand} aria-label="expand">
            {expand ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        )}
      </Box>
    </Typography>
  );

  const handleLatChange = (event: React.ChangeEvent<HTMLInputElement>) => setLat(event.target.value);
  const handleLngChange = (event: React.ChangeEvent<HTMLInputElement>) => setLng(event.target.value);

  const handleSaveCoordinates = async () => {
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
  const closeEditDescription = () => setEditDescription(false);

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
          <Typography variant="body2"><strong>Issuance date:</strong> {document.issuanceDate}</Typography>
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
                  onKeyPress={(e) => handleKeyPress(e, "lat")}
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
                  onKeyPress={(e) => handleKeyPress(e, "lng")}
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
        {showDescription && (
          <Typography variant="body2" style={{ marginTop: "10px" }}>
            <strong>Description:</strong> {description}
          </Typography>
        )}

        {editDescription ? (
          <>
            <TextField value={description} autoFocus fullWidth multiline rows={4} onChange={handleDescriptionChange} />
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







