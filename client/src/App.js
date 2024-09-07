// src/App.js
import React from 'react';
import FileUpload from './FileUpload';
import './App.css'; // Import global CSS if needed

function App() {
  return (
    <div className="App">
      <h1>Cloudinary Image Uploader</h1>
      <FileUpload />
    </div>
  );
}

export default App;
