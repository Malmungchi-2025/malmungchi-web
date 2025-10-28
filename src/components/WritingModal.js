import "./WritingModal.css";

export default function WritingModal({ onClose, onSelect }) {
  return (
    <div className="writing-modal-overlay" onClick={onClose}>
      <div className="writing-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="writing-modal-btn-01"
          onClick={() => onSelect("writing")}
        >
          글쓰기: 장작
        </button>
        <hr />
        <button
          className="writing-modal-btn-02"
          onClick={() => onSelect("allpost")}
        >
          전체글
        </button>
        <hr />
        <button
          className="writing-modal-btn-03"
          onClick={() => onSelect("writingbookmark")}
        >
          글갈피
        </button>
      </div>
    </div>
  );
}
