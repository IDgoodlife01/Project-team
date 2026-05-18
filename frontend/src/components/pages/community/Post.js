import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../../AxiosApi";
import { MessageCircle, User, Trash2, Edit } from "lucide-react";

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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #eee;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: #f9f9f9;
    border-color: #ccc;
  }
  &.delete {
    color: #ff4d4d;
    &:hover {
      background: #fff5f5;
      border-color: #ff4d4d;
    }
  }
`;
const CommentSection = styled.div`
  margin-top: 50px;
  border-top: 1px solid #f0f0f0;
  padding-top: 30px;
`;
const CommentInputArea = styled.div`
  position: relative;
  margin-bottom: 30px;
`;
const CommentInput = styled.textarea`
  width: 100%;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 15px;
  background: #fafafa;
  resize: none;
  height: 100px;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: #ff6b35;
    background: white;
  }
`;
const CommentSubmitBtn = styled.button`
  position: absolute;
  right: 15px;
  bottom: 15px;
  padding: 8px 20px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
`;
const CommentItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #f9f9f9;
`;

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const nickname = localStorage.getItem("nickname") || "익명";

  // 게시글 로드
  useEffect(() => {
    const fetchPost = async () => {
      if (!post) {
        try {
          const data = await api.posts.getById(id);
          // getById는 { post, ... } 형태로 올 수 있으므로 처리
          setPost(data?.post ?? data);
        } catch (e) {
          console.error("게시글 로드 실패:", e);
        }
      }
    };
    fetchPost();
  }, [id]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await api.posts.delete(id);
      alert("삭제되었습니다.");
      navigate("/posts");
    } catch {
      alert("삭제 실패: 권한이 없거나 오류가 발생했습니다.");
    }
  };

  // 댓글 등록 (백엔드 댓글 API 미구현 → 프론트 상태로 관리)
  const handleCommentSubmit = () => {
    // ✅ 로그인 체크: token이 있으면 로그인된 상태
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    const newCommentObj = {
      commentId: Date.now(), // 임시 고유 ID
      userId: parseInt(currentUserId, 10),
      nickname: nickname,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
  };

  // 댓글 삭제
  const handleDeleteComment = (cid) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    setComments((prev) => prev.filter((c) => (c.commentId || c.id) !== cid));
  };

  // 엔터키로 댓글 등록 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  if (!post)
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        데이터를 찾는 중... 🐾
      </div>
    );

  return (
    <DetailContainer>
      {/* 작성자 본인만 수정/삭제 버튼 노출 */}
      {Number(currentUserId) === Number(post.userId) && (
        <AdminButtonGroup>
          <ActionButton
            onClick={() => navigate(`/posts/${id}/edit`, { state: { post } })}
          >
            <Edit size={16} /> 수정
          </ActionButton>
          <ActionButton className="delete" onClick={handleDeletePost}>
            <Trash2 size={16} /> 삭제
          </ActionButton>
        </AdminButtonGroup>
      )}

      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#888",
            marginBottom: "15px",
          }}
        >
          ← 뒤로가기
        </button>
        <h2
          style={{
            fontSize: "2.4rem",
            fontWeight: "900",
            color: "#111",
            margin: "0 0 20px 0",
          }}
        >
          {post.title}
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingBottom: "25px",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              background: "#ff6b35",
              color: "white",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={24} />
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>
              {post.nickname}
            </div>
            <div style={{ color: "#bbb", fontSize: "0.85rem" }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: "1.15rem",
          lineHeight: "1.9",
          color: "#333",
          minHeight: "350px",
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentSection>
        <h3>
          <MessageCircle
            size={20}
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          댓글 {comments.length}
        </h3>

        <CommentInputArea>
          <CommentInput
            placeholder={
              token
                ? "따뜻한 댓글을 남겨주세요! (Enter로 등록)"
                : "로그인 후 댓글을 작성할 수 있습니다."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!token}
            style={!token ? { cursor: "not-allowed", opacity: 0.6 } : {}}
          />
          <CommentSubmitBtn
            onClick={handleCommentSubmit}
            disabled={!token}
            style={!token ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            등록
          </CommentSubmitBtn>
        </CommentInputArea>

        <div>
          {comments.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#ccc",
                padding: "30px 0",
                fontSize: "0.95rem",
              }}
            >
              첫 번째 댓글을 남겨보세요! 🐾
            </div>
          )}
          {comments.map((comment) => (
            <CommentItem key={comment.commentId || comment.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div style={{ fontWeight: "800" }}>
                  {comment.nickname}
                  <span
                    style={{
                      fontWeight: "400",
                      color: "#ccc",
                      marginLeft: "10px",
                    }}
                  >
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {Number(currentUserId) === Number(comment.userId) && (
                  <button
                    onClick={() =>
                      handleDeleteComment(comment.commentId || comment.id)
                    }
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ff8a8a",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div style={{ color: "#555", lineHeight: "1.5" }}>
                {comment.content}
              </div>
            </CommentItem>
          ))}
        </div>
      </CommentSection>

      <button
        onClick={() => navigate("/posts")}
        style={{
          marginTop: "60px",
          width: "100%",
          padding: "18px",
          background: "#f5f5f5",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontWeight: "800",
          color: "#888",
        }}
      >
        목록으로 돌아가기
      </button>
    </DetailContainer>
  );
};

export default Post;
