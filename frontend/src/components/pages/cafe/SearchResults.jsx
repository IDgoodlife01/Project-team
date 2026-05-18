import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../AxiosApi";
import CafeListItem from "./Cafelistitem";

// ── 상수 (영문 지역명 대응 및 대소문자 통합) ──────────────────────────
const REGION_MAP = {
  서울: 1,
  seoul: 1,
  SEOUL: 1,
  부산: 2,
  busan: 2,
  대구: 3,
  daegu: 3,
  인천: 4,
  incheon: 4,
  광주: 5,
  gwangju: 5,
  대전: 6,
  daejeon: 6,
  울산: 7,
  ulsan: 7,
  경기: 8,
  gyeonggi: 8,
  세종: 8,
  sejong: 8,
  강원: 9,
  gangwon: 9,
  충북: 10,
  chungbuk: 10,
  충남: 11,
  chungnam: 11,
  전북: 12,
  jeonbuk: 12,
  전남: 13,
  jeonnam: 13,
  경북: 14,
  gyeongbuk: 14,
  경남: 15,
  gyeongnam: 15,
  제주: 16,
  jeju: 16,
};

const PET_OPTIONS = ["강아지", "소형견", "중형견", "대형견", "맹견가능"];
const FACILITY_OPTIONS = [
  "주차가능",
  "애견운동장",
  "실내동반",
  "잔디마당",
  "드라이룸",
  "애견수영장",
  "애견놀이터",
];
const MOOD_OPTIONS = ["감성", "한옥", "포앙", "반려지", "대형", "정원", "숲"];
const SORT_OPTIONS = ["추천순", "인기순"];
const ITEMS_PER_PAGE = 10;

const PET_BACKEND_MAP = {
  강아지: null,
  소형견: "소형견",
  중형견: "중형견",
  대형견: "대형견",
  맹견가능: "맹견가능",
};

// ── 스타일 (기존 코드 유지) ──────────────────────────────────────────
const css = {
  wrapper: {
    display: "flex",
    minHeight: "calc(100vh - 72px)",
    background: "#fafafa",
    fontFamily: "'Pretendard', sans-serif",
  },
  sidebar: (open) => ({
    width: open ? 220 : 52,
    flexShrink: 0,
    background: "#fff",
    borderRight: "1px solid #f0f0f0",
    transition: "width 0.25s ease",
    overflow: "hidden",
  }),
  sideInner: { padding: "20px 16px", minWidth: 220 },
  sideHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sideTitle: { fontSize: 15, fontWeight: 700, color: "#222" },
  resetBtn: {
    fontSize: 12,
    color: "#f97316",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "#333",
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#444",
    marginBottom: 8,
    cursor: "pointer",
  },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: 6 },
  tag: (active) => ({
    padding: "5px 10px",
    borderRadius: 20,
    border: `1px solid ${active ? "#f97316" : "#e5e7eb"}`,
    background: active ? "#f97316" : "#fff",
    color: active ? "#fff" : "#555",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  main: { flex: 1, padding: "24px 28px", minWidth: 0 },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: "14px 20px",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    flexWrap: "wrap",
    gap: 12,
  },
  sortBtn: (active) => ({
    padding: "6px 14px",
    borderRadius: 20,
    border: `1px solid ${active ? "#f97316" : "#e5e7eb"}`,
    background: active ? "#f97316" : "#fff",
    color: active ? "#fff" : "#666",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: active ? 600 : 400,
  }),
  registerBtn: {
    padding: "6px 16px",
    borderRadius: 20,
    border: "none",
    background: "#f97316",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 700,
    marginLeft: 8,
  },
  statusMsg: {
    textAlign: "center",
    padding: "60px 0",
    fontSize: 15,
    color: "#999",
  },
  pageBtn: (active) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    border: `1px solid ${active ? "transparent" : "#e5e7eb"}`,
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#666",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  }),
};

