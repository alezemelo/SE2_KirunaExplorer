import React from "react";
import {Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

// Define the type for document
interface Document {
  title: string;
}

// Specify the prop type in the component
const DocDetails: React.FC<{ document: Document }> = ({ document }) => {
  return (
    <Card elevation={6}>
        <CardMedia
          style={{ height: 350 }}
          image="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.w3schools.com%2Fw3css%2Fw3css_images.asp&psig=AOvVaw3JFZ6J8G6v6T3v5y2Hw3m1&ust=1635607401536000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNjY3vq1zvMCFQAAAAAdAAAAABAD"
          title={document.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">{document.title}</Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">Category</Typography>
            <Typography variant="subtitle1">Category</Typography>
          </Box>
          <Typography variant="subtitle1">Description</Typography>
        </CardContent>

    </Card>
  );
};

export default DocDetails;
