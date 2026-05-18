import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../AxiosApi";
import "../../styles/pages/MyPage.css";

const MyPage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({ posts: [], reviews: [] });
  const [wishlist, setWishlist] = useState([]);

  const [profileForm, setProfileForm] = useState({
    nickname: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const nickname = localStorage.getItem("nickname") || "";
      const email = localStorage.getItem("email") || "";
      const phone = localStorage.getItem("phone") || "";

      if (!userId || !token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      setProfileForm({ nickname, email, phone });

      try {
        const [myPosts, myReviews, myWishlist] = await Promise.all([
          api.my.getPosts(userId),
          api.my.getReviews(userId),
          api.favorites.getByUser(userId),
        ]);
        setActivityData({ posts: myPosts, reviews: myReviews });
        setWishlist(
          Array.isArray(myWishlist) ? myWishlist.map((f) => f.cafe ?? f) : [],
        );
      } catch (error) {
        console.error("활동 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleProfileUpdate = async () => {
    if (!window.confirm("정보를 수정하시겠습니까?")) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8111/api/modify/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: profileForm.nickname,
          phone: profileForm.phone,
          username: profileForm.email,
        }),
      });

      if (res.ok) {
        alert("정보가 성공적으로 수정되었습니다!");
        localStorage.setItem("nickname", profileForm.nickname);
        if (profileForm.phone) localStorage.setItem("phone", profileForm.phone);
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("회원 수정에 실패했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const stripHtml = (html) =>
    html ? html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ") : "";

  const renderProfile = () => (
    <div className="content-section">
      <div className="info-card">
        <h3>집사 정보</h3>
        <div className="input-group-row">
          <div className="input-item full">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={profileForm.nickname}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item full">
            <label>이메일 (수정불가)</label>
            <input
              type="text"
              value={profileForm.email}
              readOnly
              style={{ background: "#f5f5f5" }}
            />
          </div>
        </div>
        <div className="input-group-row">
          <div className="input-item full">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              value={profileForm.phone}
              onChange={handleInputChange}
              placeholder="010-0000-0000"
            />
          </div>
        </div>
      </div>

      <div className="info-card mt-30">
        <h3>강아지 정보</h3>
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          강아지 정보를 등록해주세요!
        </p>
      </div>

      <button className="save-btn" onClick={handleProfileUpdate}>
        수정내용 저장하기
      </button>
    </div>
  );

  const renderPosts = () => (
    <div className="content-section">
      <div className="section-title-row">
        <h3>내가 쓴 게시글 ({activityData.posts.length})</h3>
      </div>
      {activityData.posts.length > 0 ? (
        <div className="activity-list">
          {activityData.posts.map((post) => (
            <div
              className="activity-card"
              key={post.postId || post.id}
              onClick={() => navigate(`/posts/${post.postId || post.id}`)}
            >
              <div className="activity-card-main">
                <span className="activity-badge">게시글</span>
                <h4>{post.title}</h4>
                <p>{stripHtml(post.content)}</p>
                <div className="activity-meta">
                  <span>
                    🗓 {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                  {post.viewCount !== undefined && (
                    <span>👁 {post.viewCount}</span>
                  )}
                </div>
              </div>
              <button
                className="detail-btn small-detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/posts/${post.postId || post.id}`);
                }}
              >
                보기
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <i className="ri-file-list-line"></i>
          <p>작성한 게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="content-section">
      <div className="section-title-row">
        <h3>내가 작성한 리뷰 ({activityData.reviews.length})</h3>
      </div>
      {activityData.reviews.length > 0 ? (
        <div className="activity-list">
          {activityData.reviews.map((rev) => (
            <div
              className="activity-card"
              key={rev.reviewId || rev.id}
              onClick={() => navigate(`/reviews/${rev.reviewId || rev.id}`)}
            >
              <div className="activity-card-main">
                <span className="activity-badge review-badge">리뷰</span>
                <h4>{rev.title || rev.cafeName || "카페 리뷰"}</h4>
                <p>{stripHtml(rev.content)}</p>
                <div className="activity-meta">
                  <span>☕ {rev.cafeName}</span>
                  <span>⭐ {rev.rating}</span>
                  {rev.createdAt && (
                    <span>
                      🗓 {new Date(rev.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="detail-btn small-detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/reviews/${rev.reviewId || rev.id}`);
                }}
              >
                보기
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <i className="ri-star-line"></i>
          <p>작성한 리뷰가 없습니다.</p>
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="content-section">
      <h3>찜목록 ({wishlist.length})</h3>
      {wishlist.length > 0 ? (
        <div className="activity-list">
          {wishlist.map((cafe) => (
            <div
              className="activity-card"
              key={cafe.cafeId ?? cafe.id}
              onClick={() => navigate(`/cafe/${cafe.cafeId ?? cafe.id}`)}
            >
              <div className="activity-card-main">
                <span className="activity-badge">카페</span>
                <h4>{cafe.cafeName ?? cafe.name ?? cafe.title}</h4>
                <p>{cafe.address ?? ""}</p>
              </div>
              <button
                className="detail-btn small-detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/cafe/${cafe.cafeId ?? cafe.id}`);
                }}
              >
                보기
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <i className="ri-heart-line"></i>
          <p>하트를 누른 카페가 없습니다.</p>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="status-msg">로딩 중... 🐾</div>;

  return (
    <div className="mypage-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              color: "white",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              margin: "0 auto 15px",
              fontWeight: "bold",
            }}
          >
            {profileForm.nickname?.charAt(0) || "?"}
          </div>
          <h2 style={{ textAlign: "center", fontSize: "18px" }}>
            {profileForm.nickname}님
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              opacity: 0.8,
              marginTop: "4px",
            }}
          >
            {profileForm.email}
          </p>
        </div>

        <ul className="menu-list">
          <li
            className={activeMenu === "profile" ? "active" : ""}
            onClick={() => setActiveMenu("profile")}
          >
            <i className="ri-user-line"></i> 내 정보
          </li>
          <li
            className={activeMenu === "wish" ? "active" : ""}
            onClick={() => setActiveMenu("wish")}
          >
            <i className="ri-heart-line"></i> 찜목록
          </li>
          <li
            className={activeMenu === "posts" ? "active" : ""}
            onClick={() => setActiveMenu("posts")}
          >
            <i className="ri-file-list-line"></i> 내 게시물
          </li>
          <li
            className={activeMenu === "reviews" ? "active" : ""}
            onClick={() => setActiveMenu("reviews")}
          >
            <i className="ri-star-line"></i> 리뷰
          </li>
        </ul>
      </div>

      <div className="main-content">
        {activeMenu === "profile" && renderProfile()}
        {activeMenu === "wish" && renderWishlist()}
        {activeMenu === "posts" && renderPosts()}
        {activeMenu === "reviews" && renderReviews()}
      </div>
    </div>
  );
};

export default MyPage;
