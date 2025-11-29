import React, { useEffect, useState } from "react";

const ResolutionGuard = ({ children }) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;

      if (width >= 1870) {
        setStatus("ok_100");
      } else if (width >= 1450 && width < 1870) {
        setStatus("zoom_80");
      } else if (width >= 1180 && width < 1450) {
        setStatus("zoom_67");
      } else {
        setStatus("unsupported");
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (status === "checking") return null;
  if (status === "ok_100") return children;

  // 안내 메시지 분기
  let message = "";
  switch (status) {
    case "zoom_80":
      message =
        "현재 해상도에서는 Zoom 80%로 축소해서 봐야 정상적으로 보입니다.\n\n브라우저 설정에서 비율을 조정해주세요.";
      break;
    case "zoom_67":
      message =
        "현재 해상도에서는 Zoom 67%로 축소해서 봐야 정상적으로 보입니다.\n\n브라우저 설정에서 비율을 조정해주세요.";
      break;
    case "unsupported":
      message =
        "현재 해상도는 너무 작아 콘텐츠를 정상적으로 볼 수 없습니다.\n\n다른 디바이스나 화면 비율을 조정해주세요.";
      break;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px",
        fontSize: "20px",
        fontWeight: "500",
        whiteSpace: "pre-line",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

export default ResolutionGuard;
