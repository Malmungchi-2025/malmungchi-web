import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "./DirectAddPage.css";
import "../App.css";
import { ImCheckmark } from "react-icons/im";

function DirectAddPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCoverColor, setSelectedCoverColor] = useState("blue"); // 기본값

  const handleCoverSelect = (color) => {
    setSelectedCoverColor(color);
  };
  // 모달 2개를 위함
  const [step, setStep] = useState(0);

  // 필사히기로 전달
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    setStep(1); // 1번 모달 열기

    // 2초 뒤 2번 모달로 전환
    setTimeout(() => {
      setStep(2);
    }, 2000);
  };

  const handleClose = () => {
    setStep(0);
  };

  // 필사히기로 전달
  const handleTranscribe = () => {
    navigate("/copy/start/custom", {
      state: {
        customTitle: title,
        customContent: content,
        color: selectedCoverColor,
      },
    });
  };

  return (
    <div>
      <Navbar
        bgColor="#ffffff"
        textColor="#262626"
        logoSrc="/images/logo_b.png"
      />
      <div className="container" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="main-back direct-main">
          <div className="direct-add-header">
            <h2 className="direct-add-title">직접추가하기</h2>
            <button className="direct-add-btn" onClick={handleAdd}>
              글 추가하기
            </button>
          </div>

          <input
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="direct-add-input"
          />

          <textarea
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="direct-add-textarea"
          />
          {/* 📌 책 표지 선택 영역 */}
          <div className="direct-add-bookcover">
            <p>책표지</p>
            <div className="direct-add-cover-options">
              {["blue", "yellow", "green", "white"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`direct-add-cover-btn ${color} ${
                    selectedCoverColor === color ? "selected" : ""
                  }`}
                  onClick={() => handleCoverSelect(color)}
                >
                  {selectedCoverColor === color && (
                    <span className="direct-add-check-icon">
                      <ImCheckmark size={20} color="#000" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />

      {/* 모달 1 */}
      {step === 1 && (
        <div className="add-modal-overlay1">
          <div className="add-modal-box1">
            <h3>글 추가 완료!</h3>
            <img
              src="/images/Add_book_icon.png"
              alt="책 아이콘"
              style={{ width: "96px", height: "auto" }}
            />
          </div>
        </div>
      )}

      {/* 모달 2: 필사 확인 */}
      {step === 2 && (
        <div className="add-modal-overlay2">
          <div className="add-modal-box2">
            <button className="add-modal-close" onClick={handleClose}>
              ×
            </button>
            <p className="add-modal-question">
              해당 글에 대한 필사를 진행하시겠습니까?
            </p>
            <div className="add-modal-content">
              <h3 className="add-title">「{title}」</h3>
              <p className="add-content">
                {content?.length > 300
                  ? content.slice(0, 300) + "..."
                  : content}
              </p>
            </div>
            <button className="add-btn-primary" onClick={handleTranscribe}>
              필사하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DirectAddPage;
