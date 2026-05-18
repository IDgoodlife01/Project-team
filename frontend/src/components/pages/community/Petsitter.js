import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// --- 스타일 컴포넌트 ---
const DetailContainer = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: "Pretendard", sans-serif;
`;

const AdminButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #f5f5f5;
  }
  &.delete {
    color: #ff4d4d;
    border-color: #ff4d4d;
  }
`;

// --- 댓글 관련 스타일 컴포넌트 추가 ---
const CommentSection = styled.div`
  margin-top: 40px;
  border-top: 2px solid #f0f0f0;
  padding-top: 30px;
`;
const CommentInputArea = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;
const CommentInput = styled.textarea`
  flex: 1;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  resize: none;
  height: 80px;
`;
const CommentSubmitBtn = styled.button`
  padding: 0 25px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
`;
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const CommentItem = styled.div`
  padding-bottom: 15px;
  border-bottom: 1px solid #f9f9f9;
`;
const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Petsitter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(location.state?.post || null);

  // 댓글 관련 상태 추가
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const currentUserId = Number(localStorage.getItem("userId"));
  const nickname = localStorage.getItem("nickname");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 게시글 상세 정보 로드
        if (!post) {
          const response = await axios.get(
            `http://localhost:8111/api/pet-sitter/${id}`,
          );
          setPost(response.data);
        }
        // 2. 펫시터 댓글 목록 로드 (백엔드 경로: /api/pet-sitter/{id}/comments)
        const commentRes = await axios.get(
          `http://localhost:8111/api/pet-sitter/${id}/comments`,
        );
        setComments(commentRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchData();
  }, [id, post]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8111/api/pet-sitter/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("삭제되었습니다.");
      navigate("/petsitters");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 권한이 없거나 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-petsitter/${id}`, { state: { post } });
  };

  // --- 댓글 등록 핸들러 추가 ---
  const handleCommentSubmit = async () => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    const formattedToken = rawToken.startsWith("Bearer ")
      ? rawToken
      : `Bearer ${rawToken}`;

    if (!newComment.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      // PetSitterCommentController 규격에 맞춘 body 설계 (postId는 URL 패스로 들어가므로 생략 가능하나 안정성을 위해 유지 가능)
      const commentData = {
        userId: parseInt(currentUserId, 10),
        content: newComment.trim(),
      };

      // 백엔드 요청: POST /api/pet-sitter/{id}/comments
      const response = await axios.post(
        `http://localhost:8111/api/pet-sitter/${id}/comments`,
        commentData,
        {
          headers: {
            Authorization: formattedToken,
            "Content-Type": "application/json",
          },
        },
      );

      // 백엔드가 성공 시 String("댓글 작성 성공")을 반환하므로, 프론트 상태를 수동 갱신하거나 새로고침
      if (response.status === 200) {
        alert("댓글이 등록되었습니다.");
        // 가장 정확한 최신 목록을 반영하기 위해 서버에서 댓글 다시 불러오기
        const commentRes = await axios.get(
          `http://localhost:8111/api/pet-sitter/${id}/comments`,
        );
        setComments(commentRes.data);
        setNewComment("");
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      if (error.response?.status === 403) {
        alert("댓글 작성 권한이 없습니다.");
      } else {
        alert("댓글 등록 중 오류가 발생했습니다.");
      }
    }
  };

  // --- 댓글 삭제 핸들러 추가 ---
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const rawToken = localStorage.getItem("token");
      const formattedToken = rawToken.startsWith("Bearer ")
        ? rawToken
        : `Bearer ${rawToken}`;

      // 백엔드 경로: DELETE /api/pet-sitter/{postId}/comments/{commentId}
      await axios.delete(
        `http://localhost:8111/api/pet-sitter/${id}/comments/${commentId}`,
        {
          headers: { Authorization: formattedToken },
        },
      );

      alert("댓글이 삭제되었습니다.");
      // 프론트 UI 상태 업데이트
      setComments((prev) =>
        prev.filter((comment) => comment.commentId !== commentId),
      );
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      if (error.response?.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (!post)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>로딩 중...</div>
    );

  return (
    <DetailContainer>
      {currentUserId === post.userId && (
        <AdminButtonGroup>
          <ActionButton onClick={handleEdit}>수정</ActionButton>
          <ActionButton className="delete" onClick={handleDelete}>
            삭제
          </ActionButton>
        </AdminButtonGroup>
      )}

      <div style={{ marginBottom: "25px" }}>
        <span
          style={{
            color: "#ff6b35",
            background: "#fff3ef",
            padding: "6px 15px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📍 {post.region}
        </span>
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "800",
            marginTop: "15px",
            color: "#222",
          }}
        >
          {post.title}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "20px",
          marginBottom: "30px",
          color: "#888",
        }}
      >
        <div>👤 {post.nickname}</div>
        <div>
          📅{" "}
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "날짜 정보 없음"}
        </div>
      </div>

      <div
        style={{
          fontSize: "1.1rem",
          lineHeight: "1.8",
          color: "#444",
          minHeight: "300px",
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* --- 댓글 UI 레이아웃 추가 --- */}
      <CommentSection>
        <h3>댓글 {comments.length}</h3>
        <CommentInputArea>
          <CommentInput
            placeholder="따뜻한 댓글을 남겨주세요!"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <CommentSubmitBtn onClick={handleCommentSubmit}>
            등록
          </CommentSubmitBtn>
        </CommentInputArea>

        <CommentList>
          {comments.map((comment) => (
            <CommentItem key={comment.commentId}>
              <CommentHeader>
                <div>
                  <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                    {comment.nickname}
                  </span>
                  <span style={{ color: "#999" }}>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                {/* 본인 댓글인 경우에만 삭제 버튼 노출 */}
                {currentUserId === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ff4d4d",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    삭제
                  </button>
                )}
              </CommentHeader>
              <div style={{ color: "#444" }}>{comment.content}</div>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>

      <button
        onClick={() => navigate("/petsitters")}
        style={{
          marginTop: "50px",
          padding: "12px 30px",
          background: "#f5f5f5",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        목록으로 돌아가기
      </button>
    </DetailContainer>
  );
};

export default Petsitter;
