import "./WritingBookmark.css";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function WritingBookmark() {
  // 임시 데이터 (사용자가 작성한 글)
  // const [scraps] = useState([
  //   {
  //     id: 101,
  //     title: "별 헤는 밤",
  //     date: "2025.09.20",
  //     author: "윤동주",
  //     color: "#F5F5F5",
  //   },
  //   {
  //     id: 102,
  //     title: "진달래꽃",
  //     date: "2025.09.19",
  //     author: "김소월",
  //     color: "#FFF2B2",
  //   },
  // ]);

  const navigate = useNavigate();
  const [myWritings, setMyWritings] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  // 탭
  // ✅ 현재 탭 상태 (기본값: 내가 쓴 글)
  const [activeTab, setActiveTab] = useState("mine");

  // ✅ 현재 표시할 데이터
  const currentData = activeTab === "mine" ? myWritings : scraps;

  // ✅ 로그인 확인 및 데이터 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchMyWritings = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/writings/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) setMyWritings(data);
      } catch (err) {
        console.error("❌ 글 불러오기 실패:", err);
      }
    };

    // ✅ 내가 스크랩한 글 불러오기
    const fetchMyScraps = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/scraps/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) setScraps(data);
      } catch (err) {
        console.error("❌ 스크랩 불러오기 실패:", err);
      }
    };

    // fetchMyWritings();
    // fetchMyScraps();
    const loadAllData = async () => {
      await Promise.all([fetchMyWritings(), fetchMyScraps()]);
      setLoading(false); // ✅ 모든 데이터 로드 완료 후 로딩 해제
    };
    loadAllData();
  }, [navigate]);

  // ✅ 로딩 중일 때 스피너 표시
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar
        bgColor="#000000"
        textColor="#ffffff"
        logoSrc="/images/logo_w.png"
      />
      <div className="writingbookmark-page">
        {/* 탭 메뉴 */}
        <div className="writingbookmark-tabs">
          <h2
            className={`writingbookmark-tab ${
              activeTab === "mine" ? "active" : ""
            }`}
            onClick={() => setActiveTab("mine")}
          >
            내가 쓴 글 {myWritings.length}
          </h2>
          {/* 탭 사이 구분 막대 추가 */}
          <span className="divider">|</span>
          <h2
            className={`writingbookmark-tab ${
              activeTab === "scrap" ? "active" : ""
            }`}
            onClick={() => setActiveTab("scrap")}
          >
            스크랩 {scraps.length}
          </h2>
        </div>

        <div className="writingbookmark-grid">
          {currentData.map((w) => {
            const colorMap = {
              blue: "#BED7FF", // 부드러운 하늘색
              yellow: "#FFF7AE", // 연한 파스텔 노랑
              green: "#E8F8B8", // 라임톤 민트
              white: "#F5F5F5", // 흰색 기본
              pink: "#FFDCDC", // 살구핑크
            };

            const cardColor = colorMap[w.color] || "#F5F5F5";

            return (
              <div
                key={w.id}
                className="writingbookmark-card"
                style={{ backgroundColor: cardColor }}
                onClick={() => navigate(`/writingbookmark/${w.id}`)}
              >
                <div className="writingbookmarkcard-info">
                  <p className="writingbookmark-date">
                    {w.created_at?.slice(0, 10)}
                  </p>
                  {/* 중복되는 이름 있어서 쩔수 */}
                  <h3 className="writingbookmark-title-text">{w.title}</h3>
                  <p className="writingbookmark-author">
                    {w.prompt_title || "직접 추가한 글"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer
        bgColor="#262626"
        textColor="#FAFAFA"
        logoSrc="/images/logo_w.png"
      />
    </>
  );
}
