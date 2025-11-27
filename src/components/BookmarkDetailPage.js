import "./BookmarkDetailPage.css";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { FaRegHeart } from "react-icons/fa6";
// import { FiBookmark } from "react-icons/fi";
import { useLikeContext } from "../contexts/LikeContext";

import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";

export default function BookmarkDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  const [liked, setLiked] = useState(null);
  const [scrapped, setScrapped] = useState(null);
  const token = localStorage.getItem("token");

  const { updatePostCounts } = useLikeContext();

  // ✅ 글 데이터 + 좋아요/스크랩 상태 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 로그인 여부 확인
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchPostData = async () => {
      try {
        // 1️⃣ 글 데이터 불러오기
        const postRes = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/writings/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const postData = await postRes.json();
        if (postRes.ok) setPost(postData);
        else throw new Error("글 불러오기 실패");

        // 2️⃣ 좋아요/스크랩 상태 확인
        const [likeRes, scrapRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_SERVER_API_URL}/api/likes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_SERVER_API_URL}/api/scraps/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const likeData = await likeRes.json();
        const scrapData = await scrapRes.json();

        setLiked(likeData.liked);
        setScrapped(scrapData.scrapped);
      } catch (err) {
        console.error("❌ 서버 오류:", err);
        alert("데이터를 불러오지 못했습니다.");
      }
    };

    fetchPostData();
  }, [id, navigate]);

  // ✅ 좋아요 토글
  const handleLike = async () => {
    if (!post || liked === null) return;
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/likes/${id}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const newLikes = Number(post.likes || 0) + (liked ? -1 : 1);
        setLiked(!liked);
        setPost({
          ...post,
          likes: newLikes,
        });
        updatePostCounts(id, { likes: newLikes, scraps: post.scraps });
      }
    } catch (err) {
      console.error("❌ 좋아요 처리 오류:", err);
    }
  };

  // ✅ 스크랩 토글
  const handleScrap = async () => {
    if (!post || scrapped === null) return;
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const method = scrapped ? "DELETE" : "POST";
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/scraps/${id}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const newScraps = Number(post.scraps || 0) + (scrapped ? -1 : 1);
        setScrapped(!scrapped);
        setPost({
          ...post,
          scraps: newScraps,
        });
        updatePostCounts(id, { likes: post.likes, scraps: newScraps });
      }
    } catch (err) {
      console.error("❌ 스크랩 처리 오류:", err);
    }
  };

  if (!post) return null;

  return (
    <div className="container">
      <Navbar
        bgColor="#ffffff"
        textColor="#262626"
        logoSrc="/images/logo_b.png"
      />

      <main
        className="main-back"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div className="bookmarkdetail-wrapper">
          <div className="bookmarkdetail-header">
            <h3 className="bookmarkdetail-prompt">{post.prompt_title}</h3>
            <h2 className="bookmarkdetail-title">{post.title}</h2>
            <div className="bookmarkdetail-top">
              <div className="bookmarkdetail-meta">
                <span>{post.author || "익명"}</span>
                <span>{post.created_at?.slice(0, 10)}</span>
              </div>
              <div className="bookmarkdetail-icons">
                <div
                  className="icon-group"
                  onClick={handleLike}
                  style={{ cursor: "pointer" }}
                >
                  {/* <FaRegHeart
                    className="icon"
                    style={{ color: liked ? "#ff5a5a" : "#999" }}
                  /> */}
                  <FaHeart
                    className={`icon like-icon ${liked ? "liked" : ""}`}
                  />
                  <span>{post.likes ?? 0}</span>
                </div>
                <div
                  className="icon-group"
                  onClick={handleScrap}
                  style={{ cursor: "pointer" }}
                >
                  {/* <FiBookmark
                    className="icon"
                    style={{ color: scrapped ? "#1CD282" : "#999" }}
                  /> */}
                  <BsBookmarkFill
                    className={`icon scrap-icon ${scrapped ? "scrapped" : ""}`}
                  />
                  <span>{post.scraps ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bookmarkdetail-box">
            <div className="bookmarkdetail-content">
              {post.content.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </div>
  );
}
