package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.PetSitterService;
import com.ggori_salang.backend.vo.PetSitterPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pet-sitter")
@RequiredArgsConstructor
public class PetSitterPostController {

    private final PetSitterService petSitterService;

    /**
     * 펫시터 게시글 목록 조회
     * GET /api/pet-sitter
     */
    @GetMapping
    public ResponseEntity<List<PetSitterPostVO>> getList() {
        return ResponseEntity.ok(petSitterService.getSitterList());
    }

    /**
     * 펫시터 게시글 상세 조회 (조회수 증가 포함)
     * GET /api/pet-sitter/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable int postId) {
        return ResponseEntity.ok(petSitterService.getSitterDetail(postId));
    }

    /**
     * 펫시터 게시글 작성 (이미지 URL 포함)
     * POST /api/pet-sitter
     * body: {
     *   "userId": 1,
     *   "title": "제목",
     *   "content": "내용",
     *   "region": "서울",
     *   "imageUrls": ["https://firebase.../img1.jpg"]
     * }
     */
    @PostMapping
    public ResponseEntity<String> write(@RequestBody PetSitterPostVO post) {
        boolean isSuccess = petSitterService.writeSitterPost(post);
        return isSuccess
                ? ResponseEntity.ok("게시글 작성 성공")
                : ResponseEntity.badRequest().body("게시글 작성 실패");
    }

    /**
     * 펫시터 게시글 수정
     * PUT /api/pet-sitter/{postId}
     */
    // update 수정
    @PutMapping("/{postId}")
    public ResponseEntity<String> update(@PathVariable int postId,
                                         @RequestBody PetSitterPostVO post,
                                         Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        post.setPostId(postId);
        post.setUserId(userId);
        boolean isSuccess = petSitterService.updateSitterPost(post);
        return isSuccess
                ? ResponseEntity.ok("게시글 수정 성공")
                : ResponseEntity.badRequest().body("본인 게시글만 수정할 수 있습니다.");
    }

    /**
     * 펫시터 게시글 삭제
     * DELETE /api/pet-sitter/{postId}
     */
    // delete 수정
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> delete(@PathVariable int postId,
                                         Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        boolean isSuccess = petSitterService.deleteSitterPost(postId, userId);
        return isSuccess
                ? ResponseEntity.ok("게시글 삭제 성공")
                : ResponseEntity.badRequest().body("본인 게시글만 삭제할 수 있습니다.");
    }
}