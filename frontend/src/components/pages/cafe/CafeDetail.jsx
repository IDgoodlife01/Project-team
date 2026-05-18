import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Heart,
  Info,
  CheckCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import "./CafeDetail.css";

const BASE_URL = "http://localhost:8111";
const getToken = () => localStorage.getItem("token");
const getUserId = () => Number(localStorage.getItem("userId"));

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendCafes, setRecommendCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const fetchAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const userId = getUserId();
      const token = getToken();
      const requests = [
        axios.get(`${BASE_URL}/api/cafes/${id}`),
        axios.get(`${BASE_URL}/api/reviews/cafe/${id}`),
      ];

      if (userId && token) {
        requests.push(
          axios.get(`${BASE_URL}/api/favorites/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );
      }

      const [cafeRes, reviewRes, favoriteRes] = await Promise.all(requests);

      const rawData = cafeRes.data.cafe || cafeRes.data;
      if (!rawData || Object.keys(rawData).length === 0) {
        throw new Error("카페 데이터가 비어있습니다.");
      }

      const normalized = {
        ...rawData,
        cafeId: rawData.cafeId || rawData.id,
        title: rawData.cafeName || rawData.title || "이름 없는 카페",
        images:
          rawData.imageUrls && rawData.imageUrls.length > 0
            ? rawData.imageUrls
            : [
                rawData.image ||
                  rawData.cafeThumbnail ||
                  "https://via.placeholder.com/800x600?text=No+Image",
              ],
        facilityList: rawData.facilities
          ? (typeof rawData.facilities === "string"
              ? rawData.facilities.split(",")
              : rawData.facilities
            ).map((f) => f.trim())
          : rawData.allowedPetTypes
            ? rawData.allowedPetTypes.split(",").map((f) => f.trim())
            : [],
      };

      setCafe(normalized);
      setReviews(
        Array.isArray(reviewRes.data)
          ? reviewRes.data
          : reviewRes.data?.reviews || [],
      );

      if (favoriteRes) {
        const favorites = Array.isArray(favoriteRes.data)
          ? favoriteRes.data
          : [];
        setWished(favorites.some((f) => f.cafeId === normalized.cafeId));
      }

      if (normalized.regionId) {
        try {
          const relRes = await axios.get(`${BASE_URL}/api/cafes`, {
            params: { regionId: normalized.regionId },
          });
          const list = Array.isArray(relRes.data) ? relRes.data : [];
          setRecommendCafes(
            list
              .filter(
                (c) => String(c.cafeId || c.id) !== String(normalized.cafeId),
              )
              .slice(0, 4),
          );
        } catch {
          setRecommendCafes([]);
        }
      }
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
      setCafe(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
    window.scrollTo(0, 0);
    setMainImgIdx(0);
  }, [fetchAll]);

  // ✅ api.favorites.toggle 대신 axios 직접 호출
  const handleWishToggle = async () => {
    const userId = getUserId();
    const token = getToken();

    if (!userId || !token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (wishLoading) return; // 중복 클릭 방지
    setWishLoading(true);

    const currentCafeId = cafe.cafeId;

    try {
      if (wished) {
        // 찜 해제 → DELETE
        await axios.delete(
          `${BASE_URL}/api/favorites/${userId}/${currentCafeId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setWished(false);
      } else {
        // 찜 추가 → POST
        await axios.post(
          `${BASE_URL}/api/favorites`,
          { userId, cafeId: currentCafeId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setWished(true);
      }
    } catch (err) {
      console.error("찜하기 실패:", err);
      alert("즐겨찾기 처리 중 오류가 발생했습니다.");
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cd-status-msg">카페 정보를 불러오는 중입니다... 🐾</div>
    );
  }

  if (!cafe) {
    return (
      <div className="cd-status-msg">
        카페 정보를 찾을 수 없습니다. (ID: {id})
      </div>
    );
  }

  return (
    <div className="cd-container">
      {/* 갤러리 */}
      <section className="cd-gallery">
        <div className="cd-gallery-main">
          <img src={cafe.images[mainImgIdx]} alt={cafe.title} />
        </div>
        <div className="cd-gallery-sub">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className={`cd-gallery-item ${mainImgIdx === idx + 1 ? "active" : ""}`}
              onClick={() => cafe.images[idx + 1] && setMainImgIdx(idx + 1)}
              style={{ cursor: cafe.images[idx + 1] ? "pointer" : "default" }}
            >
              {cafe.images[idx + 1] ? (
                <img src={cafe.images[idx + 1]} alt={`Sub ${idx + 2}`} />
              ) : (
                <div className="cd-no-img">Side {idx + 2}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="cd-layout">
        <div className="cd-main-content">
          {/* 카페명 + 찜 버튼 */}
          <div className="cd-title-box">
            <h1 className="cd-name">{cafe.title}</h1>
            <button
              onClick={handleWishToggle}
              disabled={wishLoading}
              style={{
                background: "none",
                border: "none",
                cursor: wishLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                opacity: wishLoading ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <Heart
                size={28}
                fill={wished ? "#f97316" : "none"}
                color={wished ? "#f97316" : "#ccc"}
                style={{ transition: "all 0.2s" }}
              />
            </button>
          </div>

          <div className="cd-addr-row">
            <MapPin size={16} />
            <span>{cafe.address}</span>
            <span
              className="cd-map-link"
              onClick={() =>
                window.open(
                  cafe.naverMapUrl ||
                    `https://map.naver.com/v5/search/${encodeURIComponent(
                      cafe.address,
                    )}`,
                )
              }
            >
              지도보기 &gt;
            </span>
          </div>

          {/* 시설 정보 */}
          <section className="cd-section">
            <h3 className="cd-section-title">
              시설 정보 <Info size={16} color="#eee" />
            </h3>
            <div className="cd-facility-grid">
              {cafe.facilityList.length > 0 ? (
                cafe.facilityList.map((f, i) => (
                  <div className="cd-facility-item" key={i}>
                    <div className="cd-icon-box">
                      <CheckCircle size={22} color="#10b981" />
                    </div>
                    <span className="cd-facility-text">{f}</span>
                  </div>
                ))
              ) : (
                <div className="cd-empty-text">
                  등록된 시설 정보가 없습니다.
                </div>
              )}
            </div>
          </section>

          <hr className="cd-line" />

          {/* 카페 안내 */}
          <section className="cd-section">
            <h3 className="cd-section-title">카페 안내</h3>
            <p className="cd-description-text">
              {cafe.description || "상세 안내가 없습니다."}
            </p>
          </section>

          <hr className="cd-line" />

          {/* 방문자 리뷰 */}
          <section className="cd-section">
            <h3 className="cd-section-title">방문자 리뷰 ({reviews.length})</h3>
            <div className="cd-review-list">
              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div
                    className="cd-review-item"
                    key={r.reviewId || r.id || i}
                    style={{
                      marginBottom: "25px",
                      paddingBottom: "15px",
                      borderBottom: "1px solid #f9f9f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        닉네임: {r.nickname || "익명"}
                      </div>
                      <div style={{ fontSize: "14px", color: "#ffb800" }}>
                        별점: {"⭐".repeat(Math.floor(r.rating || 5))}
                      </div>
                      {r.createdAt && (
                        <div style={{ fontSize: "12px", color: "#999" }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "14.5px",
                        color: "#555",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {stripHtml(r.content)}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "40px 0",
                    color: "#ccc",
                    textAlign: "center",
                  }}
                >
                  등록된 리뷰가 없습니다.
                </div>
              )}
            </div>
            <button
              className="cd-mypage-link"
              onClick={() => navigate("/reviews")}
            >
              전체 리뷰 보러가기 <ChevronRight size={18} />
            </button>
          </section>

          {/* 인기 추천 카페 */}
          {recommendCafes.length > 0 && (
            <section className="cd-rec-section">
              <div className="cd-rec-header">
                <h3 className="cd-section-title">인기 추천 카페</h3>
                <span className="cd-rec-all" onClick={() => navigate(-1)}>
                  전체보기
                </span>
              </div>
              <div className="cd-rec-grid">
                {recommendCafes.map((rec) => {
                  const rcTypes = rec.allowedPetTypes
                    ? rec.allowedPetTypes.split(",").map((t) => t.trim())
                    : [];
                  const badge = rcTypes.includes("대형견")
                    ? "대형"
                    : rcTypes.includes("중형견")
                      ? "중형"
                      : "소형";
                  return (
                    <div
                      className="cd-rec-card"
                      key={rec.cafeId || rec.id}
                      onClick={() => navigate(`/cafes/${rec.cafeId || rec.id}`)}
                    >
                      <div className="cd-rec-img">
                        <img
                          src={
                            rec.imageUrls?.[0] ||
                            rec.cafeThumbnail ||
                            rec.image ||
                            "https://via.placeholder.com/300"
                          }
                          alt={rec.cafeName || rec.title || "추천 카페"}
                        />
                        <span
                          className="cd-rec-badge"
                          style={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 11,
                          }}
                        >
                          {badge}
                        </span>
                      </div>
                      <p className="cd-rec-name">
                        {rec.cafeName || rec.title || "이름 없는 카페"}
                      </p>
                      <p className="cd-rec-addr">
                        {rec.address
                          ? rec.address.split(" ").slice(0, 2).join(" ")
                          : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* 사이드바 */}
        <aside className="cd-sidebar">
          <div className="cd-card">
            <div
              className="cd-card-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span style={{ color: "#999" }}>연락처</span>
              <span style={{ fontWeight: 600 }}>
                {cafe.phone || "정보없음"}
              </span>
            </div>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #f0f0f0",
                margin: "12px 0",
              }}
            />
            <p
              className="cd-card-addr"
              style={{ fontSize: 13, color: "#666", marginBottom: 12 }}
            >
              {cafe.address}
            </p>
            <div
              className="cd-card-map"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px 0",
                background: "#fdfbf7",
                borderRadius: 8,
                marginBottom: 15,
              }}
            >
              <MapPin size={32} color="#f97316" />
            </div>
            <button
              className="cd-nav-btn"
              onClick={() =>
                window.open(
                  cafe.naverMapUrl ||
                    `https://map.naver.com/v5/search/${encodeURIComponent(cafe.address)}`,
                )
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px",
                background: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <ExternalLink size={16} /> 네이버 지도로 보기
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
