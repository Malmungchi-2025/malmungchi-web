import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "./CopyMainPage.css";
import "../App.css";
import LoadingSpinner_modal from "../components/LoadingSpinner_modal";

function CopyMainPage() {
  const navigate = useNavigate();
  // 모달을 위한 것이여.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 불러온당께
  const [recommendData, setRecommendData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 추천 데이터 불러오기
  const fetchRecommend = async () => {
    try {
      setIsLoading(true);
      setIsModalOpen(true);

      let data = null;
      let tryCount = 0;

      do {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/copy-items/recommend`
        );
        if (!res.ok) throw new Error("서버 응답 실패");

        data = await res.json();
        tryCount++;

        // 중복이면 다시 요청 (최대 5번까지만 시도)
      } while (data.id === recommendData?.id && tryCount < 5);

      setRecommendData(data);
    } catch (error) {
      console.error("추천 데이터 불러오기 오류:", error);
      setRecommendData({
        title: "데이터 없음",
        author: "",
        content: "추천 데이터를 불러오지 못했습니다.",
        cover_url: "/images/exbook1.png",
      });
    } finally {
      setIsLoading(false);
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

      {/* 문학 추천 모달 */}
      {isModalOpen && (
        <div
          className="literature_modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="literature_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="literature_modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            {/* ❗항상 보이는 질문 텍스트 */}
            <p className="literature_modal-question">
              해당 작품에 대한 필사를 진행하시겠습니까?
            </p>

            {/* 🔄 책 정보 영역: 로딩 중이면 스피너, 아니면 내용 */}
            <div className="literature_book-info">
              {isLoading ? (
                <LoadingSpinner_modal />
              ) : (
                <>
                  {recommendData?.cover_url && (
                    <img
                      className="literature_book-cover"
                      src={recommendData.cover_url.replace(/"/g, "")}
                      alt={recommendData.title}
                    />
                  )}
                  <div className="literature_book-text">
                    <h3 className="literature_book-title">
                      [{recommendData.title}] - {recommendData.author}
                    </h3>
                    <p className="literature_book-content">
                      {recommendData.content.length > 250
                        ? recommendData.content.slice(0, 250) + "..."
                        : recommendData.content}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ❗항상 보이는 버튼 */}
            <div className="literature_modal-buttons">
              <button
                className="literature_btn-secondary"
                onClick={fetchRecommend}
              >
                다시추천
              </button>
              <button
                className="literature_btn-primary"
                onClick={goTranscription}
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
