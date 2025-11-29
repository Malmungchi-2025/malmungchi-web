import React, { useEffect, useState } from "react";

const ResolutionGuard = ({ children }) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;

      // 기준 범위
      const isDesktop100 = width >= 1870;
      const isMiddle80 = width >= 1500 && width < 1750;
      const isLaptop67 = width >= 1180 && width < 1350;

      if (isDesktop100 || isMiddle80 || isLaptop67) {
        setStatus("ok");
      } else {
        setStatus("unsupported");
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (status === "checking") return null;
  if (status === "ok") return children;

  // 안내 메시지
  const message = `
현재 화면 크기는 지원되지 않습니다.

아래 중 하나로 접속해주세요:

· window width ≥ 1870px ➝ Zoom 100%
· window width 1500~1750 ➝ Zoom 80%
· window width 1180~1350 ➝ Zoom 67%
`;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        padding: "40px",
        whiteSpace: "pre-line",
        lineHeight: 1.6,
      }}
    >
      {message}
    </div>
  );
};

export default ResolutionGuard;
