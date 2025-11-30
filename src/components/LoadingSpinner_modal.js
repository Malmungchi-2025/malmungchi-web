// components/LoadingSpinner_modal.js
import React from "react";
import "./LoadingSpinner_modal.css"; // 모달 전용 스타일

export default function LoadingSpinner_modal() {
  return (
    <div className="spinner-modal-container">
      <div className="spinner-modal" />
    </div>
  );
}
