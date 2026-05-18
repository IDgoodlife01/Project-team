import React from "react";
import { useNavigate } from "react-router-dom";

const Petsitter = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div
      className="petsitter-card"
      onClick={() => navigate(`/petsitters/${post.postId}`)}
      style={{
        border: "1px solid #eee",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        background: "white",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={
          post.imageUrls && post.imageUrls.length > 0
            ? post.imageUrls[0]
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt="펫시터 구인 사진"
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />

      <div style={{ padding: "15px" }}>
        <div
          style={{
            color: "#ff6b35",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          [{post.region}]
        </div>

        <h3 style={{ margin: "8px 0", fontSize: "1.1rem" }}>
          {post.title}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#666",
            fontSize: "0.9rem",
          }}
        >
          <span>{post.nickname}</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Petsitter;