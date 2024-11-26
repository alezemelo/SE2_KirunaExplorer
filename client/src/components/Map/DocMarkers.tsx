// // DocumentMarker.tsx
// import React from "react";

// interface DocumentMarkerProps {
//   lat: number;
//   lng: number;
//   title: string;
// }

// const DocumentMarker: React.FC<DocumentMarkerProps> = ({ title }) => {
//   return (
//     <div className="marker">
//       <img src="path-to-marker-icon.png" alt="marker icon" style={{ width: 30, height: 30 }} />
//       <div className="markerTitle">{title}</div> {/* Display title on hover */}
//     </div>
//   );
// };

// export default DocumentMarker;





// DocumentMarker.tsx
import React from "react";

interface DocumentMarkerProps {
  lat: number;
  lng: number;
  title: string;
  onClick: () => void; // Callback for handling clicks
}

const DocumentMarker: React.FC<DocumentMarkerProps> = ({ title, onClick }) => {
  return (
    <div className="marker" onClick={onClick}>
      <img
        src="path-to-marker-icon.png"
        alt="marker icon"
        style={{ width: 30, height: 30, cursor: "pointer" }}
      />
      <div className="markerTitle">{title}</div> {/* Display title on hover */}
    </div>
  );
};

export default DocumentMarker;
