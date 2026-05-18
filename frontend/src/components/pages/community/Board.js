import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../../../AxiosApi";

// ── 레이아웃 ──────────────────────────────────────────────
const Container = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 40px auto;
  gap: 30px;
  font-family: "Pretendard", sans-serif;
  padding: 0 20px;
`;
const Sidebar = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
`;
const CommunityCard = styled.div`
  background: linear-gradient(135deg, #ff4d00, #ff8a00);
  color: white;
  padding: 25px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(255, 77, 0, 0.2);
`;
const MenuButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: ${(props) =>
    props.$active ? (props.$isAll ? "#e11d48" : "#ff6b35") : "white"};
  color: ${(props) => (props.$active ? "white" : "#666")};
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "500")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  &:hover {
    background: ${(props) =>
      props.$active ? (props.$isAll ? "#e11d48" : "#ff6b35") : "#f9f9f9"};
    transform: translateX(5px);
  }
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const SearchBar = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #eee;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  outline: none;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus {
    border-color: #ff6b35;
  }
`;
const WideCard = styled.div`
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;
const TextContent = styled.div`
  flex: 1;
`;
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;
const Tag = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  ${(props) => props.$type === "post" && "color: #3b82f6; background: #eff6ff;"}
  ${(props) =>
    props.$type === "review" && "color: #ff6b35; background: #fff3ef;"}
  ${(props) =>
    props.$type === "sitter" && "color: #10b981; background: #ecfdf5;"}
`;
const SubInfo = styled.span`
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
`;
const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
`;
const Summary = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ── 컴포넌트 ──────────────────────────────────────────────
const Board = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [p, r, s] = await Promise.all([
          api.posts.getAll().catch(() => []),
          api.reviews.getAll().catch(() => []),
          api.sitters.getAll().catch(() => []),
        ]);
        const combined = [
          ...p.map((i) => ({ ...i, _type: "post", id: i.postId || i.id })),
          ...r.map((i) => ({ ...i, _type: "review", id: i.reviewId || i.id })),
          ...s.map((i) => ({ ...i, _type: "sitter", id: i.postId || i.id })),
        ].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        setAllData(combined);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stripHtml = (h) =>
    h ? h.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ") : "";

  // 타입별 경로 + state 포함
  const getDisplayInfo = (item) => {
    switch (item._type) {
      case "post":
        return {
          label: "자유게시판",
          path: `/posts/${item.id}`,
          // ✅ Post.jsx가 location.state.post 로 읽으므로 그대로 넘김
          state: { post: item },
          sub: "",
        };
      case "review":
        return {
          label: "리뷰",
          path: `/reviews/${item.id}`,
          state: { review: item },
          sub: item.cafeName || "",
        };
      case "sitter":
        return {
          label: "펫시터 구인",
          path: `/petsitters/${item.id}`,
          state: { post: item },
          sub: item.region ? `📍 ${item.region}` : "",
        };
      default:
        return { label: "게시판", path: "#", state: {}, sub: "" };
    }
  };

  const filteredData = allData.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.content && item.content.toLowerCase().includes(q))
    );
  });

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton $active $isAll onClick={() => navigate("/boards")}>
          전체
        </MenuButton>
        <MenuButton onClick={() => navigate("/posts")}>자유게시판</MenuButton>
        <MenuButton onClick={() => navigate("/reviews")}>리뷰</MenuButton>
        <MenuButton onClick={() => navigate("/petsitters")}>
          펫시터 찾기
        </MenuButton>
      </Sidebar>

      <MainContent>
        <SearchBar
          placeholder="궁금한 내용을 검색해보세요!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            데이터를 로딩 중입니다...
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredData.map((item, idx) => {
            const info = getDisplayInfo(item);
            return (
              <WideCard
                key={`${item._type}-${item.id}-${idx}`}
                // ✅ state 포함해서 navigate → Post.jsx가 location.state.post 바로 사용
                onClick={() => navigate(info.path, { state: info.state })}
              >
                <TextContent>
                  <CardHeader>
                    <Tag $type={item._type}>{info.label}</Tag>
                    {info.sub && <SubInfo>{info.sub}</SubInfo>}
                  </CardHeader>
                  <Title>{item.title}</Title>
                  <Summary>
                    {stripHtml(item.content || item.description)}
                  </Summary>
                  <div style={{ fontSize: "0.85rem", color: "#999" }}>
                    {item.nickname} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </TextContent>
              </WideCard>
            );
          })
        )}
      </MainContent>
    </Container>
  );
};

export default Board;
