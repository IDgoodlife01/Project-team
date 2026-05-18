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
  &:hover { background: #e55a2b; }
`;

const EditPetsitter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState(location.state?.post?.title || '');
  const [content, setContent] = useState(location.state?.post?.content || '');
  const [region, setRegion] = useState(location.state?.post?.region || '');

  // WritePetsitter와 동일한 방식
  const user = JSON.parse(localStorage.getItem("petapp_user") || "null");
  const token = user?.token || null;

  useEffect(() => {
    if (location.state?.post) return;
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8111/api/pet-sitter/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setRegion(response.data.region);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        navigate('/petsitters');
      }
    };
    fetchPost();
  }, [id]); // location.state, navigate 제거 - 렌더링마다 재실행 방지

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim() || !region.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8111/api/pet-sitter/${id}`,
        { title, content, region },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("수정되었습니다!");
        const updatedPost = {
          ...(location.state?.post || {}),
          title,
          content,
          region
        };
        navigate(`/petsitters/${id}`, { state: { post: updatedPost } });
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert("수정 권한이 없거나 오류가 발생했습니다.");
    }
  };

  return (
    <WriteContainer>
      <h2 style={{ borderBottom: '2px solid #ff6b35', paddingBottom: '10px' }}>게시글 수정</h2>

      <Label>희망 지역</Label>
      <InputField value={region} onChange={(e) => setRegion(e.target.value)} />

      <Label>제목</Label>
      <InputField value={title} onChange={(e) => setTitle(e.target.value)} />

      <Label>상세 내용</Label>
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

export default EditPetsitter;
