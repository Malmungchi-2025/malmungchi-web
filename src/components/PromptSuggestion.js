import { useEffect, useState } from "react";
import "./PromptSuggestion.css";
import { IoRefreshOutline } from "react-icons/io5";

const PromptSuggestion = () => {
  const [prompts, setPrompts] = useState([]);
  const [randomPrompt, setRandomPrompt] = useState(null);

  // 글감이랑 뜻 불러오기
  const fetchPrompts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/prompts`
      );
      const data = await res.json();
      setPrompts(data);
      setRandomPrompt(data[Math.floor(Math.random() * data.length)]);
    } catch (err) {
      console.error("❌ 글감 불러오기 실패", err);
    }
  };

  const refreshPrompt = () => {
    if (prompts.length > 0) {
      const random = prompts[Math.floor(Math.random() * prompts.length)];
      setRandomPrompt(random);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  if (!randomPrompt) return null;

  return (
    <div className="prompt-recommend-section">
      <div className="prompt-recommend-section_header">
        <span>추천 검색어</span>
        <button
          className="prompt-recommend_refresh-btn"
          onClick={refreshPrompt}
        >
          <IoRefreshOutline
            style={{ color: "#AAAAAA", fontSize: "22px", cursor: "pointer" }}
          />
        </button>
      </div>
      <p>
        <span className="promt-recommend-word">{randomPrompt.word}</span> :{" "}
        {randomPrompt.meaning}
      </p>
    </div>
  );
};

export default PromptSuggestion;
