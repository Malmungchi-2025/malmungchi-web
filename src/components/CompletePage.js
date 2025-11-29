import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import "./CompletePage.css";
import "../App.css";

function CompletePage({ backgroundStyle }) {
  const location = useLocation();
  const { title, content, promptId, color } = location.state;

  // 이동
  const navigate = useNavigate();

  // 저장 완료 여부
  const [saved, setSaved] = useState(false);

  // ✅ 게시 여부를 true로만 저장하고 3초 뒤 이동
  const handlePost = async () => {
    const token = localStorage.getItem("token");
    console.log("토큰 확인:", token);

    // 🚫 로그인 안 되어 있을 때
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/writings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            promptId,
            isPublished: true, // ✅ 게시
            customColor: color,
          }),
        }
      );

      const result = await res.json();
      if (result.success) {
        setSaved(true);
        setTimeout(() => {
          navigate("/prompt-articles", { state: { promptId } });
        }, 3000);
      }
    } catch (err) {
      console.error("게시 저장 실패:", err);
    }
  };

  // 전체 게시는 하지 않되, 내가 쓴 글에서 확인 가능
  const handlePrivate = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/writings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            promptId,
            isPublished: false, // ✅ 비공개 저장
            customColor: color,
          }),
        }
      );

      const result = await res.json();
      if (result.success) {
        navigate("/prompt-articles", { state: { promptId } });
      }
    } catch (err) {
      console.error("비공개 저장 실패:", err);
    }
  };

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => {
        navigate("/prompt-articles", { state: { promptId } });
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [saved, navigate, promptId]);

  return (
    <div>
      <Navbar
        bgColor="rgba(0, 0, 0, 0.8)"
        textColor="#E0E0E0"
        logoSrc="/images/logo_w.png"
      />
      <div className="container" style={backgroundStyle}>
        <div className="main-back">
          <div className="complete-box">
            <p className="complete-text">
              {saved ? (
                "게시 완료!"
              ) : (
                <>
                  장작 완료!
                  <br />
                  나의 게시글에 저장되었습니다.
                </>
              )}
            </p>

            {!saved && (
              <div className="complete-buttons">
                <button className="btn gray-btn" onClick={handlePrivate}>
                  내 글 게시하지 않기
                </button>
                <button className="btn white-btn" onClick={handlePost}>
                  내 글 게시하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer
        bgColor="#262626"
        textColor="#FAFAFA"
        logoSrc="/images/logo_w.png"
      />
    </div>
  );
}

export default CompletePage;
