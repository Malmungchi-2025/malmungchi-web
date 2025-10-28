import { useNavigate, useLocation } from "react-router-dom";
import "./LoginModal.css";
import { useUser } from "../contexts/UserContext";

function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  return (
    <div className="login-modal-overlay">
      <div
        className={`login-modal-box ${user ? "mypage" : "login"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로그인 안 된 경우 */}
        {!user ? (
          <div className="login-modal-content">
            <p>
              말뭉치에 로그인하고
              <br />
              다양한 학습을 경험하세요!
            </p>
            <button
              className="login-modal-login-button"
              onClick={() => {
                onClose();
                // 현재 페이지 경로 저장해서 로그인 후 돌아오기
                navigate("/login", { state: { from: location.pathname } });
              }}
            >
              로그인
            </button>
          </div>
        ) : (
          // 로그인 된 경우 : 마이페이지
          <div className="mypage-modal-content">
            <img
              src={user.profileImage || "/images/login_basic_profil.png"}
              alt="프로필"
              className="mypage-modal-profileImg"
            />
            <h3 className="mypage-modal-username">{user.name}</h3>

            {/* 학습 게이지 영역 */}
            <div className="mypage-modal-xp">
              <div className="mypage-modal-xp-info">
                <span className="xp-label">학습게이지</span>
                <span className="xp-value">{user.point ?? 0}XP</span>
              </div>
              <div className="xp-bar">
                <div className="xp-progress" style={{ width: "40%" }}></div>
              </div>
            </div>

            <button
              className="mypage-modal-logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null); // Context 초기화
                onClose();
              }}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
