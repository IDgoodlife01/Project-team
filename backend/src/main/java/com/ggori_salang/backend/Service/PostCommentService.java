package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.PostCommentDAO;
import com.ggori_salang.backend.vo.PostCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostCommentService {
    private final PostCommentDAO postCommentDAO;

    public List<PostCommentVO> getComments(int postId) {
        return postCommentDAO.findByPostId(postId);
    }

    public boolean writeComment(PostCommentVO comment) {
        return postCommentDAO.insert(comment) > 0;
    }

    // deleteComment 수정
    public boolean deleteComment(int commentId, int userId) {
        PostCommentVO existing = postCommentDAO.findById(commentId);
        if (existing.getUserId() != userId) {
            return false; // 본인 아니면 삭제 불가
        }
        return postCommentDAO.delete(commentId) > 0;
    }
}