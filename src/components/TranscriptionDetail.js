import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/FooterNew";
import "../App.css";
import "./TranscriptionDetail.css";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";

export default function TranscriptionDetail() {
  // 임시 데이터 (사용자가 필사한 내용이라고 가정)
  // const pages = [
  //   `계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다.
  //   가슴속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬이 아침이 오는 까닭이요, 내일 밤이 남은 까닭이요,
  //   아직 나의 청춘이 다하지 않은 까닭입니다. 별 하나에 추억과 별 하나의 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와
  //   별 하나에 어머니, 어머니, 어머님, 나는 별 하나에 아름다운 말 한 마디씩 불러 봅니다. 소학교 때 `,
  //   `책상을 같이 했던 아이들의 이름과,패, 경, 옥 이런 이국 소녀들의 이름과 벌써 애기 어머니 된 계집애들의 이름과, 가난한 이웃 사람들의 이름과,
  //   비둘기, 강아지, 토끼, 노새, 노루, 프랑시스 잠, 라이너 마리아 릴케 이런 시인의 이름을 불러 봅니다.
  //   이네들은 너무나 멀리 있습니다. 별이 아스라히 멀듯이, 어머님, 그리고 당신은 멀리 북간도에 계십니다.
  //   나는 무엇인지 그리워 이 많은 별빛이 내린 언덕 위에 내 이름자를 써 보고, 흙으로 덮어 버리었습니다.`,
  //   `딴은 밤을 새워 우는 벌레는 부끄러운 이름을 슬퍼하는 까닭입니다.
  //   그러나 겨울이 지나고 나의 별에도 봄이 오면 무덤 위에 파란 잔디가 피어나듯이 내 이름자 묻힌 언덕 위에도 자랑처럼 풀이 무성할 거외다.`,
  // ];

  const [pages, setPages] = useState([]);
  const [pageIdx, setPageIdx] = useState(0); // 현재 페이지 인덱스

  const { id } = useParams(); // URL에서 필사글 ID 가져오기
  const [data, setData] = useState(null); // 제목, 작가, 내용 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/transcriptions/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        // ✅ 긴 텍스트를 자동으로 페이지 분할
        const pageSize = 262; // 한 페이지당 문자 수 (디자인에 맞게 조정)
        const content = result.content || "";
        const splitted = [];

        for (let i = 0; i < content.length; i += pageSize) {
          splitted.push(content.slice(i, i + pageSize));
        }

        setData(result);
        setPages(splitted);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 로딩 처리 및 화면 표시
  if (isLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>로딩 중...</p>
    );
  }

  if (!data) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
        데이터를 불러오지 못했습니다.
      </p>
    );
  }

  const handlePrev = () => {
    if (pageIdx > 0) setPageIdx(pageIdx - 2);
  };

  const handleNext = () => {
    if (pageIdx < pages.length - 2) setPageIdx(pageIdx + 2);
  };

  return (
    <>
      <Navbar
        bgColor="#ffffff"
        textColor="#262626"
        logoSrc="/images/logo_b.png"
      />
      <div className="transcript-detail-container">
        <div className="main-back">
          <div className="detail-page">
            {/* 제목/저자 */}
            {/* <h2 className="detail-title">[별 헤는 밤] - 윤동주</h2> */}
            <h2 className="detail-title">
              [{data.title}] - {data.author}
            </h2>

            {/* 본문 */}
            <div className="detail-content">
              <div className="page-box">
                {/* <p>{pages[pageIdx]}</p> */}
                {/* <p>{data.content}</p> */}
                <p>{pages[pageIdx]}</p>
              </div>
              <div className="page-box">
                {/* {pages[pageIdx + 1] ? <p>{pages[pageIdx + 1]}</p> : <p></p>} */}
                <p>{pages[pageIdx + 1] || ""}</p>
              </div>
            </div>

            {/* 화살표 버튼 */}
            <button
              className="arrow-btn left"
              onClick={handlePrev}
              disabled={pageIdx === 0}
            >
              <SlArrowLeft />
            </button>
            <button
              className="arrow-btn right"
              onClick={handleNext}
              disabled={pageIdx >= pages.length - 2}
            >
              <SlArrowRight />
            </button>

            {/* 페이지 표시 */}
            <p className="detail-footer">
              전체 페이지{" "}
              {pageIdx + 2 > pages.length ? pages.length : pageIdx + 2}/
              {pages.length}{" "}
            </p>
          </div>
        </div>
      </div>

      <Footer
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </>
  );
}
