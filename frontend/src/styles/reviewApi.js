import api from "./axios"; // 위에서 만든 인스턴스 가져오기

export const reviewApi = {
  // 리뷰 목록 조회
  getReviewList: () => api.get("/reviews"),

  // 리뷰 상세 조회
  getReviewDetail: (reviewId) => api.get(`/reviews/${reviewId}`),

  // 리뷰 작성
  writeReview: (reviewData) => api.post("/reviews", reviewData),

  // 특정 카페의 리뷰만 조회 (추가하신 기능)
  getReviewsByCafe: (cafeId) => api.get(`/reviews/cafe/${cafeId}`),

  // 리뷰 삭제
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
