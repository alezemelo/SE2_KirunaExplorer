import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Button, TextField } from "@mui/material";
import { DocumentType } from "../../App";
import { IconButton } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export interface Coordinates {
  lat: number;
  long: number;
}

// Specify the prop type in the component
interface DocDetailsProps {
  document: DocumentType;
  onLink: () => void; // Add this line to accept the onLink prop
  fetchDocuments:() => Promise<void>;
}

const DocDetails: React.FC<DocDetailsProps> = ({ document, onLink, fetchDocuments }) => {
  // State to manage description visibility
  const [showDescription, setShowDescription] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [description, setDescription] = useState(document.description);
  const [lat, setLat] = useState(document.coordinates?.lat || '');
  const [lng, setLng] = useState(document.coordinates?.lng || '');
  const [expand,setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded(!expand);
  }

  const handleLatChange = (event:React.ChangeEvent<HTMLInputElement>) => setLat(event.target.value);
  const handleLngChange = (event:React.ChangeEvent<HTMLInputElement>) => setLng(event.target.value);

  const handleSave = async() => {
    try{
      const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${document.id}/coordinates`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({lat, lng}), 
      });

      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }
      await fetchDocuments();
      
    }catch (error) {
      console.error("Error:", error);
    }
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave(); 
    }
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  // Toggle description visibility
  const toggleDescription = () => setShowDescription((prev) => !prev);
  const toggleEditDescription = () => {
    setEditDescription(true);
    toggleDescription();
  }
  const closeEdit = () => {
    setEditDescription(false);
      toggleDescription();
  }
  const saveDescription = async() => {
    try{
      const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${document.id}/description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({description}), 
      });

      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }
      setEditDescription(false);
      toggleDescription();
      await fetchDocuments();
      
    }catch (error) {
      console.error("Error:", error);
    }
  } 

  return (
    <Card elevation={6} style={{ margin: "20px 0", padding: "10px" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Title: </strong>
          {document.title}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2">
            <strong>Stakeholders:</strong> {document.stakeholders}
          </Typography>
          <Typography variant="body2">
            <strong>Scale:</strong> {document.scale}
          </Typography>
          <Typography variant="body2">
            <strong>Issuance date:</strong> {document.issuanceDate}
          </Typography>
          <Typography variant="body2">
            <strong>Type:</strong> {document.type}
          </Typography>
          <Typography variant="body2">
            <strong>Connections:</strong> {/*document.connection*/}
            {expand && (() => {
              let connections = [];
              for (let i = 0; i < document.connection.length; i++) {
                connections.push(
                  <div key={i}>{document.connection[i]}</div> 
                );
              }
          
              return connections;
            })()}
          </Typography>
          <div>
      <IconButton onClick={handleToggle} aria-label="expand">
        {expand ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>
    </div>
          <Typography variant="body2">
            <strong>Language:</strong> {document.language}
          </Typography>
          <Typography variant="body2">
            <strong>Pages:</strong> {document.pages}
          </Typography>
          <Typography variant="body2"><strong>Latitude:</strong>
        <TextField value={lat} onChange={handleLatChange} onKeyPress={handleKeyPress} onBlur={handleSave}  variant="outlined" size="small" style={{ marginLeft: '8px', width: '100px' }} />
      </Typography>
      <Typography variant="body2"><strong>Longitude:</strong>
        <TextField value={lng} onChange={handleLngChange} onKeyPress={handleKeyPress} onBlur={handleSave}  variant="outlined" size="small" style={{ marginLeft: '8px', width: '100px' }} />
      </Typography>
        </Box>

        {/* Toggleable Description */}
        {showDescription && (
          <Typography variant="body2" style={{ marginTop: "10px" }}>
          <strong>Description:</strong> {description}
        </Typography>
        )}
        {editDescription? 
        <>
          <TextField value={description} autoFocus fullWidth multiline rows={4} onChange={handleDescriptionChange}></TextField>
          <Button variant="contained"  color="primary" style={{ marginTop: "10px" }} onClick={saveDescription}>
            Save
        </Button>
        <Button variant="contained"  color="primary" style={{ marginTop: "10px" }} onClick={closeEdit}>
            Cancel
        </Button>
        </>
        :
        <></>
        }

        {/* Toggle Button */}
        {!editDescription && <Button variant="contained"  color="primary" style={{ marginTop: "10px" }} onClick={toggleDescription}>
          {showDescription ? "Hide Description" : "Show Description"}
        </Button>}

        {/* Button to trigger linking */}
        {!showDescription && !editDescription ? <Button 
          variant="contained" 
          color="secondary" 
          style={{ marginTop: "10px" }} 
          onClick={onLink} // Call onLink when this button is clicked
        >
          Link Document
        </Button>:
         !editDescription ?<Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={toggleEditDescription}
        >Edit Description</Button>: <></>}
      </CardContent>
    </Card>
  );
};

export default DocDetails;




