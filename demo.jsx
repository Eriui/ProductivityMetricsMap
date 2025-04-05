/**
 * Demo file for the Productivity Metrics Map
 * This is a simple example of how to use the component
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductivityMetricsMap from './components/ProductivityMetricsMap';

// Simple wrapper for the demo
const App = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Productivity Metrics Map Demo
      </h1>
      <ProductivityMetricsMap />
      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        &copy; 2025 [Your Name] - MIT License
      </footer>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
