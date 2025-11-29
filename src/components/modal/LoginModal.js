import { useNavigate, useLocation } from "react-router-dom";
import "./LoginModal.css";
import { useUser } from "../../contexts/UserContext";
import { useState, useEffect } from "react";
import { CgArrowsExchange } from "react-icons/cg";

function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  // 프로필 변경을 위함
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(user?.profileImage);

  // 프로필 이미지 목록
  const profileImages = [
    "/images/profil_character1.png",
    "/images/profil_character2.png",
    "/images/profil_character3.png",
    "/images/profil_character4.png",
  ];

  useEffect(() => {
    if (user) {
      fetchUserProfile(setUser); // 🔥 최신 사용자 DB 정보 가져오기
    }
  }, []);

  async function fetchUserProfile(setUser) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/web-auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 소문자
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("✅ user 전체:", data.user);

      if (data.success) {
        setUser(data.user);
      }
    } catch (e) {
      console.error("🔴 사용자 정보 불러오기 오류:", e);
    }
  }

  // 게이지 계산 로직
  function getLevelGaugePercent(point, level) {
    switch (level) {
      case 1:
        return (point / 1350) * 100;
      case 2:
        return ((point - 1350) / 1350) * 100;
      case 3:
        return ((point - 2700) / 1350) * 100;
      case 4:
      default:
        return 100;
    }
  }

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
              src={user.profile_image || "/images/profilImage2.png"}
              alt="프로필"
              className="mypage-modal-profileImg"
            />
            <button
              className="mypage-profile-change-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <CgArrowsExchange size={16} />
              캐릭터 변경하기
            </button>
            <h3 className="mypage-modal-username">{user.name}</h3>

            {/* 학습 게이지 영역 */}
            <div className="mypage-modal-xp">
              <div className="mypage-modal-xp-info">
                <span className="xp-label">학습포인트</span>
                <span className="xp-value">{user.point ?? 420}XP</span>
              </div>
              <div className="xp-bar">
                {/* <div className="xp-progress" style={{ width: "40%" }}></div> */}
                <div
                  className="xp-progress"
                  style={{
                    width: `${getLevelGaugePercent(user.point, user.level)}%`,
                  }}
                ></div>
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

        {/* 프로필 변경 모달 영역*/}
        {isModalOpen && (
          <div className="profile-modal-overlay">
            <div className="profile-modal-box">
              <h3>프로필 캐릭터 변경</h3>
              <div className="profile-image-options">
                {profileImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`캐릭터 ${index}`}
                    className={`profile-option-img ${
                      selectedImage === img ? "selected" : ""
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
              <div className="profil-modal-btns">
                <button
                  className="profil-modal-btn-no"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className="profil-modal-btn-yes"
                  onClick={async () => {
                    const token = localStorage.getItem("token");

                    try {
                      const res = await fetch(
                        `${process.env.REACT_APP_SERVER_API_URL}/api/web-auth/profile-image`,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ profileImage: selectedImage }),
                        }
                      );

                      const data = await res.json();

                      if (data.success) {
                        setUser((prev) => ({
                          ...prev,
                          profile_image: selectedImage,
                        }));
                        setIsModalOpen(false);
                      } else {
                        console.error("❌ 이미지 저장 실패:", data.message);
                      }
                    } catch (err) {
                      console.error("❌ 요청 오류:", err);
                    }
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
