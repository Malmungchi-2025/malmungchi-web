// NewLoginPage.js
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NewLoginPage.css";
import { UserContext } from "../contexts/UserContext";
import Footer from "./FooterNew";

export default function NewLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

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
        setUser(data.user);
        navigate(from, { replace: true });
      } else {
        setError("이메일 혹은 비밀번호를 다시 확인해주세요!");
      }
    } catch (err) {
      setError("서버 연결 오류");
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `${process.env.REACT_APP_SERVER_API_URL}/api/auth/kakao/web`;
  };

  return (
    <div className="new-login-container">
      {/* 전체 콘텐츠 (footer를 아래로 밀기 위한 영역) */}
      <div className="new-login-content">
        {/* 로고 */}
        <img
          src="/images/login_logo.png"
          className="new-login-logo"
          alt="logo"
        />

        <div className="new-login-wrapper">
          {/* 좌측: 이메일 로그인 */}
          <div className="new-login-left">
            <h2 className="new-login-title">이메일로 로그인하기</h2>

            <form onSubmit={handleSubmit} className="new-login-form">
              <input
                className="new-login-input-email"
                type="email"
                placeholder="가입하신 이메일을 입력하세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="new-login-input-password"
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="new-login-error-fixed">
                {error && <span className="new-login-error">{error}</span>}
              </div>

              <button className="new-login-submit" type="submit">
                로그인
              </button>
            </form>

            <div className="new-login-helper">
              <p className="new-login-helper-text1">
                아직 말뭉치 회원이 아니신가요?
              </p>
              <p className="new-login-helper-text2">
                회원가입은 앱에서만 가능합니다.
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="new-login-divider"></div>

          {/* 우측: SNS 로그인 */}
          <div className="new-login-right">
            <h2 className="new-login-title">SNS로 로그인하기</h2>

            <p className="new-login-desc">
              아이디와 비밀번호 입력하기 귀찮으시죠?
              <br />
              1초 회원가입으로 간편하게 로그인 하세요.
            </p>

            <button className="new-login-kakao" onClick={handleKakaoLogin}>
              <img src="/images/kakao_logo.png" alt="카카오" />
              카카오 1초 로그인
            </button>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </div>
  );
}
