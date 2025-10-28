import React from "react";
import "./LoadingSpinner.css"; // 스피너 스타일 별도 작성

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}
