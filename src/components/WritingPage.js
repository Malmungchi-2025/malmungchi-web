import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./FooterNew";
import PromptModal from "./PromptModal";
import "../App.css";
import "./WritingPage.css";
import { PiNotebook } from "react-icons/pi";
import { TbArrowsExchange } from "react-icons/tb";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { ImCheckmark } from "react-icons/im";
import { RiArrowGoBackLine } from "react-icons/ri";

function WritingPage({ backgroundStyle }) {
  // 네비게이션 바 색상 전달
  const navBg = "rgba(0, 0, 0, 0.8)";
  const textColor = "#E0E0E0";
  const logoSrc = "./images/logo_w.png";

  //  변수 작성
  //
  // 시쓰기, 글쓰기 탭 전환
  const [activeTab, setActiveTab] = useState("글쓰기");
  // 사용자가 작성한 텍스트
  const [content, setContent] = useState("");
  //  탭에 맞는 글자수 제한
  const charLimit = activeTab === "글쓰기" ? 1000 : 200;
  // 맞춤법 검사 버튼 로딩
  const [loading, setLoading] = useState(false);

  // 사용자 입력 박스 수정 [textarea > div]
  // ??
  const editorRef = useRef(null);

  // 맞춤법 검사
  // gpt 맞춤법 검사 결과
  const [corrections, setCorrections] = useState([]);
  // 검사 결과 영역 표시 여부
  const [showResults, setShowResults] = useState(false);

  // 데베 데이터 이동
  const location = useLocation();
  const selectedPrompt = location.state; // { word, meaning }

  // 모달
  const [showModal, setShowModal] = useState(false);

  // 글 전달
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // 체크 아이콘 상태값
  const [selectedCoverColor, setSelectedCoverColor] = useState("white");

  // 교체 상태 저장_ 되돌리기 버튼을 위함.
  const [replacedMap, setReplacedMap] = useState({});

  // 설명보기 버튼을 위함
  const [expandedIndices, setExpandedIndices] = useState([]);

  // 함수 작성
  //
  //
  // 탭 전환 함수
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setContent("");
  };
  //
  // 글이 작성될 때마다 추적하여 진행되는 함수
  // 작성한 text를 상태에 저장 및 글자 수 제한 기능
  const handleContentChange = (e) => {
    const text = e.target.innerText || "";
    if (text.length <= charLimit) {
      setContent(text);
    }
  };
  //
  // 맞춤법 검사 함수
  const handleGrammarCheck = async () => {
    // 내용이 비어 있으면 경고창 생성
    if (!content.trim()) {
      alert("내용을 먼저 입력하세요!");
      return;
    }

    console.log("맞춤법 검사 요청 시작");
    // 로딩을 true로 하여 버튼은 검사중이 나타남.
    setLoading(true);

    try {
      // 서버로 보내기
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API_URL}/api/grammar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 사용자가 작성한 내용을 content에 담았기에 객체를 문자열로 변경
          body: JSON.stringify({ content }),
        }
      );

      // 1차,2차 파싱
      const data = await res.json();
      const parsed = JSON.parse(data.result);

      // correctins에 배열로 된 맞춤법 결과 저장
      setCorrections(parsed);
      // UI보여줄래요.
      setShowResults(true);

      // 검사 결과를 반영하여 HTML로 가공
      let resultHtml = content;
      parsed.forEach(({ original }) => {
        const span = `<span style="color:#FF0D0D;">${original}</span>`;
        // replaceAll() 함수를 이용하여 문자를 색 있는 문자로 변경
        resultHtml = resultHtml.replaceAll(original, span);
      });

      // 이때만 innerHTML을 직접 덮어씌움
      // 텍스트 박스에 보이도록 innerHTML에 뒤집어 씀
      if (editorRef.current) {
        editorRef.current.innerHTML = resultHtml;
      }
    } catch (error) {
      alert("맞춤법 검사 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 교체하기 버튼을 누르면 실행되는 함수
  // 다시 공부 및 정리하기
  // const handleReplaceText = (original, corrected) => {
  //   const alreadyReplaced = replacedMap[original];

  //   let updatedText;
  //   if (alreadyReplaced) {
  //     // 되돌리기
  //     updatedText = content.replaceAll(corrected, original);
  //     editorRef.current.innerHTML = updatedText;
  //     setReplacedMap((prev) => ({ ...prev, [original]: false }));
  //   } else {
  //     // 교체하기
  //     updatedText = content.replaceAll(
  //       original,
  //       `<span style="color:#1E90FF;">${corrected}</span>`
  //     );
  //     editorRef.current.innerHTML = updatedText;
  //     setReplacedMap((prev) => ({ ...prev, [original]: true }));
  //   }

  //   // 상태 동기화
  //   setContent(updatedText.replace(/<[^>]*>/g, "")); // 태그 제거된 텍스트
  // };
  const handleReplaceText = (original, corrected, index) => {
    const editor = editorRef.current;
    if (!editor) return;

    const alreadyReplaced = replacedMap[index];
    let updatedText = editor.innerHTML;

    if (alreadyReplaced) {
      // ✅ 되돌리기: 원래 텍스트 복원 + 색상 검정
      updatedText = updatedText.replace(
        new RegExp(`<span style="color:#1E90FF;">${corrected}</span>`, "g"),
        `<span style="color:#616161; font-weight:400;">${original}</span>`
      );
      editor.innerHTML = updatedText;

      // 색상 직접 변경
      const spans = editor.querySelectorAll("span");
      spans.forEach((span) => {
        if (span.textContent === original) {
          span.style.color = "#616161";
        }
      });

      setReplacedMap((prev) => ({ ...prev, [index]: false }));
    } else {
      // ✅ 교체하기: 본문 단어를 파란색 교정 단어로 교체
      updatedText = updatedText.replace(
        original,
        `<span style="color:#1E90FF;">${corrected}</span>`
      );
      editor.innerHTML = updatedText;

      // 색상 직접 지정 (해당 글자만)
      const spans = editor.querySelectorAll("span");
      spans.forEach((span) => {
        if (span.textContent === corrected) {
          span.style.color = "#1E90FF";
        }
      });

      setReplacedMap((prev) => ({ ...prev, [index]: true }));
    }

    // 본문 상태 동기화
    setContent(editor.innerText);
  };

  //
  // 색상 버튼 선택 시 체크 아이콘 핸들러
  const handleCoverSelect = (color) => {
    setSelectedCoverColor(color);
  };

  // 설명보기 부분 핸들러
  const handleToggleExplanation = (index) => {
    setExpandedIndices((prev) => {
      if (prev.includes(index)) {
        // 이미 열려 있으면 닫기
        return prev.filter((i) => i !== index);
      } else {
        // 없으면 추가
        return [...prev, index];
      }
    });
  };

  return (
    <div>
      <Navbar bgColor={navBg} textColor={textColor} logoSrc={logoSrc} />
      <div className="container" style={backgroundStyle}>
        <div className="writing-wrapper">
          <div className="nav">
            <div className="tabs">
              <p
                className={`tab ${activeTab === "시쓰기" ? "active" : ""}`}
                onClick={() => handleTabClick("시쓰기")}
              >
                시 쓰기
              </p>
              <p
                className={`tab ${activeTab === "글쓰기" ? "active" : ""}`}
                onClick={() => handleTabClick("글쓰기")}
              >
                글 쓰기
              </p>
            </div>
            <div className="action-buttons">
              <button className="icon-btn" onClick={() => setShowModal(true)}>
                <PiNotebook size={34} color="rgba(97, 97, 97, 1)" />
              </button>
              <button
                className={`action-btn1 ${loading ? "loading" : ""}`}
                onClick={handleGrammarCheck}
                disabled={loading} // 클릭 방지도 가능
              >
                {loading ? "검사 중" : "맞춤법 검사하기"}
              </button>
              <button
                className="action-btn2"
                onClick={() =>
                  navigate("/complete", {
                    state: {
                      title: title,
                      content: content,
                      promptId: selectedPrompt.id,
                      color: selectedCoverColor,
                    },
                  })
                }
              >
                저장하기
              </button>
            </div>
          </div>

          <div className="align">
            <input
              className="title-input"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* 수정된 contenteditable div */}
            <div
              className="content-input"
              contentEditable
              ref={editorRef}
              onInput={handleContentChange}
              suppressContentEditableWarning={true}
              placeholder="내용을 입력하세요"
            ></div>
            <div className="char-counter">
              글자수 {content.length} / {charLimit}
            </div>
          </div>

          <div className="bookcover">
            <p>책표지</p>
            <div className="cover-options">
              {["blue", "yellow", "green", "white"].map((color) => (
                <button
                  key={color}
                  className={`cover-btn ${color}`}
                  onClick={() => handleCoverSelect(color)}
                >
                  {selectedCoverColor === color && (
                    <span className="check-icon">
                      <ImCheckmark size={20} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {showResults && (
            <div className="correction-wrapper">
              <h3>맞춤법 검사 결과</h3>
              <div className="correction-results">
                {corrections.length > 0 ? (
                  corrections.map((item, index) => {
                    const isReplaced = replacedMap[item.original];
                    return (
                      <div
                        key={index}
                        className={`correction-item ${
                          expandedIndices.includes(index) ? "expanded" : ""
                        }`}
                      >
                        <div className="correction-texts">
                          <span className="original">{item.original}</span>
                          <span className="arrow">→</span>
                          <span className="corrected">{item.corrected}</span>
                        </div>

                        <div className="correction-buttons">
                          <button
                            className={`correction-btn ${
                              isReplaced ? "undo" : ""
                            }`}
                            onClick={() =>
                              // handleReplaceText(item.original, item.corrected)
                              handleReplaceText(
                                item.original,
                                item.corrected,
                                index
                              )
                            }
                          >
                            {isReplaced ? (
                              <>
                                <RiArrowGoBackLine
                                  className="icon-space"
                                  color="#616161"
                                />
                                되돌리기
                              </>
                            ) : (
                              <>
                                <TbArrowsExchange
                                  className="icon-space"
                                  color="white"
                                />
                                교체하기
                              </>
                            )}
                          </button>

                          <button
                            className="correction-btn"
                            onClick={() => handleToggleExplanation(index)}
                          >
                            <HiOutlineChatBubbleOvalLeftEllipsis
                              className="icon-space"
                              color="white"
                            />
                            설명보기
                          </button>
                        </div>
                        {expandedIndices.includes(index) && (
                          <div className="explanation-box">
                            {item.type ? item.type : "오류 유형 정보 없음"}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="correction-item">교정된 내용이 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer
        bgColor="#262626"
        textColor="#FAFAFA"
        logoSrc="/images/logo_w.png"
      />
      {showModal && selectedPrompt && (
        <PromptModal
          word={selectedPrompt.word}
          meaning={selectedPrompt.meaning}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default WritingPage;
