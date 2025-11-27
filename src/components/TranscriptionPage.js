import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "./TranscriptionPage.css";
import "../App.css";
import { PiSunDim } from "react-icons/pi";
import { IoMoonOutline } from "react-icons/io5";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";

// 유틸 함수
// 긴 문자열을 일정한 수로 잘라 page배열에 넣는 함수.
// 직접 추가 전 코드
// function paginateContent(content, maxChars = 278) {
//   if (!content) return [""];
//   const text = content.replace(/\r\n/g, "\n").trim();
//   const pages = [];
//   let start = 0;
//   while (start < text.length) {
//     pages.push(text.slice(start, start + maxChars));
//     start += maxChars;
//   }
//   return pages;
// }
function paginateContent(content, maxChars = 278, maxLines = 5) {
  if (!content) return [""];

  const text = content.replace(/\r\n/g, "\n").trim();
  const pages = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChars;
    let chunk = text.slice(start, end);

    // 현재 chunk 안에서 줄바꿈 개수 세기
    const lines = chunk.split("\n");
    if (lines.length > maxLines) {
      // 줄이 너무 많으면 → 앞에서 maxLines까지만 잘라서 페이지 생성
      let lineCount = 0;
      let cutIndex = 0;
      for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === "\n") lineCount++;
        if (lineCount >= maxLines) {
          cutIndex = i + 1;
          break;
        }
      }
      chunk = chunk.slice(0, cutIndex); // 줄 기준으로 자르기
      end = start + cutIndex;
    }

    pages.push(chunk.trim());
    start = end;
  }

  return pages;
}

// // 필사 완료 후를 위한 유틸 함수
function getCompletedPages(pages, typedByPage) {
  return pages.reduce((count, page, idx) => {
    if (typedByPage[idx]?.trim().length >= page.trim().length) {
      return count + 1;
    }
    return count;
  }, 0);
}

