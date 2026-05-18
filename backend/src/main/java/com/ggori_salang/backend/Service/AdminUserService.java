package com.ggori_salang.backend.Service;

import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final JdbcTemplate jdbcTemplate;

    // 전체 회원 목록
    public List<UserVO> getAllUsers() {
        String sql = "SELECT * FROM USERS ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(UserVO.class));
    }

    // 회원 삭제
    public boolean deleteUser(int userId) {
        return jdbcTemplate.update("DELETE FROM USERS WHERE user_id = ?", userId) > 0;
    }
}
