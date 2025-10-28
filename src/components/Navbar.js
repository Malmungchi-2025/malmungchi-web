// 아이콘
import { HiMiniUserCircle } from "react-icons/hi2";
// css 파일
import "../App.css";
import "./Navbar.css";
import LoginModal from "./LoginModal";

import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useContext } from "react"; // ✅ useContext 추가
import { useUser } from "../contexts/UserContext";
// 필사하기 모달
import TranscriptionModal from "./TranscriptionModal";
import WritingModal from "../components/WritingModal";

function Navbar({ bgColor, textColor, logoSrc }) {
  // const { user, setUser } = useContext(UserContext);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필사 모달
  const [showModal, setShowModal] = useState(false);
  // 글쓰기 모달
  const [showWritingModal, setShowWritingModal] = useState(false);

  const handleSelect = (type) => {
    setShowModal(false);
    if (type === "main") {
      navigate("/copy-main"); // 필사메인 페이지
    } else if (type === "bookmark") {
      navigate("/transcription-bookmark"); // 필사갈피 페이지
    }
  };

  const handleWritingSelect = (option) => {
    if (option === "writing") navigate("/");
    // 전체글 경로 정해지면 변경해주기
    if (option === "allpost") navigate("/allpost");
    if (option === "writingbookmark") navigate("/writing-bookmark");
  };

  return (
    <div
      className="navbar"
      style={{
        background: bgColor,
        color: textColor,
        boxShadow: "0 1px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="navbar-inner">
        <img
          src={logoSrc}
          alt="말뭉치 로고"
          className="nav_logo"
          onClick={() => navigate("/main")}
          style={{ cursor: "pointer" }}
        />
        <div className="menu">
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setShowModal((prev) => !prev)}
              className="nav-copy-btn"
              style={{ color: textColor }}
            >
              필사하기
            </button>

            {/* 필사하기 모달 */}
            {showModal && (
              <TranscriptionModal
                onClose={() => setShowModal(false)}
                onSelect={handleSelect}
              />
            )}
          </div>
          {/* <a href="/" style={{ color: textColor }}>
            글쓰기
          </a> */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setShowWritingModal((prev) => !prev)}
              className="nav-copy-btn"
              style={{ color: textColor }}
            >
              글쓰기
            </button>

            {showWritingModal && (
              <WritingModal
                onClose={() => setShowWritingModal(false)}
                onSelect={handleWritingSelect}
              />
            )}
          </div>

          {/* 👇 기존 Link 대신 onClick → 모달 열림 */}
          <div style={{ position: "relative" }}>
            <HiMiniUserCircle
              size={38}
              style={{ cursor: "pointer", color: textColor }}
              onClick={() => setIsModalOpen((prev) => !prev)}
            />
            {/* 모달 */}
            {isModalOpen && (
              <LoginModal
                onClose={() => setIsModalOpen(false)}
                user={user}
                setUser={setUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
