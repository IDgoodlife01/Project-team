package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.CafeDAO;
import com.ggori_salang.backend.dao.FavoriteDAO;
import com.ggori_salang.backend.vo.FavoriteVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteDAO favoriteDAO;
    private final CafeDAO cafeDAO;

    public List<FavoriteVO> getMyFavorites(int userId) {
        return favoriteDAO.findByUserId(userId);
    }

    // 즐겨찾기 추가 + favorite_count 증가 (트랜잭션)
    @Transactional
    public boolean addFavorite(FavoriteVO favorite) {
        if (favoriteDAO.exists(favorite.getUserId(), favorite.getCafeId())) {
            return false; // 이미 즐겨찾기한 경우
        }
        favoriteDAO.insert(favorite.getUserId(), favorite.getCafeId());
        cafeDAO.updateFavoriteCount(favorite.getCafeId(), +1);
        return true;
    }

    // 즐겨찾기 해제 + favorite_count 감소 (트랜잭션)
    @Transactional
    public boolean removeFavorite(int userId, int cafeId) {
        int result = favoriteDAO.delete(userId, cafeId);
        if (result > 0) {
            cafeDAO.updateFavoriteCount(cafeId, -1);
            return true;
        }
        return false;
    }
}