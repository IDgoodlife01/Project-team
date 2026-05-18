package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.RegionService;
import com.ggori_salang.backend.vo.RegionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    /**
     * 지역 전체 목록 조회 (비로그인도 가능)
     * GET /api/regions
     * 반환: [ { "regionId": 1, "regionName": "서울", "imageUrl": "https://firebase..." }, ... ]
     */
    @GetMapping
    public ResponseEntity<List<RegionVO>> getRegionList() {
        return ResponseEntity.ok(regionService.getRegionList());
    }
}