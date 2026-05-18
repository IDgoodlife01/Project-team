import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const WriteContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 20px 0 10px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  box-sizing: border-box;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: white;
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 30px;
  padding: 15px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #e85a2a; }
`;

// WriteReview와 동일한 옵션 목록
const RATING_OPTIONS = [5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0];

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState(location.state?.review?.title || '');
  const [content, setContent] = useState(location.state?.review?.content || '');
  const [cafeName] = useState(location.state?.review?.cafeName || ''); // 수정 불가
  const [rating, setRating] = useState(
    location.state?.review?.rating?.toFixed(1) || '5.0'
  );

  // WriteReview와 동일한 방식
  const user = JSON.parse(localStorage.getItem("petapp_user") || "null");
  const token = user?.token || null;

  useEffect(() => {
    if (location.state?.review) return;
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:8111/api/reviews/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setRating(response.data.rating?.toFixed(1) || '5.0');
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("리뷰 정보를 불러올 수 없습니다.");
        navigate('/reviews');
      }
    };
    fetchReview();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    const reviewData = {
      reviewId: Number(id),
      userId: Number(user?.userId || user?.id),
      title,
      content,
      rating: parseFloat(rating),
      cafeId: location.state?.review?.cafeId
    };

    try {
      const response = await axios.put(
        `http://localhost:8111/api/reviews/${id}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert("리뷰가 성공적으로 수정되었습니다!");
        const updatedReview = {
          ...(location.state?.review || {}),
          ...reviewData
        };
        navigate(`/reviews/${id}`, { state: { review: updatedReview } });
      }
    } catch (error) {
      console.error("수정 에러 상세:", error.response?.data);
      if (error.response?.status === 403) {
        alert("본인이 작성한 글만 수정할 수 있습니다.");
      } else {
        alert("리뷰 수정에 실패했습니다.");
      }
    }
  };

  return (
    <WriteContainer>
      <h2 style={{ borderBottom: '2px solid #ff6b35', paddingBottom: '10px' }}>리뷰 수정</h2>

      <Label>방문한 카페</Label>
      <InputField
        value={cafeName}
        readOnly
        style={{ background: '#f5f5f5', color: '#888', cursor: 'not-allowed' }}
      />

      <Label>별점</Label>
      <SelectField value={rating} onChange={(e) => setRating(e.target.value)}>
        {RATING_OPTIONS.map((n) => (
          <option key={n} value={n.toFixed(1)}>
            {n.toFixed(1)}점
          </option>
        ))}
      </SelectField>

      <Label>제목</Label>
      <InputField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />

      <Label>상세 리뷰</Label>
      <div style={{ background: '#f9f9f9', marginBottom: '50px' }}>
        <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '350px' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '30%', marginTop: '30px', padding: '15px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          취소
        </button>
        <SubmitButton onClick={handleUpdate}>수정 완료</SubmitButton>
      </div>
    </WriteContainer>
  );
};

export default EditReview;
