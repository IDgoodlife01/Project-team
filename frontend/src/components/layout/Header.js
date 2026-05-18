import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/layout/Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 추가

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedNickname = localStorage.getItem("nickname");
    if (token) {
      setIsLoggedIn(true);
      setNickname(savedNickname || "");
    } else {
      setIsLoggedIn(false);
      setNickname("");
    }
  }, [location.pathname]);

  // 페이지 이동 시 검색창 초기화
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setNickname("");
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/")}>
          꼬리살랑
        </div>

        <div className="header-search">
          <span>⌕</span>
          <input
            placeholder="어떤 반려견 카페를 찾고 있나요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="auth">
          {isLoggedIn ? (
            <>
              <span
                style={{
                  fontSize: "14px",
                  color: "#ff6f3d",
                  fontWeight: "600",
                  marginRight: "4px",
                }}
              >
                {nickname}님 환영합니다!
              </span>
              <button onClick={() => navigate("/mypage")}>마이페이지</button>
              <button className="signup-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>로그인</button>
              <button
                className="signup-btn"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
