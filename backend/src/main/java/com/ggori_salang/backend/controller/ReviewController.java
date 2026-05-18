package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.ReviewService;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 리뷰 목록 조회
     * GET /api/reviews
     */
    @GetMapping
    public ResponseEntity<List<ReviewVO>> getReviewList() {
        return ResponseEntity.ok(reviewService.getReviewList());
    }

    /**
     * 리뷰 상세 조회 (조회수 증가 포함)
     * GET /api/reviews/{reviewId}
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<Map<String, Object>> getReviewDetail(@PathVariable int reviewId) {
        return ResponseEntity.ok(reviewService.getReviewDetail(reviewId));
    }

    /**
     * 리뷰 작성 (이미지 URL 포함)
     * POST /api/reviews
     * body: {
     *   "userId": 1,
     *   "cafeName": "댕댕이카페",
     *   "title": "제목",
     *   "content": "내용",
     *   "rating": 5,
     *   "imageUrls": ["https://firebase.../img1.jpg"]
     * }
     */
    @PostMapping
    public ResponseEntity<String> writeReview(@RequestBody ReviewVO review) {
        boolean isSuccess = reviewService.writeReview(review);
        return isSuccess
                ? ResponseEntity.ok("리뷰 작성 성공")
                : ResponseEntity.badRequest().body("리뷰 작성 실패");
    }

    /**
     * 리뷰 수정
     * PUT /api/reviews/{reviewId}
     */
    // updateReview 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable int reviewId,
                                               @RequestBody ReviewVO review,
                                               Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        review.setReviewId(reviewId);
        review.setUserId(userId);
        boolean isSuccess = reviewService.updateReview(review);
        return isSuccess
                ? ResponseEntity.ok("리뷰 수정 성공")
                : ResponseEntity.badRequest().body("본인 리뷰만 수정할 수 있습니다.");
    }

    /**
     * 리뷰 삭제
     * DELETE /api/reviews/{reviewId}
     */
    // deleteReview 수정
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable int reviewId,
                                               Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        boolean isSuccess = reviewService.deleteReview(reviewId, userId);
        return isSuccess
                ? ResponseEntity.ok("리뷰 삭제 성공")
                : ResponseEntity.badRequest().body("본인 리뷰만 삭제할 수 있습니다.");
    }


    // 추가
    @GetMapping("/cafe/{cafeId}")
    public ResponseEntity<List<ReviewVO>> getReviewsByCafe(@PathVariable int cafeId) {
        return ResponseEntity.ok(reviewService.getReviewsByCafe(cafeId));
    }


}