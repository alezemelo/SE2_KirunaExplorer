import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Card, CardContent, TextField, IconButton } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import dayjs from "dayjs";
import { Document } from "../../models/document";
import API from "../../API";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";



interface DocDetailsProps {
  document: any;
  onLink: () => void;
  fetchDocuments: () => Promise<void>;
  pin: number;
  setNewPin: any;
  /*docExpand?: number;
  setDocExpand?:any;*/
  updating: boolean,
  setUpdating: any;
  newDocument: any;
  setNewDocument: any;
}

const DocDetails: React.FC<DocDetailsProps> = ({ document, onLink, fetchDocuments, pin, setNewPin/*, docExpand, setDocExpand*/, updating, setUpdating, newDocument, setNewDocument }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLat, setEditLat] = useState(false);
  const [editLng, setEditLng] = useState(false);
  const [description, setDescription] = useState(document.description);
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [expand, setExpand] = useState(false);

  const handleToggleExpand = () => setExpand(!expand);

  useEffect(()=>{
    if(document.coordinates.type==CoordinatesType.POINT){
      const s = document.coordinates.coords;
      if(s){
        setLat(s.lat);
        setLng(s.lng);
      }
    }
  });




  /*useEffect(() => {
    if (document.coordinates) {
      setLat(document.coordinates.lat.toString());
      setLng(document.coordinates.lng.toString());
    }
  }, [document.coordinates]);*/

  //const connections = document.connection || []; 
  //const displayedConnections = expand ? connections : connections.slice(0, 3);

  const renderConnections = () => (
    <Box marginTop={1}>
      <Typography variant="body2">
        <strong>Connections:</strong>
      </Typography>
      <Box display="flex" flexDirection="column" marginTop={1}>
        {/*connections.length > 0 ? (
          displayedConnections.map((conn, index) => (
            <Typography key={index} variant="body2">
              {conn}
            </Typography> 
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No connections available.
          </Typography>
        )*/}

        {/*connections.length > 3 && (
          <IconButton onClick={handleToggleExpand} aria-label="expand">
            {expand ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        )*/}
      </Box>
    </Box>
  );

  /*const handleLatChange = (event: React.ChangeEvent<HTMLInputElement>) => setLat(event.target.value);
  const handleLngChange = (event: React.ChangeEvent<HTMLInputElement>) => setLng(event.target.value);*/

  /*const handleSaveCoordinates = async () => {
    if(lat && lng){
      if (Number(lat) < -90 || Number(lat) > 90 || Number(lng) < -180 || Number(lng) > 180) {
        console.error("Invalid coordinates");
      } else {
       await API.updateCoordinates(document.id, lat, lng)
       await fetchDocuments();
      }
    }
  };*/

  const setPin = (id:number) => {
    if(id==pin){
      setNewPin(0);
    }
    else{
      console.log("click"+id)
      setNewPin(id);
    }
  }

  useEffect(() => {
    console.log(pin)
  }, [pin]);

  /*const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, field: "lat" | "lng") => {
    if (event.key === 'Enter') {
      handleSaveCoordinates();
      if (field === "lat") setEditLat(false);
      if (field === "lng") setEditLng(false);
    }
  };*/

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
  const toggleDescription = (e: React.MouseEvent) => {
    //setShowDescription(!showDescription);
    e.stopPropagation();
    if (document) {
      setUpdating(true);
      console.log(updating)
      /*const convertedDocument = new Document(
        document.id,
        document.title,
        document.type,
        document.lastModifiedBy,
        document.issuanceDate,
        document.language,
        document.pages,
        document.stakeholders,
        document.scale,
        document.description,
        document.coordinates
      );*/
      if(!document.coordinates){
        document.coordinates = new Coordinates(CoordinatesType.MUNICIPALITY,null);
      }
      else{
        if (document.coordinates.coords.length<=2){
          document.coordinates = new Coordinates(CoordinatesType.POINT,new CoordinatesAsPoint(document.coordinates.coords.lan,document.coordinates.coords.lng));
        }
      }
      setNewDocument(document);
    }
  }
  const toggleEditDescription = () => setEditDescription(true);
  const closeEditDescription = () => {
    setEditDescription(false);
    setDescription(document.description)
  }

  /*const saveDescription = async () => {
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
   await API.updateDescription(document.id, description);
   setEditDescription(false);
    await fetchDocuments();
  };*/

  return (
    <Card elevation={6} onClick={() => setPin(document.id)} style={{ margin: "5px", padding: "5px" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Title: </strong>{document.title}
        </Typography>

        {pin==document.id ? <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2"><strong>Stakeholders:</strong> {document.stakeholders}</Typography>
          <Typography variant="body2"><strong>Scale:</strong> {document.scale}</Typography>
          <Typography variant="body2"><strong>Issuance date:</strong> {document.issuanceDate ? document.issuanceDate.toString() : ""}</Typography>
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
                disabled={true}
                  /*value={lat}
                  onChange={handleLatChange}
                  onBlur={() => { setEditLat(false); handleSaveCoordinates(); }}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e, "lat")}*/
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
                  {/*lat || "Enter latitude"*/lat?lat:''}
                </Typography>
              )}
            </Box>

            {/* Editable Longitude */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2"><strong>Longitude:</strong></Typography>
              {editLng ? (
                <TextField
                disabled={true}
                  /*value={lng}
                  onChange={handleLngChange}
                  onBlur={() => { setEditLng(false); handleSaveCoordinates(); }}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e, "lng")}*/
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
                  {/*lng || "Enter longitude"*/lng?lng:''}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>: <></>}

        {/* Description Section */}
        {/*!editDescription && showDescription && (
          <Typography variant="body2" style={{ marginTop: "5px", whiteSpace: "pre-line", wordWrap: "break-word" }}>
            <strong>Description:</strong> {description}
          </Typography>
        )*/}
        {pin==document.id ? <Typography variant="body2" style={{ marginTop: "5px", whiteSpace: "pre-line", wordWrap: "break-word" }}>
            <strong>Description:</strong> {description}
          </Typography>:<></>}

        {/* editDescription ? (
          <>
            <TextField value={description} autoFocus fullWidth multiline rows={6} onChange={handleDescriptionChange} />
            <Box display="flex" justifyContent="space-between" style={{ marginTop: "10px", width: "100%" }}>
              { Save Button }
              <Button
                variant="contained"
                color="primary"
                style={{ width: "48%" }}
                onClick={saveDescription}
              >
                Save
              </Button>

              { Cancel Button }
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
        ) : null*/}


        <Box display="flex" justifyContent="space-between" style={{ marginTop: "10px", width: "100%" }}>
          {/* Toggle Description Button */}
          {pin==document.id && /*!editDescription &&*/ (
            <>
            <Button variant="contained" color="primary" style={{ width: "48%" }} onClick={(e)=>{
              e.stopPropagation();
              toggleDescription(e)}}>
              {/*showDescription ? "Hide Description" : "Show Description"*/}
              Edit
            </Button>
            <Button variant="contained" color="secondary" style={{ width: "48%" }} onClick={(e)=>{
              e.stopPropagation();
              onLink()}}>
            Link Document
          </Button>
          </>
          )}

          {/* Link Document or Edit Description Button */}
          {/*pin==document.id && (!showDescription && !editDescription ? (
            <Button variant="contained" color="secondary" style={{ width: "48%" }} onClick={onLink}>
              Link Document
            </Button>
          ) : !editDescription ? (
            <Button variant="contained" color="secondary" style={{ width: "48%" }} onClick={toggleEditDescription}>
              Edit Description
            </Button>
          ) : null)*/}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DocDetails;

