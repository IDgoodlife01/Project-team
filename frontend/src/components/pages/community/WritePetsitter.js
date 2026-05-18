import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// --- 스타일 컴포넌트 ---
const WriteContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-family: "Pretendard", sans-serif;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 20px 0 10px;
  font-size: 0.95rem;
  span {
    color: #ff6b35;
    margin-left: 4px;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #f9f9f9;
  box-sizing: border-box;
  font-size: 1rem;
  &:focus {
    outline: 2px solid #ff6b35;
    background: white;
  }
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
  transition: background 0.3s;
  &:hover {
    background: #e55a2b;
  }
`;

const WritePetsitter = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [region, setRegion] = useState("");

  // 1. 페이지 진입 시 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // 저장된 실제 유저 ID 가져오기

    // 유효성 검사
    const pureContent = content.replace(/<[^>]*>?/gm, "").trim();
    if (!title.trim() || !pureContent || !region.trim()) {
      alert("지역, 제목, 내용은 필수 입력 항목입니다!");
      return;
    }

    // 2. 고정값 1 대신 실제 userId 사용하도록 데이터 구성
    const postData = {
      title: title,
      content: content,
      region: region,
      userId: Number(userId), // 숫자로 변환
      imageUrls: [],
    };

    try {
      // 3. Authorization 헤더에 토큰 포함하여 전송
      const response = await axios.post(
        "http://localhost:8111/api/pet-sitter",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 토큰 인증 추가
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        alert("성공적으로 등록되었습니다!");
        navigate("/petsitters");
      }
    } catch (error) {
      console.error("등록 에러:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("권한이 없습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("등록에 실패했습니다.");
      }
    }
  };

  return (
    <WriteContainer>
      <h2
        style={{
          marginBottom: "30px",
          borderBottom: "2px solid #ff6b35",
          paddingBottom: "10px",
          display: "inline-block",
        }}
      >
        펫시터 구인 등록
      </h2>

      <Label>
        희망 지역 <span>*</span>
      </Label>
      <InputField
        placeholder="예: 서울시 강남구, 천안시 서북구 등"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />

      <Label>
        제목 <span>*</span>
      </Label>
      <InputField
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Label>
        상세 내용 <span>*</span>
      </Label>
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: "350px", marginBottom: "50px" }}
          placeholder="상세 내용을 입력하세요."
        />
      </div>

      <SubmitButton onClick={handleRegister}>등록하기</SubmitButton>
    </WriteContainer>
  );
};

export default WritePetsitter;
