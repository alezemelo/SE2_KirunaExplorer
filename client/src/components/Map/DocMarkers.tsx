// DocumentMarker.tsx
import React from "react";

interface DocumentMarkerProps {
  lat: number;
  lng: number;
  title: string;
}

const DocumentMarker: React.FC<DocumentMarkerProps> = ({ title }) => {
  return (
    <div className="marker">
      <img src="path-to-marker-icon.png" alt="marker icon" style={{ width: 30, height: 30 }} />
      <div className="markerTitle">{title}</div> {/* Display title on hover */}
    </div>
  );
};

export default DocumentMarker;





