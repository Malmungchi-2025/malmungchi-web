import { HiMiniUserCircle } from "react-icons/hi2";
import "../App.css";
import "./Navbar.css";
import LoginModal from "./modal/LoginModal";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import TranscriptionModal from "../components/modal/TranscriptionModal";
import WritingModal from "../components/modal/WritingModal";

function Navbar({ bgColor, textColor, logoSrc }) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // ✅ 하나의 상태로 모달 관리
  const [openModal, setOpenModal] = useState(null);
  // null | "copy" | "write" | "login"

  const handleSelect = (type) => {
    setOpenModal(null);
    if (type === "main") {
      navigate("/copy-main");
    } else if (type === "bookmark") {
      if (!user) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login"); // ✅ 경고 후 로그인 페이지로 이동
        return;
      }
      navigate("/transcription-bookmark");
    }
  };

  const handleWritingSelect = (option) => {
    setOpenModal(null);
    if (option === "writing") navigate("/");
    if (option === "allpost") navigate("/allpost");
    if (option === "writingbookmark") {
      if (!user) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login"); // ✅ 로그인 화면으로 이동
        return;
      }
      navigate("/writing-bookmark");
    }
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
          {/* 필사하기 */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() =>
                setOpenModal((prev) => (prev === "copy" ? null : "copy"))
              }
              className="nav-copy-btn"
              style={{ color: textColor }}
            >
              필사하기
            </button>

            {openModal === "copy" && (
              <TranscriptionModal
                onClose={() => setOpenModal(null)}
                onSelect={handleSelect}
              />
            )}
          </div>

          {/* 글쓰기 */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() =>
                setOpenModal((prev) => (prev === "write" ? null : "write"))
              }
              className="nav-copy-btn"
              style={{ color: textColor }}
            >
              글쓰기
            </button>

            {openModal === "write" && (
              <WritingModal
                onClose={() => setOpenModal(null)}
                onSelect={handleWritingSelect}
              />
            )}
          </div>

          {/* 로그인/계정 */}
          <div style={{ position: "relative" }}>
            <HiMiniUserCircle
              size={38}
              style={{ cursor: "pointer", color: textColor }}
              onClick={() =>
                setOpenModal((prev) => (prev === "login" ? null : "login"))
              }
            />

            {openModal === "login" && (
              <LoginModal
                onClose={() => setOpenModal(null)}
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
