package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.FavoriteVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FavoriteDAO {
    private final JdbcTemplate jdbcTemplate;

    // 즐겨찾기 목록 (카페 정보 JOIN)
    public List<FavoriteVO> findByUserId(int userId) {
        String sql = "SELECT f.favorite_id, f.user_id, f.cafe_id, f.created_at, " +
                "c.cafe_name, c.address, c.rating, " +
                "(SELECT image_url FROM CAFE_IMAGES WHERE cafe_id = c.cafe_id AND ROWNUM = 1) AS image_url " +
                "FROM FAVORITES f JOIN CAFES c ON f.cafe_id = c.cafe_id " +
                "WHERE f.user_id = ? ORDER BY f.created_at DESC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(FavoriteVO.class), userId);
    }

    public int insert(int userId, int cafeId) {
        String sql = "INSERT INTO FAVORITES (favorite_id, user_id, cafe_id) " +
                "VALUES (SEQ_FAVORITE.NEXTVAL, ?, ?)";
        return jdbcTemplate.update(sql, userId, cafeId);
    }

    public int delete(int userId, int cafeId) {
        return jdbcTemplate.update(
                "DELETE FROM FAVORITES WHERE user_id=? AND cafe_id=?", userId, cafeId);
    }

    public boolean exists(int userId, int cafeId) {
        String sql = "SELECT COUNT(*) FROM FAVORITES WHERE user_id=? AND cafe_id=?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, cafeId);
        return count != null && count > 0;
    }
}