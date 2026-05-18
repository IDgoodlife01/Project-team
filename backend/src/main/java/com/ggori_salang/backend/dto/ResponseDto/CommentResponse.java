package com.ggori_salang.backend.dto.ResponseDto;

import com.ggori_salang.backend.dto.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CommentResponse {
    private Long          id;
    private String        content;
    private String        writer;     // JOIN으로 가져온 작성자 닉네임
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment, String writer) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                writer,
                comment.getCreatedAt()
        );
    }
}