package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.CafeDAO;
import com.ggori_salang.backend.vo.CafeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CafeService {
    private final CafeDAO cafeDAO;

    public List<CafeVO> getCafesByRegion(int regionId) {
        List<CafeVO> cafes = cafeDAO.findByRegion(regionId);
        for (CafeVO cafe : cafes) {
            List<String> images = cafeDAO.findImagesByCafeId(cafe.getCafeId());
            cafe.setImageUrls(images);
        }
        return cafes;
    }
    public List<CafeVO> searchCafes(int regionId, List<String> petTypes, Double maxWeight) {
        List<CafeVO> cafes = cafeDAO.findByFilters(regionId, petTypes, maxWeight);
        for (CafeVO cafe : cafes) {
            cafe.setImageUrls(cafeDAO.findImagesByCafeId(cafe.getCafeId()));
        }
        return cafes;
    }

    // 카페 상세: 카페 정보 + 이미지 목록
    public Map<String, Object> getCafeDetail(int cafeId) {
        CafeVO cafe = cafeDAO.findById(cafeId);
        List<String> images = cafeDAO.findImagesByCafeId(cafeId);
        cafe.setImageUrls(images);

        Map<String, Object> result = new HashMap<>();
        result.put("cafe", cafe);
        return result;
    }

    public boolean createCafe(CafeVO cafe) {
        int result = cafeDAO.insertCafe(cafe);
        // 이미지 URL 목록 저장
        if (result > 0 && cafe.getImageUrls() != null) {
            int cafeId = cafeDAO.getLastInsertedId();
            for (String url : cafe.getImageUrls()) {
                cafeDAO.insertCafeImage(cafeId, url);
            }
        }
        return result > 0;
    }

    public boolean updateCafe(CafeVO cafe) {
        return cafeDAO.updateCafe(cafe) > 0;
    }

    public boolean deleteCafe(int cafeId) {
        return cafeDAO.deleteCafe(cafeId) > 0;
    }

    // 전체 카페 목록 (관리자용)
    public List<CafeVO> getAllCafes() {
        return cafeDAO.findAll();
    }

    // 카페 단건 조회 (수정 폼용)
    public CafeVO getCafeById(int cafeId) {
        return cafeDAO.findById(cafeId);
    }
}