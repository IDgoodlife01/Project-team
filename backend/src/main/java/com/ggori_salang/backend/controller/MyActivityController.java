package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.MyActivityService;
import com.ggori_salang.backend.vo.PetSitterPostVO;
import com.ggori_salang.backend.vo.PostVO;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my")
@RequiredArgsConstructor
public class MyActivityController {

    private final MyActivityService myActivityService;

    /**
     * 내가 쓴 자유게시판 글 목록
     * GET /api/my/{userId}/posts
     */
    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<PostVO>> getMyPosts(@PathVariable int userId) {
        return ResponseEntity.ok(myActivityService.getMyPosts(userId));
    }

    /**
     * 내가 쓴 펫시터 글 목록
     * GET /api/my/{userId}/pet-sitter
     */
    @GetMapping("/{userId}/pet-sitter")
    public ResponseEntity<List<PetSitterPostVO>> getMyPetSitterPosts(@PathVariable int userId) {
        return ResponseEntity.ok(myActivityService.getMyPetSitterPosts(userId));
    }

    /**
     * 내가 쓴 리뷰 목록
     * GET /api/my/{userId}/reviews
     */
    @GetMapping("/{userId}/reviews")
    public ResponseEntity<List<ReviewVO>> getMyReviews(@PathVariable int userId) {
        return ResponseEntity.ok(myActivityService.getMyReviews(userId));
    }
}