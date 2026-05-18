package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.PostDAO;
import com.ggori_salang.backend.dao.PetSitterDAO;
import com.ggori_salang.backend.dao.ReviewDAO;
import com.ggori_salang.backend.vo.PostVO;
import com.ggori_salang.backend.vo.PetSitterPostVO;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyActivityService {
    private final PostDAO postDAO;
    private final PetSitterDAO petSitterDAO;
    private final ReviewDAO reviewDAO;

    public List<PostVO> getMyPosts(int userId) {
        return postDAO.findByUserId(userId);
    }

    public List<PetSitterPostVO> getMyPetSitterPosts(int userId) {
        return petSitterDAO.findByUserId(userId);
    }

    public List<ReviewVO> getMyReviews(int userId) {
        return reviewDAO.findByUserId(userId);
    }
}