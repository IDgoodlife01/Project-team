import axios from "axios";

// ── 지역 매핑 ───────────────────────────────────────────
const REGION_ID_MAP = {
  seoul: 1,
  busan: 2,
  daegu: 3,
  incheon: 4,
  gwangju: 5,
  daejeon: 6,
  ulsan: 7,
  sejong: 8,
  gyeonggi: 9,
  gangwon: 10,
  chungbuk: 11,
  chungnam: 12,
  jeonbuk: 13,
  jeonnam: 14,
  gyeongbuk: 15,
  gyeongnam: 16,
  jeju: 17,
};

const REGION_CODE_MAP = Object.fromEntries(
  Object.entries(REGION_ID_MAP).map(([k, v]) => [v, k]),
);

function toRegionId(val) {
  if (!val) return null;
  const n = Number(val);
  if (!isNaN(n) && n > 0) return n;
  return REGION_ID_MAP[val] ?? null;
}

// ── axios 인스턴스 ──────────────────────────────────────
const instance = axios.create({
  baseURL: "http://localhost:8111",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url ?? "";
    const isAuthEndpoint =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/signup");

    // 로그인/회원가입 요청의 401은 리다이렉트 하지 않음
    if (err.response?.status === 401 && !isAuthEndpoint) {
      ["token", "userId", "nickname", "role", "email", "phone"].forEach((k) =>
        localStorage.removeItem(k),
      );
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── 카페 필드 매핑 ─────────────────────────────────────
function mapCafe(raw) {
  const c = raw?.cafe ?? raw;
  return {
    id: c.cafeId,
    cafeId: c.cafeId,
    title: c.cafeName ?? "",
    name: c.cafeName ?? "",
    content: c.description ?? "",
    region: REGION_CODE_MAP[c.regionId] ?? String(c.regionId ?? ""),
    regionId: c.regionId,
    address: c.address ?? "",
    phone: c.phone ?? "",
    website: c.website ?? "",
    mapUrl: c.naverMapUrl ?? "",
    latitude: c.latitude ?? 37.5665,
    longitude: c.longitude ?? 126.978,
    allowedPetTypes: c.allowedPetTypes ?? "",
    facilities: c.allowedPetTypes
      ? c.allowedPetTypes.split(",").map((s) => s.trim())
      : [],
    maxWeight: c.maxWeight ?? 0,
    weightLimit: c.maxWeight ? `최대 ${c.maxWeight}kg` : "All",
    category: c.category ?? "",
    image: c.imageUrls?.[0] ?? "",
    images: c.imageUrls ?? [],
    notice: c.notice ?? "",
    businessHours: c.businessHours ?? "",
    menu: c.menu ?? [],
    rating: c.rating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    favoriteCount: c.favoriteCount ?? 0,
    userId: c.userId ?? null,
  };
}

function toBackendCafe(form) {
  const maxWeightMatch = String(form.weightLimit ?? "").match(/[\d.]+/);
  return {
    cafeName: form.title ?? form.name ?? "",
    description: form.content ?? "",
    regionId: toRegionId(form.region) ?? 1,
    address: form.address ?? "",
    phone: form.phone ?? "",
    category: form.category ?? "",
    maxWeight: maxWeightMatch ? parseFloat(maxWeightMatch[0]) : 0,
    allowedPetTypes:
      Array.isArray(form.facilities) && form.facilities.length
        ? form.facilities.join(",")
        : (form.allowedPetTypes ?? ""),
    naverMapUrl: form.mapUrl ?? "",
    imageUrls: form.images ?? (form.image ? [form.image] : []),
    notice: form.notice ?? "",
    businessHours: form.businessHours ?? "",
    menu: form.menu ?? [],
    latitude: form.latitude ?? 37.5665,
    longitude: form.longitude ?? 126.978,
    userId: form.userId ?? null,
  };
}

// ── API ────────────────────────────────────────────────
export const api = {
  auth: {
    login: async (email, password) => {
      const res = await instance.post("/api/auth/login", { email, password });
      return res.data;
    },
    signup: async (userData) => {
      const res = await instance.post("/api/auth/signup", userData);
      return res.data;
    },
    checkEmail: async (email) => {
      const res = await instance.get("/api/auth/check-email", {
        params: { email },
      });
      return res.data;
    },
    checkNickname: async (nickname) => {
      const res = await instance.get("/api/auth/check-nickname", {
        params: { nickname },
      });
      return res.data;
    },
  },

  regions: {
    getAll: async () => {
      const res = await instance.get("/api/regions");
      return res.data;
    },
  },

  cafes: {
    getAll: async (params = {}) => {
      const regionId = toRegionId(params.regionId);
      let res;
      if (regionId) {
        const query = { regionId };
        if (params.petTypes) query.petTypes = params.petTypes;
        res = await instance.get("/api/cafes/search", {
          params: query,
          paramsSerializer: (p) => {
            const sp = new URLSearchParams();
            Object.entries(p).forEach(([k, v]) => {
              if (Array.isArray(v)) v.forEach((val) => sp.append(k, val));
              else if (v != null) sp.append(k, v);
            });
            return sp.toString();
          },
        });
      } else {
        res = await instance.get("/api/cafes/all");
      }
      return (res.data ?? []).map(mapCafe);
    },
    search: async (params) => {
      const regionId = toRegionId(params.regionId);
      if (!regionId) return api.cafes.getAll();
      const res = await instance.get("/api/cafes/search", {
        params: { ...params, regionId },
        paramsSerializer: (p) => {
          const sp = new URLSearchParams();
          Object.entries(p).forEach(([k, v]) => {
            if (Array.isArray(v)) v.forEach((val) => sp.append(k, val));
            else if (v != null) sp.append(k, v);
          });
          return sp.toString();
        },
      });
      return (res.data ?? []).map(mapCafe);
    },
    getById: async (id) => {
      const res = await instance.get(`/api/cafes/${id}`);
      return mapCafe(res.data);
    },
    create: async (form) => {
      const res = await instance.post("/api/cafes", toBackendCafe(form));
      return res.data;
    },
    update: async (id, form) => {
      const res = await instance.put(`/api/cafes/${id}`, {
        ...toBackendCafe(form),
        cafeId: id,
      });
      return res.data;
    },
    delete: async (id) => {
      await instance.delete(`/api/cafes/${id}`);
    },
  },

  reviews: {
    // ✅ BoardController 기준: /api/board/reviews
    getAll: async () => {
      const res = await instance.get("/api/board/reviews");
      return res.data;
    },
    getByCafeId: async (cafeId) => {
      const res = await instance.get(`/api/reviews/cafe/${cafeId}`);
      return res.data;
    },
    getByCafe: async (cafeId) => {
      const res = await instance.get(`/api/reviews/cafe/${cafeId}`);
      return res.data;
    },
    create: async (review) => {
      const res = await instance.post("/api/reviews", review);
      return res.data;
    },
    update: async (id, review) => {
      const res = await instance.put(`/api/reviews/${id}`, review);
      return res.data;
    },
    delete: async (id) => {
      await instance.delete(`/api/reviews/${id}`);
    },
  },

  posts: {
    // ✅ BoardController 기준: /api/board/posts (전체 목록)
    getAll: async () => {
      const res = await instance.get("/api/board/posts");
      return res.data;
    },
    // ✅ PostController 기준: /api/posts/{postId} (상세 + 조회수)
    getById: async (id) => {
      const res = await instance.get(`/api/posts/${id}`);
      return res.data;
    },
    // ✅ PostController 기준: POST /api/posts
    create: async (post) => {
      const res = await instance.post("/api/posts", post);
      return res.data;
    },
    // ✅ PostController 기준: DELETE /api/posts/{postId}
    delete: async (id) => {
      await instance.delete(`/api/posts/${id}`);
    },
    // ✅ 댓글 기능: 백엔드에 없으므로 빈 배열 반환 (에러 방지)
    getComments: async (postId) => {
      console.warn(`댓글 API 미구현: /api/posts/${postId}/comments`);
      return [];
    },
    deleteComment: async (commentId) => {
      console.warn(`댓글 삭제 API 미구현: /api/comments/${commentId}`);
    },
    addComment: async (postId, comment) => {
      console.warn(`댓글 작성 API 미구현: /api/posts/${postId}/comments`);
      return null;
    },
  },

  sitters: {
    // ✅ BoardController 기준: /api/board/petsitter
    getAll: async () => {
      const res = await instance.get("/api/board/petsitter");
      return res.data;
    },
    getById: async (id) => {
      const res = await instance.get(`/api/pet-sitter/${id}`);
      return res.data;
    },
    create: async (sitter) => {
      const res = await instance.post("/api/pet-sitter", sitter);
      return res.data;
    },
    update: async (id, sitter) => {
      const res = await instance.put(`/api/pet-sitter/${id}`, sitter);
      return res.data;
    },
    delete: async (id) => {
      await instance.delete(`/api/pet-sitter/${id}`);
    },
  },

  favorites: {
    getByUser: async (userId) => {
      const res = await instance.get(`/api/favorites/${userId}`);
      return res.data;
    },
    add: async (userId, cafeId) => {
      const res = await instance.post("/api/favorites", { userId, cafeId });
      return res.data;
    },
    remove: async (userId, cafeId) => {
      await instance.delete(`/api/favorites/${userId}/${cafeId}`);
    },
    toggle: async (cafeId) => {
      const userId = localStorage.getItem("userId");
      const res = await instance.post(`/api/favorites/toggle/${cafeId}`, {
        userId,
      });
      return res.data;
    },
  },

  my: {
    // ✅ 내 게시글: /api/board/posts 전체에서 userId 필터링
    getPosts: async (userId) => {
      const res = await instance.get("/api/board/posts");
      const all = Array.isArray(res.data) ? res.data : [];
      return all.filter((p) => Number(p.userId) === Number(userId));
    },
    // ✅ 내 리뷰: /api/board/reviews 전체에서 userId 필터링
    getReviews: async (userId) => {
      const res = await instance.get("/api/board/reviews");
      const all = Array.isArray(res.data) ? res.data : [];
      return all.filter((r) => Number(r.userId) === Number(userId));
    },
  },
};

export default instance;
