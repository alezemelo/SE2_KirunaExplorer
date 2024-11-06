import React, { useState } from "react";

interface DocumentMarkerProps {
  lat: number;
  lng: number;
  text?: string; // Optional label text for the marker
}

const DocumentMarker: React.FC<DocumentMarkerProps> = ({ lat, lng, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        alt="Document Marker"
        style={{ width: '24px', height: '24px', transform: 'translate(-50%, -50%)' }}
      />
      {isHovered && text && (
        <div style={{ position: 'absolute', top: '30px', color: "#333", fontSize: '12px', fontWeight: 'bold', backgroundColor: 'white', padding: '2px 5px', borderRadius: '3px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default DocumentMarker;




