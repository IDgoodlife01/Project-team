package com.ggori_salang.backend.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // 256bit 이상의 시크릿 키
    private static final String SECRET = "ggori-sallang-secret-key-must-be-at-least-256bit-long!!";
    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 24; // 24시간

    // Keys.hmacShaKeyFor는 SecretKey 타입을 반환합니다.
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * JWT 토큰 생성
     */
    public String generateToken(int userId, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // setSubject -> subject
                .claim("role", role)
                .setIssuedAt(new Date()) // setIssuedAt -> issuedAt
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS)) // setExpiration -> expiration
                .signWith(key, SignatureAlgorithm.HS256) // 최신 버전은 알고리즘을 자동으로 선택합니다.
                .compact();
    }

    /** 토큰에서 userId 추출 */
    public int getUserId(String token) {
        return Integer.parseInt(getClaims(token).getSubject());
    }

    /** 토큰에서 role 추출 */
    public String getRole(String token) {
        return (String) getClaims(token).get("role");
    }

    /** 토큰 유효성 검사 */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 핵심 수정 부분: parserBuilder() -> parser()
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()  // parser() → parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)  // parseSignedClaims → parseClaimsJws
                .getBody();  // getPayload → getBody
    }
}