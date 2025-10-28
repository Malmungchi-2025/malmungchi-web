import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { UserContext } from "../contexts/UserContext"; // ✅ 경로 주의 (App.js와 동일)
import Footer from "./FooterNew";
import { LuInfo } from "react-icons/lu";
import CustomCheckbox from "../components/CustomCheckbox";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 체크박스에 보낼거임
  const [saveId, setSaveId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // ✅ 전역 user 상태 사용
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/auth/login/web`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user); // ✅ 전역 Context에 user 저장
        navigate(from, { replace: true });
      } else {
        setError(data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      setError("서버 연결 오류");
    }
  };

  return (
    <div className="login-container">
      {/* 로고 */}
      <img src="/images/logo_b.png" alt="말뭉치 로고" className="login-logo" />

      {/* 로그인 박스 */}
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-box-info">
          <h2 className="login-title">로그인</h2>
          <LuInfo style={{ fontSize: "22px", color: "#616161" }} />
        </div>

        <input
          className="login-box-email"
          type="email"
          placeholder="가입하신 이메일을 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-box-password"
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-options">
          <CustomCheckbox
            checked={saveId}
            onChange={() => setSaveId(!saveId)}
            label="아이디 저장"
          />
          <CustomCheckbox
            checked={autoLogin}
            onChange={() => setAutoLogin(!autoLogin)}
            label="자동 로그인"
          />
        </div>

        <button type="submit" className="login-btn">
          로그인
        </button>

        <div className="login-divider"> 아직 회원가입 전이라면 </div>

        <button type="button" className="login-btn-guest">
          비회원으로 계속하기
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* 푸터 */}
      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </div>
  );
}
