import React from "react";
import "./PromptArticlesPage.css";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function PromptArticlesPage({ backgroundStyle }) {
  const location = useLocation();
  const promptId = location.state?.promptId;

  console.log("넘어온 promptId:", promptId);
  const [articles, setArticles] = useState([]);

  // ✅ 임시 데이터
  // const articles = [
  //   {
  //     id: 1,
  //     title: "편달(鞭撻)",
  //     content:
  //       "그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다그게 너를 위한 길이니? 어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다어머니의 목소리는 항상 단호했다나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌",
  //   },
  //   {
  //     id: 2,
  //     title: "편달(鞭撻)",
  //     content: "나는 종종 어머니의 말씀이 부드럽고도 날카롭게 느껴졌다...",
  //   },
  //   {
  //     id: 3,
  //     title: "편달(鞭撻)",
  //     content: "그 순간 나는 내 안의 모든 불안이 고요해짐을 느꼈다...",
  //   },
  //   {
  //     id: 4,
  //     title: "편달(鞭撻)",
  //     content: "랄랄 순간 나는 내 안의 모든 불안이 고요해짐을 느꼈다...",
  //   },
  // ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/writings?promptId=${promptId}`
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    if (promptId) fetchArticles();
  }, [promptId]);

  return (
    <div>
      <Navbar
        bgColor="#000000"
        textColor="#ffffff"
        logoSrc="/images/logo_w.png"
      />
      <div className="container" style={backgroundStyle}>
        <div className="main-back">
          <div className="article-wrapper">
            <h2>‘글감’에 대한 유저들의 글</h2>
            <div className="card-slider">
              {articles.map((item) => (
                <div className="card" key={item.id}>
                  <div className="header">
                    <div className="card-header">사용자 설정 별명</div>
                    <div className="card-created">2025.06.09</div>
                  </div>
                  <div className="content">
                    <div className="card-title">{item.title}</div>
                    <div className="card-content">“{item.content}”</div>
                  </div>
                </div>
              ))}
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
