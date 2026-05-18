package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.PetSitterCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PetSitterCommentDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<PetSitterCommentVO> findByPostId(int postId) {
        String sql = "SELECT c.*, u.nickname FROM PETSITTER_COMMENTS c " +
                "JOIN USERS u ON c.user_id = u.user_id " +
                "WHERE c.post_id = ? ORDER BY c.created_at ASC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(PetSitterCommentVO.class), postId);
    }

    public PetSitterCommentVO findById(int commentId) {
        String sql = "SELECT * FROM PETSITTER_COMMENTS WHERE comment_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(PetSitterCommentVO.class), commentId);
    }

    public int insert(PetSitterCommentVO comment) {
        String sql = "INSERT INTO PETSITTER_COMMENTS (comment_id, post_id, user_id, content) " +
                "VALUES (SEQ_PETSITTER_COMMENT.NEXTVAL, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                comment.getPostId(), comment.getUserId(), comment.getContent());
    }

    public int delete(int commentId) {
        return jdbcTemplate.update(
                "DELETE FROM PETSITTER_COMMENTS WHERE comment_id=?", commentId);
    }
}