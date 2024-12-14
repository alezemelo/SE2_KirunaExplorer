const DocDetailsGraphStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centers the popup
    width: '50vw', // Set width of the popup
    height: '70vh',
    padding: '20px', // Add padding for content inside the popup
    backgroundColor: '#fff', // White background for the popup
    borderRadius: '8px', // Rounded corners
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Subtle shadow for depth
    zIndex: 1000, // Ensures it's above other content
    display: 'flex',
    flexDirection: 'column', // Align content vertically
    alignItems: 'center', // Center align content horizontally
}

export default DocDetailsGraphStyle;