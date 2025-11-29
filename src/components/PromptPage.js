import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import "../App.css";
import "./PromptPage.css";
import axios from "axios";

function PromptPage({ backgroundStyle }) {
  // 네비게이션 바 색상 전달
  const navBg =
    "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))";
  const textColor = "#FFFFFF";
  const logoSrc = "/images/logo_w.png";
  // 상태 정의
  const [prompts, setPrompts] = useState([]);
  const [prompt, setPrompt] = useState(
    prompts[Math.floor(Math.random() * prompts.length)]
  );
  const [showMeaning, setShowMeaning] = useState(false);
  const [fade, setFade] = useState("fade-in");

  // 모달에 데이터
  const navigate = useNavigate();
  const handleSelectPrompt = (prompt) => {
    navigate("/write", { state: prompt }); // prompt = { word, meaning }
  };

  //데이터 불러오기
  useEffect(() => {
    const fetchPrompts = async () => {
      console.log("API URL 👉", process.env.REACT_APP_SERVER_API_URL);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_API_URL}/api/prompts`
        );
        const data = response.data;
        setPrompts(data);

        // 처음 화면 로드 시 랜덤으로 하나 선택
        if (data.length > 0) {
          const randomPrompt = data[Math.floor(Math.random() * data.length)];
          setPrompt(randomPrompt);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };
    fetchPrompts();
  }, []);

  // 효과 설정
  useEffect(() => {
    const showWordTimer = setTimeout(() => {
      setFade("fade-out");

      const showMeaningTimer = setTimeout(() => {
        setShowMeaning(true);
        setFade("fade-in");

        // ✅ 뜻까지 3초 보여준 뒤 다음 글감으로 전환
        const nextPromptTimer = setTimeout(() => {
          changePrompt(); // 글감 변경 함수
        }, 3000); // 뜻 보여주는 시간

        return () => clearTimeout(nextPromptTimer);
      }, 500); // fade-out → fade-in 사이 딜레이

      return () => clearTimeout(showMeaningTimer);
    }, 3000); // 단어 보여주는 시간

    return () => clearTimeout(showWordTimer);
  }, [prompt]);

  // 글감 바꾸기 버튼 클릭 시
  const changePrompt = () => {
    if (prompts.length <= 1) return;

    let newPrompt;
    do {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    } while (newPrompt.word === prompt.word);

    setFade("fade-out"); // 먼저 fade-out 적용
    setTimeout(() => {
      setShowMeaning(false); // 의미 다시 숨기고
      setPrompt(newPrompt); // 새 글감 설정
      setFade("fade-in"); // 새 단어도 fade-in
    }, 300); // fade-out과 맞춰서 0.3초 후에 실행
  };

  return (
    <div>
      <Navbar bgColor={navBg} textColor={textColor} logoSrc={logoSrc} />
      <div className="container" style={backgroundStyle}>
        <div className="main-back">
          <div className="prompt-container">
            <p className="prompt-title">오늘의 글감</p>
            {prompt && prompt.word && (
              <p
                className={
                  showMeaning ? `prompt-meaning ${fade}` : `prompt-text ${fade}`
                }
              >
                {showMeaning ? prompt.meaning : `" ${prompt.word} "`}
              </p>
            )}
            <div className="button-container">
              <button className="btn" onClick={changePrompt}>
                글감 바꾸기
              </button>
              <button
                className="btn"
                onClick={() => handleSelectPrompt(prompt)}
              >
                작성하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer
        bgColor="#262626"
        textColor="#FAFAFA"
        logoSrc="/images/logo_w.png"
      />
    </div>
  );
}

export default PromptPage;
