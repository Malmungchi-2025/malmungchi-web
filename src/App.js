import React from "react";
import LandingPage from "./components/LandingPage";
import PromptPage from "./components/PromptPage";
import WritingPage from "./components/WritingPage";
import CompletePage from "./components/CompletePage";
import PromptArticlesPage from "./components/PromptArticlesPage";
import CopyMainPage from "./components/CopyMainPage";
import TranscriptionPage from "./components/TranscriptionPage";
import DirectAddPage from "./components/DirectAddPage";
import TranscriptionCompletePage from "./components/TranscriptionCompletePage";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import TranscriptionBookmark from "./components/TranscriptionBookmark";
import TranscriptionDetail from "./components/TranscriptionDetail";
import { UserProvider } from "./contexts/UserContext";
import WritingBookmark from "./components/WritingBookmark";
import BookmarkDetailPage from "./components/BookmarkDetailPage";
import AllPostsPage from "./components/AllPostsPage";
import { LikeProvider } from "./contexts/LikeContext";
import ResolutionGuard from "./components/ResolutionGuard";

// 리액트 훅
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// css 파일
import "./App.css";

function App() {
  // 배경화면 랜덤으로 설정 및 초기에만 세팅
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [user, setUser] = useState(null);
  useEffect(() => {
    // 배경 이미지를 담는 배열 리스트
    const backgrounds = [
      // "/images/background2.jpg",
      // "/images/background3.jpg",
      // "/images/background4.jpg",
      // "/images/background5.jpg",
      "./images/bg1.png",
      "./images/bg2.png",
      "./images/bg3.png",
      "./images/bg4.png",
      "./images/bg5.png",
      "./images/bg6.png",
      "./images/bg7.jpeg",
      "./images/bg8.jpg",
      "./images/bg9.jpg",
    ];
    const random = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackgroundStyle({
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${random})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    });
  }, []);

  return (
    <ResolutionGuard>
      <LikeProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<LandingPage backgroundStyle={backgroundStyle} />}
              />
              <Route
                path="/prompt"
                element={<PromptPage backgroundStyle={backgroundStyle} />}
              />
              <Route
                path="/write"
                element={<WritingPage backgroundStyle={backgroundStyle} />}
              />
              <Route
                path="/complete"
                element={<CompletePage backgroundStyle={backgroundStyle} />}
              />
              <Route
                path="/prompt-articles"
                element={
                  <PromptArticlesPage backgroundStyle={backgroundStyle} />
                }
              />
              <Route path="/main" element={<MainPage />} />
              <Route path="/copy-main" element={<CopyMainPage />} />
              {/* <Route path="/copy/start/:id" element={<TranscriptionPage />} />{" "} */}
              <Route path="/copy/start/:id" element={<TranscriptionPage />} />
              <Route
                path="/copy/start/custom"
                element={<TranscriptionPage />}
              />
              <Route path="/directadd" element={<DirectAddPage />} />
              <Route
                path="/transcription-complete"
                element={<TranscriptionCompletePage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/transcription-bookmark"
                element={<TranscriptionBookmark />}
              />
              <Route
                path="/transcription-detail/:id"
                element={<TranscriptionDetail />}
              />
              <Route path="/writing-bookmark" element={<WritingBookmark />} />
              <Route
                path="/writingbookmark/:id"
                element={<BookmarkDetailPage />}
              />
              <Route path="/allpost" element={<AllPostsPage />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </LikeProvider>
    </ResolutionGuard>
  );
}

export default App;
