import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 위 PetsitterList와 스타일 컴포넌트 구성을 동일하게 유지 (통일감)
const Container = styled.div` display: flex; max-width: 1200px; margin: 40px auto; gap: 30px; font-family: 'Pretendard', sans-serif; padding: 0 20px; `;
const Sidebar = styled.div` width: 220px; display: flex; flex-direction: column; gap: 10px; `;
const CommunityCard = styled.div` background: linear-gradient(135deg, #ff4d00, #ff8a00); color: white; padding: 25px; border-radius: 15px; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px; `;
const MenuButton = styled.button` width: 100%; padding: 14px; border: none; border-radius: 12px; background: ${props => props.active ? '#ff6b35' : 'white'}; color: ${props => props.active ? 'white' : '#666'}; text-align: left; cursor: pointer; font-weight: ${props => props.active ? 'bold' : '500'}; box-shadow: 0 2px 5px rgba(0,0,0,0.05); &:hover { background: #f9f9f9; } `;
const MainContent = styled.div` flex: 1; display: flex; flex-direction: column; gap: 25px; `;
const SearchBar = styled.input` width: 100%; padding: 15px 20px; border: 1px solid #eee; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); outline: none; font-size: 1rem; &:focus { border-color: #ff6b35; } `;

const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; `;
const Card = styled.div` background: white; border-radius: 15px; overflow: hidden; border: 1px solid #eee; transition: all 0.3s; cursor: pointer; &:hover { transform: translateY(-8px); box-shadow: 0 12px 20px rgba(0,0,0,0.08); } `;
const ImageBox = styled.div` width: 100%; height: 180px; background: #f5f5f5; img { width: 100%; height: 100%; object-fit: cover; } `;
const CardContent = styled.div` padding: 20px; `;
const CafeTag = styled.span` background: #f0f0f0; color: #666; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; display: inline-block; `;
const Rating = styled.span` float: right; color: #ff6b35; font-weight: bold; `;

const PostList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8111/api/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error("리뷰 로딩 실패:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Container>
      <Sidebar>
        <CommunityCard>커뮤니티</CommunityCard>
        <MenuButton onClick={() => navigate('/board/all')}>전체</MenuButton>
        <MenuButton active>자유게시판</MenuButton>
        <MenuButton onClick={() => navigate('/reviews')}>리뷰</MenuButton>
        <MenuButton onClick={() => navigate('/petsitters')}>펫시터 찾기</MenuButton>
        <MenuButton
          onClick={() => navigate('/Write-Post')}
          style={{background: '#ff6b35', color: 'white', marginTop: '20px', textAlign: 'center'}}
        >
          🖊️ 글쓰기
        </MenuButton>
      </Sidebar>

      <MainContent>
        <SearchBar placeholder="카페 이름이나 제목으로 검색..." />
        <Grid>
          {reviews.map((review) => (
            <Card key={review.reviewId} onClick={() => navigate(`/reviews/${review.reviewId}`)}>
              <ImageBox>
                <img src={review.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=Cafe+Review'} alt="thumb" />
              </ImageBox>
              <CardContent>
                <div>
                  <CafeTag>{review.cafeName}</CafeTag>
                  <Rating>★ {review.rating?.toFixed(1)}</Rating>
                </div>
                <h3 style={{margin: '0 0 10px 0', fontSize: '1.1rem', height: '2.8em', overflow: 'hidden'}}>{review.title}</h3>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#999'}}>
                  <span>{review.nickname}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
};

export default PostList;