package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.PetSitterCommentService;
import com.ggori_salang.backend.vo.PetSitterCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pet-sitter/{postId}/comments")
@RequiredArgsConstructor
public class PetSitterCommentController {

    private final PetSitterCommentService petSitterCommentService;

    /**
     * 펫시터 댓글 목록 조회
     * GET /api/pet-sitter/{postId}/comments
     */
    @GetMapping
    public ResponseEntity<List<PetSitterCommentVO>> getComments(@PathVariable int postId) {
        return ResponseEntity.ok(petSitterCommentService.getComments(postId));
    }

    /**
     * 펫시터 댓글 작성
     * POST /api/pet-sitter/{postId}/comments
     * body: { "userId": 1, "content": "댓글 내용" }
     */
    @PostMapping
    public ResponseEntity<String> write(@PathVariable int postId, @RequestBody PetSitterCommentVO vo) {
        vo.setPostId(postId);
        boolean isSuccess = petSitterCommentService.writeComment(vo);
        return isSuccess
                ? ResponseEntity.ok("댓글 작성 성공")
                : ResponseEntity.badRequest().body("댓글 작성 실패");
    }

    /**
     * 펫시터 댓글 삭제
     * DELETE /api/pet-sitter/{postId}/comments/{commentId}
     */
    // delete 수정
    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> delete(@PathVariable int postId,
                                         @PathVariable int commentId,
                                         Authentication authentication) {
        int userId = (int) authentication.getPrincipal();
        boolean isSuccess = petSitterCommentService.deleteComment(commentId, userId);
        return isSuccess
                ? ResponseEntity.ok("댓글 삭제 성공")
                : ResponseEntity.badRequest().body("본인 댓글만 삭제할 수 있습니다.");
    }
}