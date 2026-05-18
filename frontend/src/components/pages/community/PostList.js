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
  background: ${(props) => (props.$active ? "#ff6b35" : "white")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "500")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  &:hover {
    background: ${(props) => (props.$active ? "#ff6b35" : "#f9f9f9")};
    transform: translateX(5px);
  }
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const WideCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  }
`;

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8111/api/board/posts")
      .then((res) => setPosts(res.data));
  }, []);

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton onClick={() => navigate("/boards")}>전체</MenuButton>
        <MenuButton $active={true}>자유게시판</MenuButton>
        <MenuButton onClick={() => navigate("/reviews")}>리뷰</MenuButton>
        <MenuButton onClick={() => navigate("/petsitters")}>
          펫시터 찾기
        </MenuButton>
        <MenuButton
          onClick={() => navigate("/posts/write")}
          style={{
            background: "#ff6b35",
            color: "white",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          🖊️ 글쓰기
        </MenuButton>
      </Sidebar>

      <MainContent>
        {posts.map((post) => (
          <WideCard
            key={post.postId}
            onClick={() =>
              navigate(`/posts/${post.postId}`, { state: { post } })
            }
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{post.title}</h3>
            <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: "1.5" }}>
              {post.content
                ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 100)
                : ""}
              ...
            </p>
            <div
              style={{ fontSize: "0.8rem", color: "#999", marginTop: "10px" }}
            >
              {post.nickname} · {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </WideCard>
        ))}
      </MainContent>
    </Container>
  );
};

export default PostList;
