import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import "../App.css";
import "./LandingPage.css";

function LandingPage({ backgroundStyle }) {
  const navigate = useNavigate();
  // 네비게이션 바 색상 전달
  const navBg =
    "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))";
  const textColor = "#FFFFFF";
  const logoSrc = "/images/logo_w.png";

  const handleMainContentClick = () => {
    navigate("/prompt");
  };

  return (
    <div>
      <Navbar bgColor={navBg} textColor={textColor} logoSrc={logoSrc} />
      <div
        className="container"
        style={backgroundStyle}
        onClick={handleMainContentClick}
      >
        <div className="main-back">
          <div className="main-text">
            <p>
              창작을 장려하다 : 장작
              <br />
              함께 장작불을 키우러 가볼까요?
            </p>
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
export default LandingPage;
