import React from "react";
import "./Modal.css";
 
export default function Modal({ isOpen, onClose, children, width }) {
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal `}
        style={{ width: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <button className="close-button" onClick={onClose}>
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
}
 