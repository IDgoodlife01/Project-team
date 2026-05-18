import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  background: ${(props) => (props.active ? "#ff6b35" : "white")};
  color: ${(props) => (props.active ? "white" : "#666")};
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "500")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  &:hover {
    background: ${(props) => (props.active ? "#ff6b35" : "#f9f9f9")};
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
  margin-bottom: 10px;
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
  color: #ff6b35;
  background: #fff3ef;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
`;
const Region = styled.span`
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

const PetsitterList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // 1. 검색어 상태 추가
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/pet-sitter",
        );
        setPosts(response.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchPosts();
  }, []);

  // 2. 동네(지역명), 제목, 내용 필터링 로직 추가
  const filteredPosts = posts.filter((post) => {
    const regionMatch = post.region
      ? post.region.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const titleMatch = post.title
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const contentMatch = post.content
      ? post.content.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return regionMatch || titleMatch || contentMatch;
  });

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton onClick={() => navigate("/boards")}>전체</MenuButton>
        <MenuButton onClick={() => navigate("/posts")}>자유게시판</MenuButton>
        <MenuButton onClick={() => navigate("/reviews")}>리뷰</MenuButton>
        <MenuButton active>펫시터 찾기</MenuButton>
        <MenuButton
          onClick={() => navigate("/write-petsitter")}
          style={{
            background: "#ff6b35",
            color: "white",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          🖊️ 구인 글쓰기
        </MenuButton>
      </Sidebar>

      <MainContent>
        {/* 3. SearchBar 바인딩 */}
        <SearchBar
          placeholder="동네 이름을 검색해보세요 (예: 강남구, 천안...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <WideCard
              key={post.postId}
              onClick={() =>
                navigate(`/petsitters/${post.postId}`, { state: { post } })
              }
            >
              <TextContent>
                <CardHeader>
                  <Tag>펫시터 구인</Tag>
                  <Region>📍 {post.region}</Region>
                </CardHeader>
                <Title>{post.title}</Title>
                <Summary>
                  {post.content
                    ? post.content
                        .replace(/<[^>]*>?/gm, "")
                        .replace(/&nbsp;/g, " ")
                    : ""}
                </Summary>
                <div style={{ fontSize: "0.85rem", color: "#999" }}>
                  {post.nickname} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </TextContent>
            </WideCard>
          ))
        )}
      </MainContent>
    </Container>
  );
};

export default PetsitterList;
