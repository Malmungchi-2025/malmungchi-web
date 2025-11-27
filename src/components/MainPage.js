import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar"; // 외부 컴포넌트
import Footer from "./FooterNew"; // 외부 컴포넌트
import "./MainPage.css";
import { TfiArrowCircleDown } from "react-icons/tfi";
import { BsArrowUpCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const sectionRefs = useRef([]);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // 푸터까지 인식하기 위함
  const footerRef = useRef(null);

  const scrollToSection = (index) => {
    sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  // 푸터영역까지 네비게이션 관리
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const section1 = sectionRefs.current[0];

      let isDown = false;

      if (section1) {
        const { top, height } = section1.getBoundingClientRect();
        const sectionTop = top + window.scrollY;

        // Section 1의 범위를 벗어나면 true
        if (scrollY >= sectionTop + height) {
          isDown = true;
        }
      }

      // ✅ Footer 영역에 들어오면 무조건 true로 설정
      if (footerRef.current) {
        const footerTop =
          footerRef.current.getBoundingClientRect().top + window.scrollY;
        if (scrollY + window.innerHeight >= footerTop + 100) {
          isDown = true;
        }
      }

      setIsScrolledDown(isDown);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      id: 0,
      className: "section1",
      title: "말뭉치,\n어휘력과 문해력을\n기르는 공간",
    },
    {
      id: 1,
      className: "section2",
      title: "고전문학으로\n 필사하기",
      description: "고전문학, 옛날신문, 노래가사",
      button: "필사하러 가기",
      image: "/images/main_section2.png",
    },
    {
      id: 2,
      className: "section3",
      title: "내가 직접\n 글 써보기",
      description: "글쓰기에 대한 설명글 작성",
      button: "글쓰러 가기",
      image: "/images/main_section3.png",
    },
    {
      id: 3,
      className: "section4",
      title: "말뭉치\n 모바일로 사용하기",
      description: "모바일 앱으로 AI와의 학습을 시작해보세요!",
      button: "다운받기",
      image: "/images/main_section4.png",
    },
  ];

  return (
    <div>
      <Navbar
        bgColor={isScrolledDown ? "#ffffff" : "#195fcf"}
        textColor={isScrolledDown ? "#262626" : "#ffffff"}
        logoSrc={isScrolledDown ? "/images/logo_b.png" : "/images/logo_w.png"}
      />
      <div className="main-wrapper">
        {sections.map((item, i) =>
          item.id === 0 ? (
            <section
              key={item.id}
              className={item.className}
              ref={(el) => (sectionRefs.current[i] = el)}
            >
              <div className="hero-text">
                <h2>{item.title}</h2>
              </div>
              <img
                className="hero-left-img"
                src="/images/main_marci1.png"
                alt="캐릭터왼쪽"
              />
              <img
                className="hero-right-img"
                src="/images/main_mungci1.png"
                alt="캐릭터오른쪽"
              />
              {/* ✅ 아래로 스크롤 버튼 */}
              <button
                className="scroll-down white-arrow"
                onClick={() => scrollToSection(1)}
              >
                <TfiArrowCircleDown />
              </button>
              <div className="section-indicator">
                01<span>/04</span>
              </div>
            </section>
          ) : item.id === 3 ? (
            // 🔸 Section 4 (Last, custom)
            <section
              key={item.id}
              className={`${item.className} special-layout`}
              ref={(el) => (sectionRefs.current[i] = el)}
            >
              <div className="main_content special-layout">
                <div className="image4">
                  <img src={item.image} alt={`section-${item.id}`} />
                </div>
                <div className="main_text">
                  <h2>{item.title}</h2>
                  {item.description && <p>{item.description}</p>}
                  {item.button && <button>{item.button}</button>}
                </div>
              </div>

              {/* ↑ 맨 위로 버튼 */}
              <button
                className="scroll-up blue-arrow"
                onClick={() => scrollToSection(0)}
              >
                <BsArrowUpCircle />
              </button>

              <div className="section-indicator blue-indicator">
                {String(i + 1).padStart(2, "0")}
                <span>/{String(sections.length).padStart(2, "0")}</span>
              </div>
            </section>
          ) : (
            // 🔄 Other Sections
            <section
              key={item.id}
              className={item.className}
              ref={(el) => (sectionRefs.current[i] = el)}
            >
              <div className="main_content">
                <div className="main_text">
                  <h2>{item.title}</h2>
                  {item.description && <p>{item.description}</p>}
                  {item.button && (
                    <button
                      onClick={() => {
                        if (item.id === 1) navigate("/copy-main");
                        if (item.id === 2) navigate("/");
                      }}
                    >
                      {item.button}
                    </button>
                  )}
                </div>
                <div className="image">
                  <img src={item.image} alt={`section-${item.id}`} />
                </div>
              </div>
              {/* ↓ 버튼 */}
              {i < sections.length - 1 && (
                <button
                  className={`scroll-down ${
                    i === 0 ? "white-arrow" : "blue-arrow"
                  }`}
                  onClick={() => scrollToSection(i + 1)}
                >
                  <TfiArrowCircleDown />
                </button>
              )}

              {/* ✅ 페이지 인디케이터 */}
              <div
                className={`section-indicator ${
                  i === 0 ? "white-indicator" : "blue-indicator"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
                <span>/{String(sections.length).padStart(2, "0")}</span>
              </div>
            </section>
          )
        )}
      </div>

      <Footer
        ref={footerRef}
        bgColor="#F7F7F7"
        textColor="#616161"
        logoSrc="/images/logo_b.png"
      />
    </div>
  );
}

export default MainPage;
