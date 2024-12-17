/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */ // Remember to remove this line for future maintenance
import React, { useEffect, useState } from "react";
import {
  Button, Box, Typography, Card, CardContent, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, IconButton, ListItemIcon, Snackbar,
  Alert
} from "@mui/material";

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

import dayjs from "dayjs";
import { User } from "../../type";
import API from "../../API";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "../../models/coordinates";
import FilePreview from "../DocDetails/FilePreview";
import { Document } from "../../models/document";
import { DocumentType } from "../../type";
import DocDetailsGraphStyle from "./DocDetailsGraphStyle";


interface DocDetailsGraphProps {
  document: Document;
  setPopup: React.Dispatch<React.SetStateAction<Document | undefined>>;
  handleNavigation: (id: number) => void;
  /*
  onLink: (document:Document) => void;
  fetchDocuments: () => Promise<void>;
  pin: number;
  setNewPin: any;
  updating: boolean,
  setUpdating: any;
  loggedIn: boolean;
  user: User | undefined;
  handleSearchLinking: () => Promise<void>;
  newDocument: DocumentType;
  setNewDocument: React.Dispatch<React.SetStateAction<DocumentType>>;
  */
}

const DocDetailsGraph: React.FC<DocDetailsGraphProps> = (props) => {

  const [files, setFiles] = useState<{ id: number; name: string }[]>([]);  //the ones i fetch 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);//the one i upload
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expand, setExpand] = useState(false);


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
      console.log("fetching files of document number: " + props.document.id);
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
  }, [props.document.id, selectedFile]);

  const formatIssuanceDate = (date: string) => {
    if (!date) return "N/A";

    const parts = date.split("-");
    if (parts.length === 1) {
      return parts[0]; // Year only
    } else if (parts.length === 2) {
      return `${parts[0]}-${parts[1]}`; // Year and Month
    }
    return date; // Full date
  };

  const getLinks = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, i: number, doc: Document) => {
    e.stopPropagation();
    console.log("link navigation");
    const links = await API.getLinks(props.document.id);
    // based on the link i should change popup
  }

  const connections = props.document.connection || [];
  const displayedConnections = expand ? connections : connections.slice(0, 3);

  const renderConnections = () => (
    <Box >
      <Typography variant="body2">
        <strong>Connections:</strong>
      </Typography>
      <Box display="flex" flexDirection="column" marginTop={1}>
        {connections.length > 0 ? (
          displayedConnections.map((conn: string, index: number) => (
            <Typography key={index} variant="body2" sx={{ cursor: "pointer" }} onClick={async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
              e.stopPropagation();
              const links = await API.getLinks(props.document.id);
              const l = links[index]
              if (l) {
                if (l.docId1 != props.document.id) { props.handleNavigation(l.docId1) }
                else if (l.docId2 != props.document.id) { props.handleNavigation(l.docId2) }
              }
            }}>

              - <u>{conn}</u>

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


  /*
  const toggleDescription = (e: React.MouseEvent) => {
    //setShowDescription(!showDescription);
    e.stopPropagation();
    //if (props.document && props.document.coordinates.type!="POLYGON") {
    if (props.document) {

      props.setNewDocument(props.document);
      props.setUpdating(true);
    }
  }
    */



  /*
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
      setSnackbarMessage('A file with this name already exists for the current document.');
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
  */


  return (
    <Card elevation={6} sx={DocDetailsGraphStyle}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <strong>Title: </strong>{props.document.title}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2"><strong>Stakeholders:</strong> {props.document.stakeholders ? props.document.stakeholders : '-'}</Typography>
          <Typography variant="body2"><strong>Scale:</strong> {props.document.scale}</Typography>
          <Typography variant="body2">
            <strong>Issuance date:</strong> {props.document.issuanceDate ? formatIssuanceDate(props.document.issuanceDate) : '-'}
          </Typography>
          <Typography variant="body2"><strong>Type:</strong> {props.document.type}</Typography>

          {renderConnections()}

          <Typography variant="body2"><strong>Language:</strong> {props.document.language}</Typography>
          <Typography variant="body2"><strong>Pages:</strong> {props.document.pages ? props.document.pages : '-'}</Typography>


          <Box display="flex" alignItems="center" gap={2}>
            {/* Latitude */}
            {props.document.coordinates?.coords &&
              <Box display="flex" alignItems="center">
                <Typography variant="body2"><strong>Latitude:</strong></Typography>
                <Typography
                  variant="body2"
                  style={{ marginLeft: '8px', backgroundColor: "#2A2A2A", color: "#FFFFFF", padding: '4px', borderRadius: '8px' }}
                >
                  {props.document.coordinates.coords.lat ? parseFloat(props.document.coordinates.coords.lat).toFixed(5) : '-'}
                </Typography>
              </Box>
            }


            {/* Longitude */}
            {props.document.coordinates.coords && /*props.document.coordinates.getType() === CoordinatesType.POINT &&*/
            <Box display="flex" alignItems="center">
              <Typography variant="body2"><strong>Longitude:</strong></Typography>
              <Typography
                variant="body2"
                style={{ marginLeft: '8px', cursor: 'pointer', backgroundColor: "#2A2A2A", color: "#FFFFFF", padding: '4px', borderRadius: '8px' }}
              >
                {props.document.coordinates.coords.lng ? parseFloat(props.document.coordinates.coords.lng).toFixed(5) : '-'}
              </Typography>
            </Box> }
            
          </Box>

        </Box>

        <Typography variant="body2" style={{ marginTop: "5px", whiteSpace: "pre-line", wordWrap: "break-word" }}>
          <strong>Description:</strong> {props.document.description}
        </Typography>

        {/* Files Download 
        <Box marginTop={1} display="flex" alignItems="center">
          <Typography variant="body2">
            <strong>File Attachments:</strong> {props.document.fileIds ? files.length : 'not available'}
          </Typography>
          {props.document.fileIds && files.length > 0 && (
            <IconButton onClick={handleOpenDialog} style={{ marginLeft: '8px' }}>
              <ArrowRightIcon sx={{ fontSize: 16, color: 'white' }} />
            </IconButton>
          )}
        </Box>
        */}


        {/* Upload Files 
        {props.loggedIn && props.user?.type === "urban_planner" && (
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
        */}


        <Box display="flex" justifyContent="space-between" style={{ marginTop: "10px", width: "100%" }}>
          {/* Toggle Description Button */}
          {/*props.loggedIn && props.user?.type === "urban_planner" && /*!editDescription && ( */}
          <>
            <Button startIcon={<EditIcon />} variant="contained" color="primary" style={{ width: "48%" }} onClick={(e) => {
              e.stopPropagation();
              //toggleDescription(e)
            }}>
              {/*showDescription ? "Hide Description" : "Show Description"*/}
              This button does nothing
            </Button>
            {/*
              <Button startIcon={<LinkIcon />} variant="contained" color="secondary" style={{ width: "48%" }} onClick={(e) => {
                e.stopPropagation();
                props.handleSearchLinking();
                props.onLink(props.document);
              }}>
                New Connection
              </Button>
              */}
            <Button startIcon={<CloseIcon />} variant="contained" color="error" style={{ width: "48%" }} onClick={(e) => {
              e.stopPropagation();
              props.setPopup(undefined);
            }}>
              Close
            </Button>
          </>
        </Box>

        {/* Dialog for File List */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} >
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

      </CardContent>
    </Card>
  );
};

export default DocDetailsGraph;