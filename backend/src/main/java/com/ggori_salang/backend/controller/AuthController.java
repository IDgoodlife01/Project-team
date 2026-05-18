package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.AuthService;
import com.ggori_salang.backend.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserVO user) {
        boolean isSuccess = authService.signup(user);
        return isSuccess
                ? ResponseEntity.ok("회원가입 성공")
                : ResponseEntity.badRequest().body("회원가입 실패");
    }

    /**
     * 로그인 - JWT 토큰 반환
     * POST /api/auth/login
     * 반환 예시: { "token": "eyJhbGci...", "role": "USER" }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserVO user) {
        Map<String, String> result = authService.login(user.getEmail(), user.getPassword());
        if (result == null) {
            return ResponseEntity.status(401).body(Map.of("message", "이메일 또는 비밀번호가 일치하지 않습니다."));
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 이메일 중복 체크
     * GET /api/auth/check-email?email=xxx@xxx.com
     * true: 중복됨, false: 사용 가능
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(authService.isEmailDuplicated(email));
    }

    /**
     * 닉네임 중복 체크
     * GET /api/auth/check-nickname?nickname=xxx
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(authService.isNicknameDuplicated(nickname));
    }
}