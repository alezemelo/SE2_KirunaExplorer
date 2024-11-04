import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Define your router
const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  },
]);

// Get the root element
const rootElement = document.getElementById('root');

// Check if the root element is found, then initialize React app
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
