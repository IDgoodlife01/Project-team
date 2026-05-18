package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.PostDAO;
import com.ggori_salang.backend.vo.PostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostDAO postDAO;

    public List<PostVO> getPostList() {
        return postDAO.findAll();
    }

    // 상세 조회 + 조회수 증가 + 이미지 목록
    @Transactional
    public Map<String, Object> getPostDetail(int postId) {
        postDAO.incrementViewCount(postId);
        PostVO post = postDAO.findById(postId);
        List<String> images = postDAO.findImagesByPostId(postId);
        post.setImageUrls(images);

        Map<String, Object> result = new HashMap<>();
        result.put("post", post);
        return result;
    }

    // 글 작성 + 이미지 URL 저장
    @Transactional
    public boolean writePost(PostVO post) {
        int result = postDAO.insert(post);
        if (result > 0 && post.getImageUrls() != null) {
            int postId = postDAO.getLastInsertedId();
            for (String url : post.getImageUrls()) {
                postDAO.insertImage(postId, url);
            }
        }
        return result > 0;
    }

    // updatePost 수정
    public boolean updatePost(PostVO post) {
        PostVO existing = postDAO.findById(post.getPostId());
        if (existing.getUserId() != post.getUserId()) {
            return false; // 본인 아니면 수정 불가
        }
        return postDAO.update(post) > 0;
    }

    // deletePost 수정
    public boolean deletePost(int postId, int userId) {
        PostVO existing = postDAO.findById(postId);
        if (existing.getUserId() != userId) {
            return false; // 본인 아니면 삭제 불가
        }
        return postDAO.delete(postId) > 0;
    }

    public boolean deletePostByAdmin(int postId) {
        return postDAO.delete(postId) > 0;
    }

}