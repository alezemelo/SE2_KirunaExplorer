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

import API from "../../API";
import {  CoordinatesType} from "../../models/coordinates";
import { Document } from "../../models/document";
import DocDetailsGraphStyle from "./DocDetailsGraphStyle";


interface DocDetailsGraphProps {
  document: any;
  setPopup: React.Dispatch<React.SetStateAction<Document | undefined>>;
  handleNavigation: (id: number) => void;
}

const DocDetailsGraph: React.FC<DocDetailsGraphProps> = (props) => {

  const [files, setFiles] = useState<{ id: number; name: string }[]>([]);  //the ones i fetch 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);//the one i upload
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  const [lati, setLat] = useState<string>('');
  const [long, setLng] = useState<string>('');

  function isCoordinatesPoint(s: any): s is { lat: number; lng: number } {
    return s && typeof s.lat === "number" && typeof s.lng === "number";
  }
  
  useEffect(() => {
    if (props.document.coordinates.type === CoordinatesType.POINT) {
      const s = props.document.coordinates.coords;
      if (isCoordinatesPoint(s)) {
        setLat(s.lat.toString());
        setLng(s.lng.toString());
      } else {
        setLat('');
        setLng('');
      }
    }
    if (props.document.coordinates.type === CoordinatesType.MUNICIPALITY) {
      setLat('');
      setLng('');
    }
  }, [props.document.coordinates]);

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

      </Box>
    </Box>
  );


  return (
    <Card elevation={6} sx={DocDetailsGraphStyle}>
       {/* Close button in the top-right corner */}
       <IconButton
        aria-label="close"
        sx={{ color: 'black', position: 'absolute', top: 8, right: 8 }}
        onClick={() => props.setPopup(undefined)}
      >
        <CloseIcon />
      </IconButton>
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
                  style={{ marginLeft: '8px', backgroundColor: "#FFFFFF", color: "#2A2A2A", padding: '4px', borderRadius: '8px' }}
                >
                {/*lat || "Enter latitude"*/lati ? parseFloat(lati).toFixed(4) : ''}
                </Typography>
              </Box>
            }


            {/* Longitude */}
            {props.document.coordinates.coords && /*props.document.coordinates.getType() === CoordinatesType.POINT &&*/
            <Box display="flex" alignItems="center">
              <Typography variant="body2"><strong>Longitude:</strong></Typography>
              <Typography
                variant="body2"
                style={{ marginLeft: '8px', cursor: 'pointer', backgroundColor: "#FFFFFF", color: "#2A2A2A", padding: '4px', borderRadius: '8px' }}
              >
               {/*lng || "Enter longitude"*/long ? parseFloat(long).toFixed(5) : ''}

              </Typography>
            </Box> }
            
          </Box>

        </Box>

        <Typography variant="body2" style={{ marginTop: "5px", whiteSpace: "pre-line", wordWrap: "break-word" }}>
          <strong>Description:</strong> {props.document.description}
        </Typography>

        <Box marginTop={1} display="flex" alignItems="center">
          <Typography variant="body2">
            <strong>File Attachments:</strong> {props.document.fileIds ? files.length : 'not available'}
          </Typography>
          {props.document.fileIds && files.length > 0 && (
            <IconButton onClick={handleOpenDialog} style={{ marginLeft: '8px' }}>
              <ArrowRightIcon sx={{ fontSize: 16, color: 'black' }} />
            </IconButton>
          )}
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