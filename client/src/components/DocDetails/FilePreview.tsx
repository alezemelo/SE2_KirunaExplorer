import React from "react";
import { Box, Typography, IconButton, Card } from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // File icon
import CloseIcon from '@mui/icons-material/Close';

// Define the props for the component
interface FilePreviewProps {
  fileName: string;
  onRemove: () => void;
}

// Functional component with props destructuring
const FilePreview: React.FC<FilePreviewProps> = ({ fileName, onRemove }) => {
  return (
    <Card
      elevation={3}
      sx={{
        backgroundColor: "#232323",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        padding: 1,
        width: "100%", // Full width
        boxSizing: "border-box", // Ensure padding is included in the width
      }}
    >
      <Box display="flex" alignItems="center" flexGrow={1}>
        <Box
          sx={{
            backgroundColor: "#E57373",
            borderRadius: "50%",
            padding: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InsertDriveFileIcon sx={{ color: "#FFFFFF" }} />
        </Box>
        <Typography
          variant="body2"
          sx={{ marginLeft: 2, flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          title={fileName} // Show full file name on hover
        >
          {fileName}
        </Typography>
      </Box>
      <IconButton onClick={onRemove} sx={{ color: "#FFFFFF" }}>
        <CloseIcon />
      </IconButton>
    </Card>
  );
};

export default FilePreview;
