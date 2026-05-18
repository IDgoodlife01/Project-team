import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // 스타일 컴포넌트 추가

// --- 별점용 스타일 (ReviewList와 동일하게 맞춤) ---
const StarContainer = styled.div`
  display: flex;
  color: #ffb800;
  font-size: 1.2rem;
  letter-spacing: -2px;
`;

const Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const review = location.state?.review;

  if (!review) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <p>리뷰 정보를 불러올 수 없습니다.</p>
        <button onClick={() => navigate('/reviews')}>목록으로 돌아가기</button>
      </div>
    );
  }

  // ⭐ 0.5점 단위 별점 렌더링 로직 (수정됨)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i}>★</span>); // 채워진 별
      } else if (i === fullStars + 1 && hasHalfStar) {
        // 반 별 표현 (CSS 이용)
        stars.push(
          <span key={i} style={{ position: 'relative', display: 'inline-block', width: '1em', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', color: '#eee' }}>★</span>
            <span style={{ position: 'absolute', width: '50%', overflow: 'hidden' }}>★</span>
          </span>
        );
      } else {
        stars.push(<span key={i} style={{ color: '#eee' }}>★</span>); // 빈 별
      }
    }
    return stars;
  };

  return (
    <div className="review-detail-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Pretendard, sans-serif' }}>
      {/* 이미지 섹션 */}
      <div style={{ width: '100%', height: '450px', marginBottom: '30px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <img
          src={(review.imageUrls && review.imageUrls.length > 0) ? review.imageUrls[0] : 'https://via.placeholder.com/800x450?text=No+Image'}
          alt="카페 리뷰 사진"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* 헤더 섹션 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ color: '#ff6b35', fontWeight: 'bold', background: '#fff3ef', padding: '4px 12px', borderRadius: '8px' }}>
            @{review.cafeName || '정보 없음'}
          </span>
          <StarContainer>{renderStars(review.rating)}</StarContainer>
          <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>{review.rating?.toFixed(1)}</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 20px 0', color: '#222' }}>{review.title}</h2>
      </div>

      {/* 작성자 및 날짜 정보 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '30px', color: '#888' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span>👤 {review.nickname}</span>
          <span>📅 {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '날짜 정보 없음'}</span>
        </div>
        <div>👁️ 조회수 {review.viewCount || 0}</div>
      </div>

      {/* 본문 내용 */}
      <div
        style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', minHeight: '200px' }}
        dangerouslySetInnerHTML={{ __html: review.content }} // HTML 태그(ReactQuill 내용) 반영
      />

      <button
        onClick={() => navigate('/reviews')}
        style={{ marginTop: '50px', padding: '12px 30px', background: '#f5f5f5', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#666' }}
      >
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default Review;