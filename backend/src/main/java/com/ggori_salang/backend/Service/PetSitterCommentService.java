package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.PetSitterCommentDAO;
import com.ggori_salang.backend.vo.PetSitterCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetSitterCommentService {
    private final PetSitterCommentDAO petSitterCommentDAO;

    public List<PetSitterCommentVO> getComments(int postId) {
        return petSitterCommentDAO.findByPostId(postId);
    }

    public boolean writeComment(PetSitterCommentVO comment) {
        return petSitterCommentDAO.insert(comment) > 0;
    }

    // deleteComment 수정
    public boolean deleteComment(int commentId, int userId) {
        PetSitterCommentVO existing = petSitterCommentDAO.findById(commentId);
        if (existing.getUserId() != userId) {
            return false; // 본인 아니면 삭제 불가
        }
        return petSitterCommentDAO.delete(commentId) > 0;
    }

}