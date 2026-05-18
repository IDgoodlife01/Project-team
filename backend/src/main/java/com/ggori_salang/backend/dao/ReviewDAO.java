package com.ggori_salang.backend.dao;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReviewDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<ReviewVO> findAll() {
        String sql = "SELECT r.*, u.nickname, c.cafe_name FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "JOIN CAFES c ON r.cafe_id = c.cafe_id " +
                "ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReviewVO.class));
    }

    public List<ReviewVO> findByUserId(int userId) {
        String sql = "SELECT r.*, u.nickname, c.cafe_name FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "JOIN CAFES c ON r.cafe_id = c.cafe_id " +
                "WHERE r.user_id = ? ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(ReviewVO.class), userId);
    }

    public ReviewVO findById(int reviewId) {
        String sql = "SELECT r.*, u.nickname, c.cafe_name FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "JOIN CAFES c ON r.cafe_id = c.cafe_id " +
                "WHERE r.review_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(ReviewVO.class), reviewId);
    }

    public List<String> findImagesByReviewId(int reviewId) {
        String sql = "SELECT image_url FROM REVIEW_IMAGES WHERE review_id = ?";
        return jdbcTemplate.queryForList(sql, String.class, reviewId);
    }

    public int insert(ReviewVO review) {
        System.out.println("userId: " + review.getUserId());  // 추가
        System.out.println("cafeId: " + review.getCafeId());  // 추가
        String sql = "INSERT INTO REVIEWS (review_id, user_id, cafe_id, title, content, rating) " +
                "VALUES (SEQ_REVIEW.NEXTVAL, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                review.getUserId(), review.getCafeId(),
                review.getTitle(), review.getContent(), review.getRating());
    }

    public int insertImage(int reviewId, String imageUrl) {
        String sql = "INSERT INTO REVIEW_IMAGES (image_id, review_id, image_url) " +
                "VALUES (SEQ_REVIEW_IMAGE.NEXTVAL, ?, ?)";
        return jdbcTemplate.update(sql, reviewId, imageUrl);
    }

    public int update(ReviewVO review) {
        String sql = "UPDATE REVIEWS SET cafe_name=?, title=?, content=?, rating=? " +
                "WHERE review_id=?";
        return jdbcTemplate.update(sql,
                review.getCafeName(), review.getTitle(),
                review.getContent(), review.getRating(), review.getReviewId());
    }

    public int delete(int reviewId) {
        return jdbcTemplate.update("DELETE FROM REVIEWS WHERE review_id=?", reviewId);
    }

    public int incrementViewCount(int reviewId) {
        return jdbcTemplate.update(
                "UPDATE REVIEWS SET view_count = view_count + 1 WHERE review_id=?", reviewId);
    }

    public int getLastInsertedId() {
        return jdbcTemplate.queryForObject(
                "SELECT SEQ_REVIEW.CURRVAL FROM DUAL", Integer.class);
    }
    public List<ReviewVO> findByCafeId(int cafeId) {
        String sql = "SELECT r.*, u.nickname, c.cafe_name FROM REVIEWS r " +
                "JOIN USERS u ON r.user_id = u.user_id " +
                "JOIN CAFES c ON r.cafe_id = c.cafe_id " +
                "WHERE r.cafe_id = ? ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(ReviewVO.class), cafeId);
    }


}