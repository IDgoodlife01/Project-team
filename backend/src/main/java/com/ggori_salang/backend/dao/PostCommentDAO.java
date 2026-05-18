package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.PostCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PostCommentDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<PostCommentVO> findByPostId(int postId) {
        String sql = "SELECT c.*, u.nickname FROM POST_COMMENTS c " +
                "JOIN USERS u ON c.user_id = u.user_id " +
                "WHERE c.post_id = ? ORDER BY c.created_at ASC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(PostCommentVO.class), postId);
    }

    public PostCommentVO findById(int commentId) {
        String sql = "SELECT * FROM POST_COMMENTS WHERE comment_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(PostCommentVO.class), commentId);
    }

    public int insert(PostCommentVO comment) {
        String sql = "INSERT INTO POST_COMMENTS (comment_id, post_id, user_id, content) " +
                "VALUES (SEQ_POST_COMMENT.NEXTVAL, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                comment.getPostId(), comment.getUserId(), comment.getContent());
    }

    public int delete(int commentId) {
        return jdbcTemplate.update(
                "DELETE FROM POST_COMMENTS WHERE comment_id=?", commentId);
    }
}
