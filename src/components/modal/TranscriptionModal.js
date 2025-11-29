import "./TranscriptionModal.css";

export default function TranscriptionModal({ onClose, onSelect }) {
  return (
    <div className="transcription-modal-overlay" onClick={onClose}>
      <div
        className="transcription-modal-box"
        onClick={(e) => e.stopPropagation()} // 모달 외부 클릭 시 닫히게
      >
        <button
          className="transcription-modal-btn-01"
          onClick={() => onSelect("main")}
        >
          필사하기
        </button>
        <hr />
        <button
          className="transcription-modal-btn-02"
          onClick={() => onSelect("bookmark")}
        >
          필사갈피
        </button>
      </div>
    </div>
  );
}
