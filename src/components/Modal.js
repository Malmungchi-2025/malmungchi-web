// components/Modal.js
import ReactDOM from "react-dom";
import "./Modal.css";

function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body // ← 화면 최상단에 렌더링
  );
}

export default Modal;
