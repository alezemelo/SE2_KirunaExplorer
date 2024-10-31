import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

// Define the type for document
interface Document {
  title: string;
  stakeholders: string;
  scale: string;
  issuanceDate: string;
  type: string;
  connection: string;
  language: string;
  pages: string;
  description: string;
}

// Specify the prop type in the component
interface DocDetailsProps {
  document: Document;
  onLink: () => void; // Add this line to accept the onLink prop
}

const DocDetails: React.FC<DocDetailsProps> = ({ document, onLink }) => {
  // State to manage description visibility
  const [showDescription, setShowDescription] = useState(false);

  // Toggle description visibility
  const toggleDescription = () => setShowDescription((prev) => !prev);

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
            <strong>Connections:</strong> {document.connection}
          </Typography>
          <Typography variant="body2">
            <strong>Language:</strong> {document.language}
          </Typography>
          <Typography variant="body2">
            <strong>Pages:</strong> {document.pages}
          </Typography>
        </Box>

        {/* Toggleable Description */}
        {showDescription && (
          <Typography variant="body2" style={{ marginTop: "10px" }}>
            <strong>Description:</strong> {document.description}
          </Typography>
        )}

        {/* Toggle Button */}
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={toggleDescription}
        >
          {showDescription ? "Hide Description" : "Show Description"}
        </Button>

        {/* Button to trigger linking */}
        <Button 
          variant="contained" 
          color="secondary" 
          style={{ marginTop: "10px" }} 
          onClick={onLink} // Call onLink when this button is clicked
        >
          Link Document
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocDetails;




