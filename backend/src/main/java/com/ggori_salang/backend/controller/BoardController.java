package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.PostService;
import com.ggori_salang.backend.Service.PetSitterService;
import com.ggori_salang.backend.Service.ReviewService;
import com.ggori_salang.backend.vo.PostVO;
import com.ggori_salang.backend.vo.PetSitterPostVO;
import com.ggori_salang.backend.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final PostService postService;
    private final PetSitterService petSitterService;
    private final ReviewService reviewService;

    // 자유게시판 전체 목록
    @GetMapping("/posts")
    public ResponseEntity<List<PostVO>> getAllPosts() {
        return ResponseEntity.ok(postService.getPostList());
    }

    // 펫시터 전체 목록
    @GetMapping("/petsitter")
    public ResponseEntity<List<PetSitterPostVO>> getAllPetSitter() {
        return ResponseEntity.ok(petSitterService.getSitterList());
    }

    // 리뷰 전체 목록
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewVO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getReviewList());
    }
}