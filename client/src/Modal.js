// src/Modal.js
import React from 'react';
import './Modal.css'; // Import CSS for modal styling

const Modal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null; // Do not render if no imageUrl

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Popup" className="modal-image" />
      </div>
    </div>
  );
};

export default Modal;
