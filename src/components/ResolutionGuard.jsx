import React, { useEffect, useState } from "react";

const ResolutionGuard = ({ children }) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      const zoom = Math.round((window.outerWidth / window.innerWidth) * 100);

      const is1920 =
        width >= 1870 && width <= 1970 && zoom >= 98 && zoom <= 102;
      const is1760 = width >= 1710 && width <= 1810 && zoom >= 78 && zoom <= 82;
      const is1600 = width >= 1550 && width <= 1650 && zoom >= 65 && zoom <= 69;

      // ✅ 실제 노트북에서 Zoom 67%일 때 innerWidth가 1194쯤 나오는 경우 대응
      const isZoom67Match =
        zoom >= 65 && zoom <= 69 && width >= 1180 && width <= 1220;

      if (is1920 || is1760 || is1600 || isZoom67Match) {
        setStatus("ok");
      } else if (width <= 1810 && zoom < 65) {
        setStatus("zoom_too_low");
      } else if (width <= 1970 && zoom > 82) {
        setStatus("zoom_needed");
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

  let message = "";
  switch (status) {
    case "zoom_needed":
      message =
        "해상도는 맞지만 브라우저 Zoom 비율이 너무 큽니다.\n\n" +
        "해당 해상도에서는 다음과 같이 축소해주세요:\n\n" +
        "· 1920 → 100% (기본)\n· 1760 → 80%\n· 1600 → 67%";
      break;
    case "zoom_too_low":
      message =
        "브라우저 Zoom 비율이 너무 낮습니다.\n\n" +
        "아래 중 하나로 맞춰주세요:\n\n" +
        "· 1920 → 100%\n· 1760 → 80%\n· 1600 → 67%";
      break;
    case "unsupported":
    default:
      message =
        "현재 해상도는 지원되지 않습니다.\n\n" +
        "아래 세 가지 환경 중 하나로 접속해 주세요:\n\n" +
        "· 1920px (Zoom 100%)\n· 1760px (Zoom 80%)\n· 1600px (Zoom 67%)";
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        padding: "40px",
        lineHeight: 1.6,
        whiteSpace: "pre-line",
      }}
    >
      {message}
    </div>
  );
};

export default ResolutionGuard;
