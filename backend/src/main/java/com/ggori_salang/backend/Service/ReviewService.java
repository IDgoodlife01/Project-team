package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.ReviewDAO;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewDAO reviewDAO;
    private final JdbcTemplate jdbcTemplate; // 추가

    public List<ReviewVO> getReviewList() {
        return reviewDAO.findAll();
    }

    @Transactional
    public Map<String, Object> getReviewDetail(int reviewId) {
        reviewDAO.incrementViewCount(reviewId);
        ReviewVO review = reviewDAO.findById(reviewId);
        List<String> images = reviewDAO.findImagesByReviewId(reviewId);
        review.setImageUrls(images);

        Map<String, Object> result = new HashMap<>();
        result.put("review", review);
        return result;
    }

    @Transactional
    public boolean writeReview(ReviewVO review) {
        int result = reviewDAO.insert(review);
        if (result > 0) {
            if (review.getImageUrls() != null) {
                int reviewId = reviewDAO.getLastInsertedId();
                for (String url : review.getImageUrls()) {
                    reviewDAO.insertImage(reviewId, url);
                }
            }
            updateCafeRating(review.getCafeId()); // rating 갱신 추가
        }
        return result > 0;
    }

    // updateReview 수정
    public boolean updateReview(ReviewVO review) {
        ReviewVO existing = reviewDAO.findById(review.getReviewId());
        if (existing.getUserId() != review.getUserId()) {
            return false; // 본인 아니면 수정 불가
        }
        return reviewDAO.update(review) > 0;
    }

    // 변경
    @Transactional
    public boolean deleteReview(int reviewId, int userId) {
        ReviewVO existing = reviewDAO.findById(reviewId);
        if (existing.getUserId() != userId) {
            return false; // 본인 아니면 삭제 불가
        }
        return reviewDAO.delete(reviewId) > 0;
    }

    // rating 갱신 메서드 추가
    private void updateCafeRating(int cafeId) {
        String sql = "UPDATE CAFES SET rating = " +
                "(SELECT NVL(AVG(rating), 0) FROM REVIEWS WHERE cafe_id = ?) " +
                "WHERE cafe_id = ?";
        jdbcTemplate.update(sql, cafeId, cafeId);
    }

    // 추가
    public List<ReviewVO> getReviewsByCafe(int cafeId) {
        return reviewDAO.findByCafeId(cafeId);
    }

    public boolean deleteReviewByAdmin(int reviewId) {
        return reviewDAO.delete(reviewId) > 0;
    }
}
