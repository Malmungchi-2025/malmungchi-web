import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./AllPostsPage.css";
import Navbar from "../components/Navbar";
import FooterNew from "../components/FooterNew";
import { FaRegHeart } from "react-icons/fa6";
import { FiBookmark } from "react-icons/fi";
import { GoChevronDown } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { useLikeContext } from "../contexts/LikeContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AllPostsPage() {
  const navigate = useNavigate();
  const { updatedPosts } = useLikeContext();

  const [posts, setPosts] = useState([]);
  const [topScraps, setTopScraps] = useState([]);
  const [topLikes, setTopLikes] = useState([]);

  const [hoverIndex, setHoverIndex] = useState(2); // 중앙(3번째 카드)이 기본 강조
  const [navDark, setNavDark] = useState(false);
  const lowerSectionRef = useRef(null);

  // 이건 페이즈를 위함
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  //로딩 추가요
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

  // ✅ 스크롤 시 네비 색상 변경
  useEffect(() => {
    const handleScroll = () => {
      const triggerHeight = window.innerHeight * 0.7;
      setNavDark(window.scrollY > triggerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // // ✅ 아래 섹션으로 부드럽게 이동
  // const handleScrollDown = () => {
  //   lowerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleScrollDown = () => {
    if (lowerSectionRef.current) {
      const sectionTop = lowerSectionRef.current.offsetTop;
      const offset = 100; // 네비 높이 고려
      window.scrollTo({ top: sectionTop - offset, behavior: "smooth" });
    }
  };

  // api 호출
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true); // ✅ 로딩 시작
        const token = localStorage.getItem("token"); // 토큰 가져오기
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/writings/allpost`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!res.ok) {
          throw new Error("전체글 조회 실패");
        }

        const data = await res.json();
        setPosts(data);
        setTopScraps([...data].sort((a, b) => b.scraps - a.scraps).slice(0, 5));
        setTopLikes([...data].sort((a, b) => b.likes - a.likes).slice(0, 5));
      } catch (error) {
        console.error("❌ 전체글 불러오기 오류:", error);
      } finally {
        setLoading(false); // ✅ 로딩 종료
      }
    };

    fetchAllPosts();
  }, []);
  const colorMap = {
    blue: "#BED7FF", // 부드러운 하늘색
    yellow: "#FFF7AE", // 연한 파스텔 노랑
    green: "#E8F8B8", // 라임톤 민트
    white: "#F5F5F5", // 흰색 기본
    pink: "#FFDCDC", // 살구핑크
  };
  // ✅ mergedPosts 먼저 계산
  const mergedPosts = posts.map((p) => {
    const updated = updatedPosts[p.id];
    return updated ? { ...p, ...updated } : p;
  });

  // ✅ 현재 페이지에 맞는 글 목록 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const currentPosts = mergedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // ✅ 전체 페이지 수 계산
  // const totalPages = Math.ceil(posts.length / postsPerPage);
  const totalPages = Math.ceil(mergedPosts.length / postsPerPage);

  // ✅ 페이지 이동 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // window.scrollTo({
    //   top: lowerSectionRef.current.offsetTop,
    //   behavior: "smooth",
    // });
  };

  return (
    <div className="allpostpage-container">
      {loading && <LoadingSpinner />} {/* ✅ 로딩 중일 때 스피너 표시 */}
      <Navbar
        bgColor={navDark ? "#FFFFFF" : "#1E1E1E"}
        textColor={navDark ? "#1E1E1E" : "#FFFFFF"}
        logoSrc={navDark ? "/images/logo_b.png" : "/images/logo_w.png"}
      />
      <main className="allpostpage-main">
        {/* 상단 3D 카드 영역 */}
        <section className="allposts-wrapper">
          <h2 className="allposts-title">이달의 작품</h2>

          <div className="carousel">
            {topScraps.map((post, i) => {
              let positionClass = "allposts-card";
              if (i === hoverIndex) positionClass += " active";
              else if (i < hoverIndex) positionClass += " left";
              else if (i > hoverIndex) positionClass += " right";

              return (
                <article
                  key={post.id}
                  className={positionClass}
                  onMouseEnter={() => setHoverIndex(i)}
                  onClick={() => navigate(`/writingbookmark/${post.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="allposts-card-inner">
                    <div className="allposts-card-header">
                      <div className="allposts-card-meta-left">
                        <span className="allposts-card-author">
                          {post.author}
                        </span>
                        <span className="allposts-card-date">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="allposts-card-meta-right">
                        <span className="allposts-card-icon-group">
                          <FaRegHeart className="allposts-card-icon" />
                          {post.likes}
                        </span>
                        <span className="allposts-card-icon-group">
                          <FiBookmark className="allposts-card-icon" />
                          {post.scraps}
                        </span>
                      </div>
                    </div>

                    <div className="allposts-card-body">
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {/* ▼ 아래로 스크롤 버튼 */}
          <div className="allposts-down-btn" onClick={handleScrollDown}>
            <GoChevronDown className="allposts-scroll-icon" />
          </div>
        </section>

        {/* ▼ 두 번째 섹션 (밝은 화면) */}
        <section className="allposts-second-section" ref={lowerSectionRef}>
          <div className="allposts-second-inner">
            <h2>다른 사용자가 많이 좋아한 글</h2>
            <div className="allposts-popular-grid">
              {topLikes.length > 0 &&
                (() => {
                  const mainColor = colorMap[topLikes[0]?.color] || "#F5F5F5";
                  return (
                    <div
                      className="allposts-popular-box main"
                      style={{ backgroundColor: mainColor, cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/writingbookmark/${topLikes[0]?.id}`)
                      }
                    >
                      <p className="allposts-popular-date">
                        {new Date(topLikes[0]?.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </p>
                      <h3 className="allposts-popular-title">
                        {topLikes[0]?.title}
                      </h3>
                      <p className="allposts-popular-author">
                        {topLikes[0]?.author}
                      </p>

                      {/* 메인 카드 오버레이  */}
                      <div className="allposts-card-overlay main-overlay">
                        <p className="allposts-overlay-content">
                          {topLikes[0]?.content.slice(0, 210)}...
                        </p>
                        <div className="allposts-overlay-icons">
                          <span>
                            <FaRegHeart /> {topLikes[0]?.likes}
                          </span>
                          <span>
                            <FiBookmark /> {topLikes[0]?.scraps}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              {/* 나머지 4개 박스 */}
              {topLikes.slice(1, 5).map((post) => {
                const cardColor = colorMap[post.color] || "#F5F5F5";
                return (
                  <div
                    key={post.id}
                    className="allposts-popular-box sub"
                    style={{ backgroundColor: cardColor, cursor: "pointer" }}
                    onClick={() => navigate(`/writingbookmark/${post.id}`)}
                  >
                    <p className="allposts-popular-date-s">
                      {new Date(post.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                    <h3 className="allposts-popular-title-s">{post.title}</h3>
                    <p className="allposts-popular-author-s">{post.author}</p>

                    {/* ✅ Hover Overlay */}
                    <div className="allposts-card-overlay sub-overlay">
                      <p className="allposts-overlay-content">
                        {post.content.slice(0, 70)}...
                      </p>
                      <div className="allposts-overlay-icons">
                        <span>
                          <FaRegHeart /> {post.likes}
                        </span>
                        <span>
                          <FiBookmark /> {post.scraps}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ▼ 최신글 섹션 */}
        <section className="allposts-latest-section">
          <div className="allposts-latest-inner">
            <h2 className="allposts-latest-title">최신글</h2>

            {/* 검색창 */}
            <div className="allposts-search-bar">
              <input
                type="text"
                placeholder="원하는 글을 검색해보세요!"
                className="allposts-search-input"
              />
              <span className="allposts-search-icon">
                <FiSearch />
              </span>
            </div>

            {/* 게시글 리스트 (임시 데이터) */}
            <div className="allposts-list-table">
              {currentPosts.map((post) => (
                <div
                  key={post.id}
                  className="allposts-list-row"
                  onClick={() => navigate(`/writingbookmark/${post.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="allposts-list-col date">
                    {new Date(post.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="allposts-list-col title">{post.title}</span>
                  <span className="allposts-list-col author">
                    {post.author}
                  </span>
                  <span className="allposts-list-col icons">
                    <span>
                      <FaRegHeart className="allposts-list-icon-spartate" />
                      {post.likes}
                    </span>
                    <span>
                      <FiBookmark className="allposts-list-icon-spartate" />
                      {post.scraps}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="allposts-pagination">
              <span
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={currentPage === 1 ? "disabled" : ""}
              >
                {"<"}
              </span>

              {[...Array(totalPages)].map((_, idx) => (
                <span
                  key={idx}
                  className={
                    currentPage === idx + 1 ? "allposts-pagination-active" : ""
                  }
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </span>
              ))}

              <span
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={currentPage === totalPages ? "disabled" : ""}
              >
                {">"}
              </span>
            </div>
          </div>
        </section>
      </main>
      <FooterNew
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </div>
  );
}
