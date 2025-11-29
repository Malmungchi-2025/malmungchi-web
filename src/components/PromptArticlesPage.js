import React from "react";
import "./PromptArticlesPage.css";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropright } from "react-icons/io";

function PromptArticlesPage({ backgroundStyle }) {
  const location = useLocation();
  const promptId = location.state?.promptId;
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  // 호버시 처리
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/writings?promptId=${promptId}`
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        console.log("✅ 받아온 전체 data:", data);
        // setArticles(data);
        setArticles(data.slice(0, 10));
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    if (promptId) fetchArticles();
  }, [promptId]);

  return (
    <div>
      <Navbar
        bgColor="rgba(0, 0, 0, 0.8)"
        textColor="#E0E0E0"
        logoSrc="/images/logo_w.png"
      />
      <div className="container" style={backgroundStyle}>
        <div className="main-back">
          <div className="article-wrapper">
            <h2>‘글감’에 대한 유저들의 글</h2>
            <div className="promptcard-slider">
              {articles.map((item) => (
                <div className="promptcard" key={item.id}>
                  <div className="promptcard-header">
                    <div className="promptcard-header-text">
                      {item.author || "사용자"}
                    </div>
                    <div className="promptcard-created">
                      {new Date(item.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                  </div>
                  <div
                    className="promptcard-content"
                    style={{
                      backgroundImage: `url(${
                        process.env.PUBLIC_URL + "/images/quote.png"
                      })`,
                    }}
                  >
                    <div className="promptcard-content-title">{item.title}</div>
                    <div className="promptcard-content-content">
                      “{item.content}”
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 10 && (
                <div className="see-all-button">
                  <span className="see-all-button-text">전체보기</span>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                      marginLeft: "4px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/allpost")}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <IoIosArrowDropright
                      size={44}
                      color={isHovered ? "#EEEEEE" : "#fff"}
                    />
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
    </div>
  );
}

export default PromptArticlesPage;
