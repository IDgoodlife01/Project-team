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
  gap: 25px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #eee;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #ff6b35;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
  }
`;

const ImageBox = styled.div`
  width: 100%;
  height: 180px;
  background: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Tag = styled.span`
  background: #fff3ef;
  color: #ff6b35;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  display: inline-block;
`;

const CardTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  line-height: 1.4;
  color: #222;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PetsitterList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8111/api/pet-sitter");
        setPosts(response.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton onClick={() => navigate("/board/all")}>전체</MenuButton>
        <MenuButton onClick={() => navigate("/posts")}>자유게시판</MenuButton>
        <MenuButton onClick={() => navigate("/reviews")}>리뷰</MenuButton>
        <MenuButton active>펫시터 찾기</MenuButton>

        <MenuButton
          onClick={() => navigate("/petsitters/write")}
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
        <SearchBar placeholder="동네 이름을 검색해보세요 (예: 강남구, 천안...)" />

        <Grid>
          {posts.map((post) => (
            <Card
              key={post.postId}
              onClick={() => navigate(`/petsitters/${post.postId}`)}
            >
              <ImageBox>
                <img
                  src={
                    post.imageUrls?.[0] ||
                    "https://via.placeholder.com/400x300?text=PetSitter"
                  }
                  alt="thumbnail"
                />
              </ImageBox>

              <CardContent>
                <Tag>📍 {post.region}</Tag>
                <CardTitle>{post.title}</CardTitle>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    color: "#888",
                    borderTop: "1px solid #f5f5f5",
                    paddingTop: "10px",
                  }}
                >
                  <span>{post.nickname}</span>
                  <span>조회 {post.viewCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
};

export default PetsitterList;