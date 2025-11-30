import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "./TranscriptionCompletePage.css";
import "../App.css";

function TranscriptionCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const colorMap = {
    blue: "#bed7ff",
    yellow: "#fff2b2",
    green: "#ecff9f",
    white: "#fafafa",
  };
  // const points = location.state?.points || 0;
  // const { points, dark } = location.state || { points: 0, dark: false };
  const { points, dark, custom, book, typedByPage = [] } = location.state || {};
  const typedContent = typedByPage.length > 0 ? typedByPage.join("\n") : "";

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요한 서비스입니다");
        navigate("/login");
        return;
      }

      // const { custom, book, typedByPage } = location.state;
      // const typedContent = typedByPage.join("\n");

      const payload = {
        type: custom ? "custom" : "classic",
        sourceId: book?.id || null,
        customTitle: custom?.title || null,
        customContent: custom?.content || null,
        typedContent,
        customColor: custom?.color ? colorMap[custom.color] : null,
      };

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/transcriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("저장 실패");

      alert("저장 완료! 필사갈피에서 확인할 수 있습니다.");
      navigate("/transcription-bookmark");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 저장 안하는 함수
  const handleCancelSave = () => {
    const confirmed = window.confirm(
      "작성한 내용과 포인트가 저장되지 않습니다.\n저장하지 않겠습니까?"
    );
    if (confirmed) {
      navigate("/copy-main");
    }
  };

  return (
    <div>
      <Navbar
        bgColor={dark ? "#262626" : "#ffffff"}
        textColor={dark ? "#FAFAFA" : "#262626"}
        logoSrc={dark ? "/images/logo_w.png" : "/images/logo_b.png"}
      />
      <div
        className="container"
        style={{ backgroundColor: dark ? "#262626" : "#fff" }}
      >
        <div className="main-back">
          <div className="TCP-hero-center">
            <h2 style={{ color: dark ? "#EFF4FB" : "#195FCF" }}>필사 완료!</h2>
            <img
              src={
                dark
                  ? "/images/tcp_marci_dark.png" // 어두운 버전 이미지
                  : "/images/tcp_marci_mungci.png"
              }
              alt="캐릭터"
            />
            <p style={{ color: dark ? "#EFF4FB" : "#262626" }}>
              {points} XP 획득!
            </p>
            <div className="TCP-button-group">
              <button
                className={`TCP-btn-cancel ${dark ? "dark" : "light"}`}
                onClick={handleCancelSave}
              >
                저장하지 않기
              </button>
              <button
                className={`TCP-btn-save ${dark ? "dark" : "light"}`}
                onClick={handleSave}
              >
                작품 저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer
        bgColor={dark ? "#262626" : "#F7F7F7"}
        textColor={dark ? "#FAFAFA" : "#616161"}
        logoSrc={dark ? "/images/logo_w.png" : "/images/logo_b.png"}
      />
    </div>
  );
}
export default TranscriptionCompletePage;
