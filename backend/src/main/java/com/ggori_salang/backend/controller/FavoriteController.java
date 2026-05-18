package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.FavoriteService;
import com.ggori_salang.backend.vo.FavoriteVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 내 즐겨찾기 목록 조회
     * GET /api/favorites/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<FavoriteVO>> getMyFavorites(@PathVariable int userId) {
        return ResponseEntity.ok(favoriteService.getMyFavorites(userId));
    }

    /**
     * 즐겨찾기 추가
     * POST /api/favorites
     * body: { "userId": 1, "cafeId": 3 }
     * - CAFES.favorite_count 1 증가도 같이 처리
     */
    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteVO favorite) {
        boolean isSuccess = favoriteService.addFavorite(favorite);
        return isSuccess
                ? ResponseEntity.ok("즐겨찾기 추가 성공")
                : ResponseEntity.badRequest().body("이미 즐겨찾기한 카페입니다.");
    }

    /**
     * 즐겨찾기 해제
     * DELETE /api/favorites/{userId}/{cafeId}
     * - CAFES.favorite_count 1 감소도 같이 처리
     */
    @DeleteMapping("/{userId}/{cafeId}")
    public ResponseEntity<String> removeFavorite(@PathVariable int userId, @PathVariable int cafeId) {
        boolean isSuccess = favoriteService.removeFavorite(userId, cafeId);
        return isSuccess
                ? ResponseEntity.ok("즐겨찾기 해제 성공")
                : ResponseEntity.badRequest().body("즐겨찾기 해제 실패");
    }
}