package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.PostCommentService;
import com.ggori_salang.backend.vo.PostCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments") // 프론트엔드 호출 기본 주소에 맞춤
@RequiredArgsConstructor
public class PostCommentController {

    private final PostCommentService postCommentService;

    /**
     * 자유게시판 댓글 목록 조회
     * 프론트엔드 호출: GET /api/comments/post/{id}
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<PostCommentVO>> getComments(@PathVariable int postId) {
        return ResponseEntity.ok(postCommentService.getComments(postId));
    }

    /**
     * 자유게시판 댓글 작성
     * 프론트엔드 호출: POST /api/comments
     * Body: { "postId": 1, "userId": 1, "content": "내용" }
     */
    @PostMapping
    public ResponseEntity<?> writeComment(@RequestBody PostCommentVO comment) {
        // 프론트엔드에서 이미 JSON Body에 postId를 담아 보내므로 @PathVariable 없이 처리
        boolean isSuccess = postCommentService.writeComment(comment);

        if (isSuccess) {
            // 프론트엔드에서 response.data를 사용하므로 성공 시 VO 객체나 생성된 데이터를 반환하는 것이 좋습니다.
            return ResponseEntity.ok(comment);
        } else {
            return ResponseEntity.badRequest().body("댓글 작성 실패");
        }
    }

    /**
     * 자유게시판 댓글 삭제
     * DELETE /api/comments/{commentId}
     * (프론트엔드에 삭제 요청 코드가 추가될 경우를 대비한 표준 경로)
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable int commentId,
                                                Authentication authentication) {
        try {
            // SecurityContext에서 userId를 꺼내는 로직 (기존 유지)
            int userId = (int) authentication.getPrincipal();
            boolean isSuccess = postCommentService.deleteComment(commentId, userId);

            return isSuccess
                    ? ResponseEntity.ok("댓글 삭제 성공")
                    : ResponseEntity.badRequest().body("본인 댓글만 삭제할 수 있습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 오류 발생");
        }
    }
}