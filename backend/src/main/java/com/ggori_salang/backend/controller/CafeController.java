package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.CafeService;
import com.ggori_salang.backend.vo.CafeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cafes")
@RequiredArgsConstructor
public class CafeController {

    private final CafeService cafeService;

    /**
     * 지역별 카페 목록 조회 (비로그인도 가능)
     * GET /api/cafes?regionId=1
     */
    @GetMapping
    public ResponseEntity<List<CafeVO>> getCafesByRegion(@RequestParam int regionId) {
        return ResponseEntity.ok(cafeService.getCafesByRegion(regionId));
    }

    // 전체 카페 목록 (비로그인도 가능)
    @GetMapping("/all")
    public ResponseEntity<List<CafeVO>> getAllCafes() {
        return ResponseEntity.ok(cafeService.getAllCafes());
    }

    /**
     * 카페 필터링 검색 (비로그인도 가능)
     * GET /api/cafes/search?regionId=1&petType=소형견&maxWeight=7.0
     */
    @GetMapping("/search")
    public ResponseEntity<List<CafeVO>> searchCafes(
            @RequestParam int regionId,
            @RequestParam(required = false) List<String> petTypes,
            @RequestParam(required = false) Double maxWeight) {
        return ResponseEntity.ok(cafeService.searchCafes(regionId, petTypes, maxWeight));
    }
    /**
     * 카페 상세 조회 (비로그인도 가능)
     * GET /api/cafes/{cafeId}
     * 반환: 카페 정보 + 이미지 목록 + 위도/경도
     */
    @GetMapping("/{cafeId}")
    public ResponseEntity<Map<String, Object>> getCafeDetail(@PathVariable int cafeId) {
        return ResponseEntity.ok(cafeService.getCafeDetail(cafeId));
    }

    /**
     * 카페 등록 (ADMIN만 가능 - Security에서 제어)
     * POST /api/cafes
     */
    @PostMapping
    public ResponseEntity<String> createCafe(@RequestBody CafeVO cafe) {
        boolean isSuccess = cafeService.createCafe(cafe);
        return isSuccess
                ? ResponseEntity.ok("카페 등록 성공")
                : ResponseEntity.badRequest().body("카페 등록 실패");
    }

    /**
     * 카페 수정 (ADMIN만 가능 - Security에서 제어)
     * PUT /api/cafes/{cafeId}
     */
    @PutMapping("/{cafeId}")
    public ResponseEntity<String> updateCafe(@PathVariable int cafeId, @RequestBody CafeVO cafe) {
        cafe.setCafeId(cafeId);
        boolean isSuccess = cafeService.updateCafe(cafe);
        return isSuccess
                ? ResponseEntity.ok("카페 수정 성공")
                : ResponseEntity.badRequest().body("카페 수정 실패");
    }

    /**
     * 카페 삭제 (ADMIN만 가능 - Security에서 제어)
     * DELETE /api/cafes/{cafeId}
     */
    @DeleteMapping("/{cafeId}")
    public ResponseEntity<String> deleteCafe(@PathVariable int cafeId) {
        boolean isSuccess = cafeService.deleteCafe(cafeId);
        return isSuccess
                ? ResponseEntity.ok("카페 삭제 성공")
                : ResponseEntity.badRequest().body("카페 삭제 실패");
    }
}