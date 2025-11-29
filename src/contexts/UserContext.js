// import { createContext } from "react";

// export const UserContext = createContext(null);
import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return; // 토큰이 없으면 로그인 안 된 상태 유지

    const fetchUser = async () => {
      console.log("ENV URL:", process.env.REACT_APP_SERVER_API_URL);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API_URL}/api/web-auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user); // ✅ 로그인 상태 복원
        } else {
          console.warn("토큰 유효하지 않음:", data.message);
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("서버 연결 오류:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
