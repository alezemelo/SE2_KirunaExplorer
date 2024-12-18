const DocDetailsGraphStyle: React.CSSProperties = {
    position: 'fixed',
    top: 'calc(50% + 30px)', // Adjust for the header height (e.g., 60px / 2)
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    maxWidth: '800px',
    minWidth: '300px',
    height: '70vh',
    maxHeight: '90vh',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
};

export default DocDetailsGraphStyle;