export default function TranscriptionPage() {
  const navigate = useNavigate();
  // --- 상태 ---
  const editorRef = useRef(null);
  const [pages, setPages] = useState([]);
  // -- 다크모드 관련 --
  const [dark, setDark] = useState(false);

  // // 필사 완료 후를 위한 상태
  const [showModal, setShowModal] = useState(false);
  const [completedPages, setCompletedPages] = useState(0);

  // 현재 페이지 인덱스
  const [pageIdx, setPageIdx] = useState(0);

  // 페이지별로 타이핑한 내용 저장
  const [typedByPage, setTypedByPage] = useState(() =>
    Array.from({ length: pages.length }, () => "")
  );

  // 현재 페이지의 원문/입력값
  const paragraph = pages[pageIdx] || "";
  const typed = typedByPage[pageIdx] || "";

  // 사용자가 필사영역(contentEditable)에 글을 작성할 때 실행되는 핸들러
  const onInput = () => {
    // 필사 영역에 들어온 텍스트를 가져옴
    // const text = editorRef.current?.innerText ?? "";
    // setTypedByPage((prev) => {
    //   const next = [...prev];
    //   next[pageIdx] = text;
    //   return next;
    // });
    // if (isComposing.current) return;
    const text = editorRef.current?.innerText ?? "";
    setTypedByPage((prev) => {
      const next = [...prev];
      next[pageIdx] = text;
      return next;
    });
  };

  // 사용자가 필사 중간에 나갈 때 나타나는 경고창
  useEffect(() => {
    const handler = (e) => {
      if (typedByPage.some((t) => t.length > 0)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [typedByPage]);

  // 필사 영역
  const normalize = (s) => s.replace(/\r\n/g, "\n");
  const user = normalize(typed).slice(0, paragraph.length);
  const src = normalize(paragraph);

  // 11.27.원분 때문에 그래
  const ghostTextHTML = src
    .split("")
    .map((ch, i) => {
      if (i < user.length) {
        // 이미 작성한 글자 or 현재 입력 중인 글자 → 희미하게
        return `<span style="opacity: 0.2;">${ch}</span>`;
      }
      return ch; // 아직 입력 안 한 부분은 회색 그대로
    })
    .join("");

  // 중간 이후 추가됨.
  // ✅ 한글 조합 중 여부 감지 + 커서 위치 복원
  const isComposing = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleStart = () => (isComposing.current = true);

    const handleEnd = () => {
      isComposing.current = false;

      // 조합이 끝난 뒤에만 내용 갱신
      const text = editorRef.current?.innerText ?? "";
      setTypedByPage((prev) => {
        const next = [...prev];
        next[pageIdx] = text;
        return next;
      });

      // ✅ 커서를 작성 중인 글 바로 뒤로 복원
      requestAnimationFrame(() => {
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false); // 끝부분으로 커서 이동
        sel.removeAllRanges();
        sel.addRange(range);
      });
    };

    editor.addEventListener("compositionstart", handleStart);
    editor.addEventListener("compositionend", handleEnd);

    return () => {
      editor.removeEventListener("compositionstart", handleStart);
      editor.removeEventListener("compositionend", handleEnd);
    };
  }, [pageIdx]);

  // 공백과 줄바꿈을 같은 토큰으로 처리
  // 중간 이후 변경된 부분
  // const overlayText = src
  //   .split("")
  //   .map((ch, i) => (user[i] === ch ? ch : " "))
  //   .join("");

  const correctColor = dark ? "#fff" : "#000";
  const wrongColor = "#ff3b30";
  const currentInputColor = dark ? "#fff" : "#000";

  const overlayText = user
    .split("")
    .map((ch, i) => {
      if (i >= src.length) return "";

      const isLast = i === user.length - 1;

      if (isLast) {
        return `<span style="color: ${currentInputColor};">${ch}</span>`;
      }

      if (ch === src[i]) {
        return `<span style="color: ${correctColor};">${ch}</span>`; // ✅ 다크모드 대응됨
      } else {
        return `<span style="color: ${wrongColor};">${ch}</span>`;
      }
    })
    .join("");

  const goPrev = () => setPageIdx((i) => Math.max(0, i - 1));
  const goNext = () => setPageIdx((i) => Math.min(pages.length - 1, i + 1));

  // 페이지가 전환 될 때 커서의 위치가 입력이 진행되어야 하는 부분으로 위치시키는 역할.
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerText = typedByPage[pageIdx] || "";

    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    // 오류 잡는 거라 지우면 안됨 (아래 코드)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIdx]);

  //
  //
  // URL에서 id 가져오기
  const { id } = useParams();
  const location = useLocation();

  // CopyMainPage에서 넘어온 추천 데이터 먼저 사용
  // // 직접 추가로 인해 추가된 코드
  const [book, setBook] = useState(null);
  const [custom, setCustom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 서버에서 해당 책 데이터를 불러와 페이지를 나누어 배열에 저장하는 역할.
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/copy-items/${id}`
        );
        if (!res.ok) throw new Error("작품 조회 실패");
        const data = await res.json();
        setBook(data);

        // ✅ 페이지 나누기
        if (data?.content) {
          // //const splitPages = paginateContent(data.content, 300);
          const splitPages = paginateContent(data.content, 278, 5);
          // 쪼갠 페이지를 page배열에 저장.
          setPages(splitPages);
          setTypedByPage(Array.from({ length: splitPages.length }, () => ""));
          setPageIdx(0);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (id && !custom) fetchBook();
  }, [id, custom]);

  // 왜 필요한지는 모르겠는데 일단 필요함;;;
  useEffect(() => {
    if (book?.content) {
      // const cleanContent = book.content.replace(/\s*\n\s*/g, " ");
      const cleanContent = book.content.replace(/\s*\n\s*/g, " ");
      const newPages = paginateContent(cleanContent, 278);
      setPages(newPages);
      setPageIdx(0);
    }
  }, [book]);

  // //직접추가하기에서 전달된 내용이 있는지 확인
  useEffect(() => {
    if (
      location.pathname.includes("/copy/start/custom") &&
      location.state?.customContent
    ) {
      const { customTitle, customContent, color } = location.state;
      setCustom({ title: customTitle, content: customContent, color });

      // // const splitPages = paginateContent(customContent, 300);
      const splitPages = paginateContent(customContent, 278, 5);
      setPages(splitPages);
      setTypedByPage(Array.from({ length: splitPages.length }, () => ""));
      setPageIdx(0);
      setLoading(false);
    }
  }, [location]);

  // // 필사완료 후를 위한 핸들러들
  const handleFinishClick = () => {
    const completed = getCompletedPages(pages, typedByPage);
    setCompletedPages(completed);

    if (completed === pages.length) {
      // 전체 완료 → 바로 이동
      navigate("/transcription-complete", {
        state: { points: completed * 3, dark: dark, custom, book, typedByPage },
      });
    } else {
      // 중간 종료 → 모달 표시
      setShowModal(true);
    }
  };
  const handleModalExit = () => {
    navigate("/transcription-complete", {
      state: {
        points: completedPages * 3,
        dark: dark,
        custom,
        book,
        typedByPage,
      },
    });
  };

  const handleModalContinue = () => {
    setShowModal(false);
  };

  return (
    <div className={`page-root ${dark ? "dark" : ""}`}>
      <Navbar
        bgColor={dark ? "#262626" : "#ffffff"} // 다크모드일 땐 검정, 라이트모드일 땐 흰색
        textColor={dark ? "#FFFFFF" : "#262626"} // 다크모드일 땐 밝은 회색, 라이트모드일 땐 진한 회색
        logoSrc={dark ? "/images/logo_b.png" : "/images/logo_b.png"} // 다크일 땐 흰색 로고, 라이트일 땐 검정 로고
      />
      {/* 기본 세팅 */}
      <div className="container">
        <div className="main-back">
          {/* 새로 작성되는 css 부분들 */}
          <div className="page-container">
            <div className="actions">
              <button
                type="button"
                aria-label="다크 모드 전환"
                className={`toggle ${dark ? "on" : ""}`}
                onClick={() => setDark((v) => !v)}
              >
                <span className="knob">
                  {dark ? (
                    <IoMoonOutline className="knob-icon-Dark" />
                  ) : (
                    <PiSunDim className="knob-icon-Light" />
                  )}
                </span>
              </button>
            </div>

            {/* 책 정보 */}
            <div className="book-meta">
              {custom ? (
                <>
                  <span>⌈{custom.title || "제목 없음"}⌋</span>
                  <span className="sep"> - </span>
                  <span>사용자 작성</span>
                </>
              ) : (
                <>
                  <span>⌈{book?.title || "제목 없음"}⌋</span>
                  <span className="sep"> - </span>
                  <span>{book?.author || "작자 미상"}</span>
                </>
              )}
            </div>
            {/* 로딩 및 에러 표시 */}
            {loading && <p style={{ marginTop: 10 }}>작품을 불러오는 중...</p>}
            {error && (
              <p style={{ marginTop: 10, color: "crimson" }}>{error}</p>
            )}

            <div className="copy-wrap">
              {/* ← 좌측 화살표 */}
              <button
                type="button"
                className={`pager-btn left ${pageIdx === 0 ? "disabled" : ""}`}
                onClick={goPrev}
                aria-label="이전 페이지"
                disabled={pageIdx === 0}
              >
                <SlArrowLeft />
              </button>

              {/* 필사 박스 */}
              <section className="copy-box" aria-label="필사 입력 영역">
                {/* 회색 베이스(원문 전체) */}
                {/* <div className="ghost-text">{paragraph}</div> */}
                <div
                  className="ghost-text"
                  dangerouslySetInnerHTML={{ __html: ghostTextHTML }}
                ></div>

                {/* 검정 오버레이(쓴 부분만) */}
                <div
                  className="overlay-text"
                  aria-hidden="true"
                  // 중간 이후 추가
                  dangerouslySetInnerHTML={{ __html: overlayText }}
                ></div>

                {/* 투명 에디터(실제 입력) */}
                <div
                  className="editor"
                  ref={editorRef}
                  contentEditable
                  spellCheck={false}
                  onInput={onInput}
                  role="textbox"
                  aria-multiline="true"
                  aria-label="원문 위에 입력하세요"
                />
              </section>
              {/* → 우측 화살표 */}
              <button
                type="button"
                className={`pager-btn right ${
                  pageIdx === pages.length - 1 ? "disabled" : ""
                }`}
                onClick={goNext}
                aria-label="다음 페이지"
                disabled={pageIdx === pages.length - 1}
              >
                <SlArrowRight />
              </button>
            </div>

            {/* 하단 정보 + 버튼들 */}
            <div className="bottom-row">
              <div className="page-indicator">
                전체 페이지 {pageIdx + 1}/{pages.length}
              </div>
              <button className="btn-finish" onClick={handleFinishClick}>
                필사 종료하기
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

      {/* 필사 중간 나갈 시 모달 */}
      {showModal && (
        <div className={`middleout-modal-overlay ${dark ? "dark" : ""}`}>
          <div className="middleout-modal-box">
            <h3>작성 중인 필사를 중단하시겠습니까?</h3>
            <p>
              지금까지 작성한 내용은 ‘필사갈피’에 저장되며,
              <br /> 작성 완료한 페이지마다 3p가 지급됩니다.
            </p>
            <div className="middleout-modal-buttons">
              <button className="middleout-button1" onClick={handleModalExit}>
                중단하기
              </button>
              <button
                className="middleout-button2"
                onClick={handleModalContinue}
              >
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
