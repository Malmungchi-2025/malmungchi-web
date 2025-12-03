import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "../App.css";
import "./TranscriptionDetail.css";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import LoadingSpinner_b from "./LoadingSpinner_bright";

export default function TranscriptionDetail() {
  const [pages, setPages] = useState([]);
  const [pageIdx, setPageIdx] = useState(0); // 현재 페이지 인덱스

  const { id } = useParams(); // URL에서 필사글 ID 가져오기
  const [data, setData] = useState(null); // 제목, 작가, 내용 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/transcriptions/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        const content = result.content || "";

        // 🔥 페이지 크기를 화면 높이에 맞춰서 자동 계산
        const zoom = window.devicePixelRatio;
        let pageSize;

        if (zoom >= 0.98) {
          pageSize = 248; // 기본 100%
        } else if (zoom >= 0.75) {
          pageSize = 236; // 80%
        } else {
          pageSize = 224; // 67% 이하
        }

        // 🔥 페이지 분할
        const splitted = [];
        for (let i = 0; i < content.length; i += pageSize) {
          splitted.push(content.slice(i, i + pageSize));
        }

        setData(result);
        setPages(splitted);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 로딩 처리 및 화면 표시
  if (isLoading) {
    return <LoadingSpinner_b />;
  }

  if (!data) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
        데이터를 불러오지 못했습니다.
      </p>
    );
  }

  const handlePrev = () => {
    if (pageIdx > 0) setPageIdx(pageIdx - 2);
  };

  const handleNext = () => {
    if (pageIdx < pages.length - 2) setPageIdx(pageIdx + 2);
  };

  return (
    <>
      <Navbar
        bgColor="#ffffff"
        textColor="#262626"
        logoSrc="/images/logo_b.png"
      />
      <div className="transcript-detail-container">
        <div className="main-back">
          <div className="detail-page">
            {/* 제목/저자 */}
            <h2 className="detail-title">
              [{data.title}] - {data.author}
            </h2>

            {/* 본문 */}
            <div className="detail-content">
              <div className="page-box">
                <p>{pages[pageIdx]}</p>
              </div>
              <div className="page-box">
                <p>{pages[pageIdx + 1] || ""}</p>
              </div>
            </div>

            {/* 화살표 버튼 */}
            <button
              className="arrow-btn left"
              onClick={handlePrev}
              disabled={pageIdx === 0}
            >
              <SlArrowLeft />
            </button>
            <button
              className="arrow-btn right"
              onClick={handleNext}
              disabled={pageIdx >= pages.length - 2}
            >
              <SlArrowRight />
            </button>

            {/* 페이지 표시 */}
            <p className="detail-footer">
              전체 페이지{" "}
              {pageIdx + 2 > pages.length ? pages.length : pageIdx + 2}/
              {pages.length}{" "}
            </p>
          </div>
        </div>
      </div>

      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </>
  );
}
