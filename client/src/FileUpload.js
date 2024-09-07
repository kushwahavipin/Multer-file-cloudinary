// src/FileUpload.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileUpload.css';
import Modal from './Modal'; // Import the Modal component
import Loader from './Loader'; // Import the Loader component

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error message

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true); // Show loader
    setError(null); // Clear previous errors

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImageUrl(response.data.url);
      fetchImages(); // Refresh the list of images
      alert('File uploaded successfully!');
    } catch (error) {
      setError('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const fetchImages = async () => {
    setLoading(true); // Show loader
    setError(null); // Clear previous errors

    try {
      const response = await axios.get('http://localhost:5000/images');
      setImages(response.data);
    } catch (error) {
      setError('Error fetching images. Please try again.');
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchImages(); // Load images on component mount
  }, []);

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container">
      <h2>Upload an Image</h2>
      <div className="upload-container">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleFileUpload} className="upload-button">
          Upload
        </button>
        {imageUrl && (
          <div className="uploaded-image">
            <h3>Uploaded Image:</h3>
            <img src={imageUrl} alt="Uploaded" className="image-preview" />
          </div>
        )}
      </div>
      <h2>Uploaded Images</h2>
      <div className="gallery">
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Uploaded ${index}`}
            className="gallery-image"
            onClick={() => handleImageClick(url)}
          />
        ))}
      </div>

      {/* Render the Modal component */}
      <Modal
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />

      {/* Render the Loader component */}
      {loading && <Loader />}
      
      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FileUpload;
