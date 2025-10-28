import React from "react";
import "./PromptModal.css";

function PromptModal({ word, meaning, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <p className="modal-label">오늘의 글감</p>
        <h1 className="modal-word">{word}</h1>
        <p className="modal-meaning">{meaning}</p>
      </div>
    </div>
  );
}

export default PromptModal;
