package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserDAO {
    private final JdbcTemplate jdbcTemplate;

    public int insertUser(UserVO user) {
        String sql = "INSERT INTO USERS (user_id, email, password, nickname, phone, role) " +
                "VALUES (SEQ_USER.NEXTVAL, ?, ?, ?, ?, 'USER')";
        return jdbcTemplate.update(sql,
                user.getEmail(), user.getPassword(),
                user.getNickname(), user.getPhone());
    }

    public Optional<UserVO> findByEmail(String email) {
        String sql = "SELECT * FROM USERS WHERE email = ?";
        return jdbcTemplate.query(sql,
                        new BeanPropertyRowMapper<>(UserVO.class), email)
                .stream().findFirst();
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM USERS WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public boolean existsByNickname(String nickname) {
        String sql = "SELECT COUNT(*) FROM USERS WHERE nickname = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, nickname);
        return count != null && count > 0;
    }

    public int updateUser(UserVO user) {
        String sql = "UPDATE USERS SET nickname=?, phone=?, password=? WHERE user_id=?";
        return jdbcTemplate.update(sql,
                user.getNickname(), user.getPhone(),
                user.getPassword(), user.getUserId());
    }
}
