package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.PetSitterPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PetSitterDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<PetSitterPostVO> findAll() {
        String sql = "SELECT p.*, u.nickname FROM PET_SITTER_POSTS p " +
                "JOIN USERS u ON p.user_id = u.user_id " +
                "ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PetSitterPostVO.class));
    }

    public PetSitterPostVO findById(int postId) {
        String sql = "SELECT p.*, u.nickname FROM PET_SITTER_POSTS p " +
                "JOIN USERS u ON p.user_id = u.user_id " +
                "WHERE p.post_id = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(PetSitterPostVO.class), postId);
    }

    public List<String> findImagesByPostId(int postId) {
        String sql = "SELECT image_url FROM PETSITTER_IMAGES WHERE post_id = ?";
        return jdbcTemplate.queryForList(sql, String.class, postId);
    }

    public List<PetSitterPostVO> findByUserId(int userId) {
        String sql = "SELECT p.*, u.nickname FROM PET_SITTER_POSTS p " +
                "JOIN USERS u ON p.user_id = u.user_id " +
                "WHERE p.user_id = ? ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(PetSitterPostVO.class), userId);
    }

    public int insert(PetSitterPostVO post) {
        String sql = "INSERT INTO PET_SITTER_POSTS (post_id, user_id, title, content, region) " +
                "VALUES (SEQ_PETSITTER_POST.NEXTVAL, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                post.getUserId(), post.getTitle(),
                post.getContent(), post.getRegion());
    }

    public int insertImage(int postId, String imageUrl) {
        String sql = "INSERT INTO PETSITTER_IMAGES (image_id, post_id, image_url) " +
                "VALUES (SEQ_PETSITTER_IMAGE.NEXTVAL, ?, ?)";
        return jdbcTemplate.update(sql, postId, imageUrl);
    }

    public int update(PetSitterPostVO post) {
        String sql = "UPDATE PET_SITTER_POSTS SET title=?, content=?, region=? WHERE post_id=?";
        return jdbcTemplate.update(sql,
                post.getTitle(), post.getContent(),
                post.getRegion(), post.getPostId());
    }

    public int delete(int postId) {
        return jdbcTemplate.update(
                "DELETE FROM PET_SITTER_POSTS WHERE post_id=?", postId);
    }

    public int incrementViewCount(int postId) {
        return jdbcTemplate.update(
                "UPDATE PET_SITTER_POSTS SET view_count = view_count + 1 WHERE post_id=?", postId);
    }

    public int getLastInsertedId() {
        return jdbcTemplate.queryForObject(
                "SELECT SEQ_PETSITTER_POST.CURRVAL FROM DUAL", Integer.class);
    }
}