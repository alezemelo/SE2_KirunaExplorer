/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */ // Remember to remove this line for future maintenance
import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, List,  ListItem, ListItemText, IconButton, ListItemIcon, Snackbar,  
  Alert} from "@mui/material";

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

import dayjs from "dayjs";
import { User } from "../../type";
import API from "../../API";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";
import FilePreview from "./FilePreview";
import { Document } from "../../models/document";


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
  loggedIn: boolean;
  user: User | undefined;
  handleSearchLinking: () => Promise<void>;
}

const DocDetails: React.FC<DocDetailsProps> = (props) => {
  const [showDescription, setShowDescription] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLat, setEditLat] = useState(false);
  const [editLng, setEditLng] = useState(false);
  //const [description, setDescription] = useState(props.document.description);
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [expand, setExpand] = useState(false);
  const [files, setFiles] = useState<{ id: number; name: string }[]>([]);  //the ones i fatch 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);//the one i upload
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to parent
    setDialogOpen(true);
  };
  
  const handleCloseDialog = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to parent
    setDialogOpen(false);
  };
  const fetchFiles = async () => {
    try {
      console.log("fetching files of document number: "+props.document.id);
      const documentId = props.document.id;
      const fetchedFiles = await API.getFilesByDocumentId(documentId);
      console.log("Fetched files response:", fetchedFiles);
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]); // Clear files if an error occurs
    }
  };
  
  useEffect(() => {
    if (props.document?.id) {
      fetchFiles();
    }
  }, [selectedFile]);
  

  const handleToggleExpand = () => setExpand(!expand);

  useEffect(()=>{
    if(props.document.coordinates.type==CoordinatesType.POINT){
      const s = props.document.coordinates.coords;
      if(s){
        setLat(s.lat);
        setLng(s.lng);
      }
    }
  });

  const getLinks = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>,i:number,doc: Document) => {
    e.stopPropagation();
    console.log("link navigation");
    const links = await API.getLinks(props.document.id);
    const l = links[i]
    if(l){
      if(l.docId1!=doc.id) {props.setNewPin(l.docId1)}
      else if(l.docId2!=doc.id) {props.setNewPin(l.docId2)}
    }
  }

  const connections = props.document.connection || []; 
  const displayedConnections = expand ? connections : connections.slice(0, 3);

  const renderConnections = () => (
    <Box marginTop={1}>
      <Typography variant="body2">
        <strong>Connections:</strong>
      </Typography>
      <Box display="flex" flexDirection="column" marginTop={1}>
        {connections.length > 0 ? (
           displayedConnections.map((conn: string, index: number) => (
            <Typography key={index} variant="body2" sx={{ cursor: "pointer" }} onClick={(e)=>{
              getLinks(e,index,props.document)
              }}>
              <u>{conn}</u>
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="white">
            No connections available.
          </Typography>
        )}

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
        /*try {
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
       await API.updateCoordinates(props.document.id, lat, lng)
       await props.fetchDocuments();
      }
    }
  };*/

  const setPin = (id:number) => {
    if(id==props.pin){
      props.setNewPin(0);
    }
    else{
      console.log("click"+id)
      props.setNewPin(id);
    }
  }

  useEffect(() => {
    console.log(props.pin)
  }, [props.pin]);

  /*const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, field: "lat" | "lng") => {
    if (event.key === 'Enter') {
      handleSaveCoordinates();
      if (field === "lat") setEditLat(false);
      if (field === "lng") setEditLng(false);
    }
  };*/

  //const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
  const toggleDescription = (e: React.MouseEvent) => {
    //setShowDescription(!showDescription);
    e.stopPropagation();
    if (props.document && props.document.coordinates.type!="POLYGON") {
      /*props.setUpdating(true);
      console.log(props.updating)
      const convertedDocument = {
        id: props.document.id,
        title: document.title,
        stakeholders: props.document.stakeholders,
        scale: props.document.scale,
        issuanceDate: props.document.issuance_date,
        type: props.document.type,
        connection: props.document.connection,
        language: props.document.language,
        pages: props.document.pages,
        description: props.document.description,
        lat: props.document.coordinates?.lat,
        lng: props.document.coordinates?.lng,
      };
      props.setNewDocument(convertedDocument);*/
      props.setUpdating(true);
      console.log(props.updating)
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
      if(!props.document.coordinates.coords){
        props.document.coordinates = new Coordinates(CoordinatesType.MUNICIPALITY,null);
      }
      else{
        // eslint-disable-next-line no-cond-assign, no-constant-condition
        if (props.document.coordinates.type="POINT"){
          props.document.coordinates = new Coordinates(CoordinatesType.POINT,new CoordinatesAsPoint(props.document.coordinates.coords.lat,props.document.coordinates.coords.lng));
        }
      }
      props.setNewDocument(props.document);
    }
  }
  const toggleEditDescription = () => setEditDescription(true);
  /*const closeEditDescription = () => {
    setEditDescription(false);
    setDescription(props.document.description)
  }*/

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


  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("No file selected for upload.");
      return;
    }
  
    const fileName = selectedFile.name; // Get the file name
    const file = selectedFile; // Get the selected file

    // Check if a file with the same name already exists
    const existingFileNames = files.map(file => file.name);
    if (existingFileNames.includes(fileName)) {
      setSnackbarMessage('A file with this name already exists.');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const response = await API.uploadFile(props.document.id, fileName, file);
      if (response && response.fileId) {
        alert("File uploaded successfully!");
        setSelectedFile(null); // Reset the selected file
        fetchFiles(); // Refresh the file list
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };
  


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };


  return (
    <Card elevation={6} onClick={() => setPin(props.document.id)} style={{ margin: "5px", padding: "5px", backgroundColor: "#2A2A2A", color: "#FFFFFF" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Title: </strong>{props.document.title}
        </Typography>

        {props.pin==props.document.id ? <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2"><strong>Stakeholders:</strong> {props.document.stakeholders}</Typography>
          <Typography variant="body2"><strong>Scale:</strong> {props.document.scale}</Typography>
          <Typography variant="body2"><strong>Issuance date:</strong> {props.document.issuanceDate ? dayjs(props.document.issuanceDate).format('YYYY-MM-DD') : ""}</Typography>
          <Typography variant="body2"><strong>Type:</strong> {props.document.type}</Typography>
          
          {renderConnections()}

          <Typography variant="body2"><strong>Language:</strong> {props.document.language}</Typography>
          <Typography variant="body2"><strong>Pages:</strong> {props.document.pages?props.document.pages:'not avaiable'}</Typography>

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
                  style={{ marginLeft: '8px', width: '120px', backgroundColor: "#2A2A2A", color: "#FFFFFF"}}
                />
              ) : (
                <Typography
                  variant="body2"
                  style={{ marginLeft: '8px', cursor: 'pointer', backgroundColor: "#2A2A2A", color: "#FFFFFF", padding: '4px', borderRadius: '8px' }}
                  /*onClick={() => setEditLat(true)}*/
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
                  style={{ marginLeft: '8px', width: '120px', backgroundColor: "#2A2A2A", color: "#FFFFFF" }}
                />
              ) : (
                <Typography
                  variant="body2"
                  style={{ marginLeft: '8px', cursor: 'pointer', backgroundColor: "#2A2A2A", color: "#FFFFFF", padding: '4px', borderRadius: '8px' }}
                  /*onClick={() => setEditLng(true)}*/
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
        {props.pin==props.document.id ? <Typography variant="body2" style={{ marginTop: "5px", whiteSpace: "pre-line", wordWrap: "break-word" }}>
            <strong>Description:</strong> {props.document.description}
          </Typography>:<></>}

        {/* Files Download */}
        {props.pin == props.document.id ? (
          <Box marginTop={2} display="flex" alignItems="center">
            <Typography variant="body2">
              <strong>File Attachments:</strong> {props.document.fileIds ? files.length : 'not available'}
            </Typography>
            {props.document.fileIds && files.length > 0 && (
              <IconButton onClick={handleOpenDialog} style={{ marginLeft: '8px' }}>
                <ArrowRightIcon sx={{ fontSize: 16, color: 'white' }} />
              </IconButton>
            )}
          </Box>
        ) : (
          <></>
        )}

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

      {/* Upload Files || Files Upload */}
      {props.pin === props.document.id && props.loggedIn && props.user?.type === "urban_planner" && (
        <Box onClick={(e) => e.stopPropagation()} display="flex" flexDirection="column" gap={2} marginTop={2}>
          <input
            type="file"
            accept=".pdf,.txt,.png,.jpg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          {!selectedFile && (
            <label htmlFor="file-upload" style={{ display: 'block', width: '100%' }}>
              <Button 
                variant="contained" 
                component="span" 
                color="success"
                startIcon={<FileUploadIcon />}
                fullWidth
              >
                Upload files
              </Button>
            </label>
          )}
    
          {selectedFile && (
            <Box mt={2}>
              <FilePreview fileName={selectedFile.name} onRemove={handleRemoveFile} />
            </Box>
          )}

          {selectedFile && (
            <Button
              variant="contained"
              color="success"
              startIcon={<FileUploadIcon />}
              onClick={handleFileUpload}
              disabled={!selectedFile}
              style={{ marginTop: '10px' }}
            >
              Upload File
            </Button>
          )}
        </Box>
      )}      


        <Box display="flex" justifyContent="space-between" style={{ marginTop: "10px", width: "100%" }}>
          {/* Toggle Description Button */}
          {props.pin==props.document.id && props.loggedIn && props.user?.type === "urban_planner" && /*!editDescription &&*/ (
            <>
            <Button startIcon={<EditIcon />} variant="contained" color="primary" style={{ width: "48%" }} onClick={(e)=>{
              e.stopPropagation();
              toggleDescription(e)}}>
              {/*showDescription ? "Hide Description" : "Show Description"*/}
              Edit
            </Button>
            <Button startIcon={<LinkIcon />} variant="contained" color="secondary" style={{ width: "48%" }} onClick={(e)=>{
              e.stopPropagation();
              props.handleSearchLinking();
              props.onLink()}}>
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

        {/* Dialog for File List */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Original Files</DialogTitle>
          <DialogContent>
            <List>
              {files.map((file) => (
                // console.log(`file.id: ${file.name}`),
                <ListItem key={file.id}>
                <ListItemIcon>
                <IconButton onClick={() => API.downloadByFileId(file.id, file.name)}>
                    <DownloadIcon sx={{ color: 'green' }} />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {file.name}
                    </Typography>
                  }
                />
              </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Error Messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default DocDetails;

