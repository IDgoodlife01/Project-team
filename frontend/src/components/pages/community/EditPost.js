import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ChevronLeft } from "lucide-react";

// --- 스타일 컴포넌트 생략 (기존과 동일) ---
const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: "Pretendard", sans-serif;
`;
const WriteContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;
const Label = styled.label`
  display: block;
  font-weight: 700;
  margin: 25px 0 10px;
  font-size: 0.95rem;
  color: #333;
`;
const InputField = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #fcfcfc;
  box-sizing: border-box;
  font-size: 1.1rem;
  outline: none;
  &:focus {
    border-color: #ff6b35;
    background: white;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 50px;
`;
const ActionButton = styled.button`
  flex: ${(props) => (props.primary ? "2" : "1")};
  padding: 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: ${(props) => (props.primary ? "none" : "1px solid #eee")};
  background: ${(props) => (props.primary ? "#ff6b35" : "#fff")};
  color: ${(props) => (props.primary ? "white" : "#666")};
  &:hover {
    background: ${(props) => (props.primary ? "#e55a2b" : "#f5f5f5")};
    transform: translateY(-2px);
  }
`;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState(location.state?.post?.title || "");
  const [content, setContent] = useState(location.state?.post?.content || "");

  const user = JSON.parse(localStorage.getItem("petapp_user") || "null");
  const token = user?.token || null;

  useEffect(() => {
    // 상세 정보 로드 (주소가 /api/posts/${id} 일 수 있으므로 확인 필요)
    if (!location.state?.post) {
      const fetchPost = async () => {
        try {
          // 💡 상세 조회가 안될 경우 이 주소를 /api/posts/${id} 로 바꿔보세요.
          const response = await axios.get(
            `http://localhost:8111/api/board/${id}`,
          );
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
          navigate("/posts");
        }
      };
      fetchPost();
    }
  }, [id, location.state, navigate]);

  const handleUpdate = async () => {
    const pureContent = content.replace(/<[^>]*>?/gm, "").trim();
    if (!title.trim() || !pureContent) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // ✅ [핵심 수정] 백엔드 TestController의 @PutMapping("/modify/{id}") 주소와 일치시킴
      const updateUrl = `http://localhost:8111/api/modify/${id}`;

      console.log("수정 요청 주소:", updateUrl);

      const response = await axios.put(
        updateUrl,
        {
          title: title.trim(),
          content: content,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 백엔드 응답이 성공(200)이거나 데이터가 반환되었을 때
      if (response.status === 200 || response.data) {
        alert("성공적으로 수정되었습니다! ✨");
        navigate(`/posts/${id}`);
      }
    } catch (error) {
      console.error("수정 에러 상세:", error.response);
      if (error.response?.status === 404) {
        alert("수정 API 주소를 찾을 수 없습니다. (백엔드 컨트롤러 확인 필요)");
      } else {
        alert("수정 권한이 없거나 서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <PageWrapper>
      <WriteContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "30px",
          }}
        >
          <ChevronLeft
            style={{ cursor: "pointer", color: "#333" }}
            onClick={() => navigate(-1)}
          />
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "900" }}>
            게시글 수정하기
          </h2>
        </div>

        <Label>제목</Label>
        <InputField
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label>내용</Label>
        <div
          style={{
            background: "#fcfcfc",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            style={{ height: "400px" }}
            placeholder="내용을 수정해주세요."
          />
        </div>
        <div style={{ height: "50px" }}></div>

        <ButtonGroup>
          <ActionButton onClick={() => navigate(-1)}>취소</ActionButton>
          <ActionButton primary onClick={handleUpdate}>
            수정 완료
          </ActionButton>
        </ButtonGroup>
      </WriteContainer>
    </PageWrapper>
  );
};

export default EditPost;
