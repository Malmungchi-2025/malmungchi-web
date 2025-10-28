import "./TranscriptionBookmark.css";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner_b from "./LoadingSpinner_bright";

export default function TranscriptionBookmark() {
  // 임시 데이터
  // const works = [
  //   {
  //     id: 1,
  //     type: "classic", // 고전문학
  //     thumbnail: "/images/exbook2.png",
  //     title: "별 헤는 밤",
  //     date: "2025.09.23",
  //     author: "윤동주",
  //   },
  //   {
  //     id: 2,
  //     type: "custom", // 직접추가
  //     title: "곰선생의 고만해",
  //     date: "2025.09.22",
  //     author: "사용자 설정 별명",
  //     color: "#eff4fb",
  //   },
  //   {
  //     id: 3,
  //     type: "custom", // 직접추가
  //     title: "겨울잠",
  //     date: "2025.09.22",
  //     author: "사용자 설정 별명",
  //     color: "#BED7FF",
  //   },
  //   {
  //     id: 4,
  //     type: "custom", // 직접추가
  //     title: "바이 썸머",
  //     date: "2025.09.21",
  //     author: "사용자 설정 별명",
  //   },
  //   {
  //     id: 5,
  //     type: "custom", // 직접추가
  //     title: "겨울잠",
  //     date: "2025.09.20",
  //     author: "사용자 설정 별명",
  //     color: "#FFF2B2",
  //   },
  //   {
  //     id: 6,
  //     type: "classic", // 고전문학
  //     thumbnail: "/images/exbook1.png",
  //     title: "동백꽃",
  //     date: "2025.09.20",
  //     author: "김유정",
  //   },
  //   {
  //     id: 7,
  //     type: "custom", // 직접추가
  //     title: "이런 엔딩",
  //     date: "2025.09.20",
  //     author: "사용자 설정 별명",
  //     color: "#ECFF9F",
  //   },
  //   {
  //     id: 8,
  //     type: "classic", // 고전문학
  //     thumbnail: "/images/exbook3.jpg",
  //     title: "님의 침묵",
  //     date: "2025.09.20",
  //     author: "한용운",
  //   },
  //   {
  //     id: 9,
  //     type: "custom", // 직접추가
  //     title: "밤편지",
  //     date: "2025.09.20",
  //     author: "사용자 설정 별명",
  //     color: "#EFF4FB",
  //   },
  //   {
  //     id: 10,
  //     type: "custom", // 직접추가
  //     title: "에잇",
  //     date: "2025.09.20",
  //     author: "사용자 설정 별명",
  //     color: "#FFF2B2",
  //   },
  // ];
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/transcriptions/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("데이터 불러오기 실패");
        const data = await res.json();

        // API 응답 데이터 → 프론트 카드 형태로 변환
        const mapped = data.map((item) => {
          if (item.type === "classic") {
            return {
              id: item.id,
              type: "classic",
              title: item.source_title || "제목 없음", // 추후 JOIN 쿼리로 값 채우기
              author: item.source_author || "작자 미상",
              // thumbnail: item.source_cover_url || "/images/exbook1.png",
              thumbnail: item.source_cover_url
                ? item.source_cover_url.replace(/"/g, "")
                : "/images/exbook1.png",
              date: new Date(item.created_at).toLocaleDateString(),
            };
          } else {
            return {
              id: item.id,
              type: "custom",
              title: item.custom_title || "제목 없음",
              author: "사용자",
              color: item.custom_color || "#eff4fb",
              date: new Date(item.created_at).toLocaleDateString(),
            };
          }
        });

        setWorks(mapped);
        setLoading(false); // ✅ 데이터 로딩 완료 후 false로 변경
      } catch (err) {
        console.error(err);
        setLoading(false); // ✅ 에러 발생 시에도 로딩 해제
      }
    };
    fetchData();
  }, []);

  // ✅ 로딩 중일 때 스피너 표시
  if (loading) {
    return <LoadingSpinner_b />;
  }

  return (
    <>
      <Navbar
        bgColor="#ffffff"
        textColor="#262626"
        logoSrc="/images/logo_b.png"
      />
      <div className="bookmark-page">
        <h2 className="bookmark-title">필사한 작품 {works.length}</h2>
        <div className="bookmark-grid">
          {works.map((work) => (
            <div
              key={work.id}
              className={`bookmark-card ${
                work.type === "custom"
                  ? "bookmarkcard-custom"
                  : "bookmarkcard-classic"
              }`}
              style={
                work.type === "custom"
                  ? { backgroundColor: work.color || "#eff4fb" }
                  : {}
              }
              onClick={() => navigate(`/transcription-detail/${work.id}`)}
            >
              {work.type === "classic" && (
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="bookmarkcard-classic-thumbnail"
                />
              )}

              {/* 공통 정보 영역 */}
              <div className="bookmarkcard-info">
                <p className="bookmarkcard-date">{work.date}</p>
                <h3 className="bookmarkcard-title">{work.title}</h3>
                <p className="bookmarkcard-author">{work.author}</p>
              </div>
            </div>
          ))}
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
