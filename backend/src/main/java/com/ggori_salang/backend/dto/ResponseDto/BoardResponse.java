package com.ggori_salang.backend.dto.ResponseDto;

import com.ggori_salang.backend.dto.Board;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

// dto/response/BoardResponse.java
// password 같은 민감 정보 없음, 화면에 필요한 필드만 포함
@Data
@AllArgsConstructor
public class BoardResponse {
    private Long          id;
    private String        title;
    private String        content;
    private String        writer;     // JOIN으로 가져온 작성자 닉네임
    private int           viewCount;
    private LocalDateTime createdAt;

    // Entity → ResponseDTO 변환 (정적 팩토리 메서드)
    public static BoardResponse from(Board board, String writer) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                writer,
                board.getViewCount(),
                board.getCreatedAt()
        );
    }
}