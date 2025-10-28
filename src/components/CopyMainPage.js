import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "./CopyMainPage.css";
import "../App.css";

function CopyMainPage() {
  const navigate = useNavigate();
  // 모달을 위한 것이여.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 불러온당께
  const [recommendData, setRecommendData] = useState(null);

  // 추천 데이터 불러오기
  const fetchRecommend = async () => {
    try {
      setIsModalOpen(true); // 모달 먼저 열기
      setRecommendData(null); // 이전 데이터 초기화

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/copy-items/recommend`
      );
      if (!res.ok) throw new Error("서버 응답 실패");

      const data = await res.json();
      setRecommendData(data);
    } catch (error) {
      console.error("추천 데이터 불러오기 오류:", error);
      setRecommendData({
        title: "데이터 없음",
        author: "",
        content: "추천 데이터를 불러오지 못했습니다.",
        cover_url: "/images/exbook1.png",
      });
    }
  };

  // 데이터 보내기
  // 추천 결과로 필사 페이지로 이동
  const goTranscription = () => {
    if (!recommendData?.id) {
      alert("먼저 작품을 추천받아 주세요.");
      return;
    }
    // 선택한 작품 id를 URL로 넘기고, state로도 함께 전달(즉시 표시 + 재검증)
    navigate(`/copy/start/${recommendData.id}`, { state: recommendData });
  };

  return (
    <div>
      <Navbar
        bgColor="linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))"
        textColor="#FFFFFF"
        logoSrc="/images/logo_w.png"
      />
      <div
        className="copymaincontainer"
        style={{
          // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url("/images/copybg.png")`,
          backgroundImage: `url("/images/copybg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="main-back">
          <div className="hero-center">
            {/* <img
              className="hero-icon"
              src="/images/copy_reader.png"
              alt="필사 아이콘"
            /> */}
            <h1 className="hero-title">고전문학 필사하기</h1>

            <div className="hero-actions">
              <button
                className="btn-plus"
                onClick={() => navigate("/directadd")}
              >
                직접추가
              </button>
              <button className="btn-recommend" onClick={fetchRecommend}>
                추천받기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && recommendData && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <p className="modal-question">
              해당 작품에 대한 필사를 진행하시겠습니까?
            </p>
            {/* 데이터 로딩 상태 처리 */}
            {recommendData ? (
              <div className="book-info">
                {recommendData.cover_url && (
                  <img
                    className="book-cover"
                    src={recommendData.cover_url?.replace(/"/g, "")}
                    alt={recommendData.title}
                  />
                )}
                <div className="book-text">
                  <h3 className="book-title">
                    [{recommendData.title}] - {recommendData.author}
                  </h3>
                  {/* <p className="book-content">{recommendData.content}</p> */}
                  <p className="book-content">
                    {recommendData?.content.length > 250
                      ? recommendData.content.slice(0, 250) + "..."
                      : recommendData?.content}
                  </p>
                </div>
              </div>
            ) : (
              <p>추천 작품을 불러오는 중입니다...</p>
            )}
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={fetchRecommend}>
                다시추천
              </button>
              <button
                className="btn-primary"
                onClick={goTranscription}
                // onClick={() => navigate("/copy/start")}
              >
                필사하기
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </div>
  );
}
export default CopyMainPage;
