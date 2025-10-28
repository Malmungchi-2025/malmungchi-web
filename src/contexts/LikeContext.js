import { createContext, useContext, useState } from "react";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [updatedPosts, setUpdatedPosts] = useState({}); // id별 최신 likes/scraps 값

  const updatePostCounts = (id, data) => {
    setUpdatedPosts((prev) => ({ ...prev, [id]: data }));
  };

  return (
    <LikeContext.Provider value={{ updatedPosts, updatePostCounts }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikeContext = () => useContext(LikeContext);