// ── 컴포넌트 메인 ──────────────────────────────────────────────────
export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // 1. URL 파라미터 분석 (q와 region 모두 확인)
  const regionQuery = searchParams.get("region") || "";
  const searchQuery = searchParams.get("q") || "";

  // 검색어가 seoul인 경우에도 regionId가 1이 되도록 설정
  const regionId =
    REGION_MAP[regionQuery] || REGION_MAP[searchQuery.toLowerCase()] || null;
  const regionLabel =
    regionQuery || (searchQuery ? `"${searchQuery}"` : "전국");

  const [activeTab, setActiveTab] = useState("추천순");
  const [selectedPets, setSelectedPets] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [filterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allCafes, setAllCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    regionQuery,
    searchQuery,
    selectedPets,
    selectedFacilities,
    selectedMoods,
    activeTab,
  ]);

  // 2. 데이터 페칭 로직 개선
  useEffect(() => {
    const fetchCafes = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendPetTypes = selectedPets
          .map((p) => PET_BACKEND_MAP[p])
          .filter(Boolean);

        let data;
        // 지역 ID가 있으면 해당 지역 데이터를 우선 요청
        if (regionId) {
          data = await api.cafes.getAll({ regionId });
        } else if (backendPetTypes.length > 0) {
          data = await api.cafes.search({ petTypes: backendPetTypes });
        } else {
          data = await api.cafes.getAll({});
        }

        // 응답 데이터가 배열인지 확인 후 저장
        setAllCafes(Array.isArray(data) ? data : data?.list || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("카페 정보를 불러오지 못했습니다.");
        setAllCafes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, [regionId, selectedPets, searchQuery]); // searchQuery 의존성 추가

  const togglePet = (t) =>
    setSelectedPets((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t],
    );
  const toggleFacility = (f) =>
    setSelectedFacilities((p) =>
      p.includes(f) ? p.filter((x) => x !== f) : [...p, f],
    );
  const toggleMood = (m) =>
    setSelectedMoods((p) =>
      p.includes(m) ? p.filter((x) => x !== m) : [...p, m],
    );
  const resetFilters = () => {
    setSelectedPets([]);
    setSelectedFacilities([]);
    setSelectedMoods([]);
  };

  // 3. 프론트엔드 필터링 로직 (검색어가 지역명일 때는 문자열 포함 검사 생략 가능)
  let displayCafes = allCafes;

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    const isRegionSearch = REGION_MAP[lowerQuery];

    // 검색어가 지역명이 아닐 때만 텍스트 포함 여부 필터링 (지역명일 땐 서버에서 이미 걸러옴)
    if (!isRegionSearch) {
      displayCafes = displayCafes.filter(
        (c) =>
          (c.cafeName || "").toLowerCase().includes(lowerQuery) ||
          (c.address || "").toLowerCase().includes(lowerQuery) ||
          (c.description || "").toLowerCase().includes(lowerQuery),
      );
    }
  }

  // 시설 필터링
  if (selectedFacilities.length > 0) {
    displayCafes = displayCafes.filter((c) => {
      const f = c.facilities
        ? c.facilities.split(",").map((x) => x.trim())
        : [];
      return selectedFacilities.every((sf) => f.includes(sf));
    });
  }

  // 정렬
  displayCafes = [...displayCafes].sort((a, b) =>
    activeTab === "추천순"
      ? (b.rating || 0) - (a.rating || 0)
      : (b.favoriteCount || 0) - (a.favoriteCount || 0),
  );

  const totalPages = Math.ceil(displayCafes.length / ITEMS_PER_PAGE);
  const paginatedCafes = displayCafes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div style={css.wrapper}>
      {/* ── 사이드바 ── */}
      <aside style={css.sidebar(filterOpen)}>
        <div style={css.sideInner}>
          <div style={css.sideHeader}>
            <span style={css.sideTitle}>필터</span>
            <button style={css.resetBtn} onClick={resetFilters}>
              초기화
            </button>
          </div>

          <div style={css.section}>
            <div style={css.sectionLabel}>
              입장 가능 반려동물{" "}
              <span style={{ color: "#999", fontSize: 12 }}>∨</span>
            </div>
            {PET_OPTIONS.map((t) => (
              <label key={t} style={css.checkRow}>
                <input
                  type="checkbox"
                  checked={selectedPets.includes(t)}
                  onChange={() => togglePet(t)}
                  style={{
                    accentColor: "#f97316",
                    width: 15,
                    height: 15,
                    cursor: "pointer",
                  }}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          <div style={css.section}>
            <div style={css.sectionLabel}>핵심 시설</div>
            <div style={css.tagWrap}>
              {FACILITY_OPTIONS.map((f) => (
                <button
                  key={f}
                  style={css.tag(selectedFacilities.includes(f))}
                  onClick={() => toggleFacility(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={css.section}>
            <div style={css.sectionLabel}>지향 분위기</div>
            <div style={css.tagWrap}>
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m}
                  style={css.tag(selectedMoods.includes(m))}
                  onClick={() => toggleMood(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── 메인 ── */}
      <main style={css.main}>
        <div style={css.resultHeader}>
          <div style={{ fontSize: 15, color: "#333" }}>
            <span style={{ color: "#f97316", fontWeight: 700 }}>
              {regionLabel}
            </span>{" "}
            결과{" "}
            <strong style={{ color: "#111" }}>{displayCafes.length}개</strong>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                style={css.sortBtn(activeTab === s)}
                onClick={() => setActiveTab(s)}
              >
                {s}
              </button>
            ))}
            {isAdmin && (
              <button
                style={css.registerBtn}
                onClick={() => navigate("/cafe/register")}
              >
                + 카페 등록하기
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading && (
            <div style={css.statusMsg}>조건에 맞는 카페를 찾는 중... 🐾</div>
          )}
          {!loading && error && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#999", marginBottom: 16 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={css.registerBtn}
              >
                다시 시도
              </button>
            </div>
          )}
          {!loading && !error && paginatedCafes.length === 0 && (
            <div style={css.statusMsg}>앗! 조건에 맞는 카페가 없어요. 🐶</div>
          )}
          {!loading && !error && (
            <AnimatePresence mode="popLayout">
              {paginatedCafes.map((cafe) => (
                <motion.div
                  key={cafe.cafeId || cafe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <CafeListItem cafe={cafe} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              paddingTop: 24,
            }}
          >
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                style={css.pageBtn(currentPage === i + 1)}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
