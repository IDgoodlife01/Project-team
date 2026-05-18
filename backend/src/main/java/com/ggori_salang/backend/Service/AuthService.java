package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.UserDAO;
import com.ggori_salang.backend.jwt.JwtTokenProvider;
import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public boolean signup(UserVO user) {
        if (userDAO.existsByEmail(user.getEmail())) return false;
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDAO.insertUser(user) > 0;
    }

    // 로그인 성공 시 JWT 토큰 + role 반환
    public Map<String, String> login(String email, String password) {
        return userDAO.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(u -> {
                    String token = jwtTokenProvider.generateToken(u.getUserId(), u.getRole());
                    Map<String, String> result = new HashMap<>();
                    result.put("token", token);
                    result.put("role", u.getRole());
                    result.put("nickname", u.getNickname());
                    result.put("userId", String.valueOf(u.getUserId()));
                    return result;
                })
                .orElse(null);
    }

    public boolean isEmailDuplicated(String email) {
        return userDAO.existsByEmail(email);
    }

    public boolean isNicknameDuplicated(String nickname) {
        return userDAO.existsByNickname(nickname);
    }
}