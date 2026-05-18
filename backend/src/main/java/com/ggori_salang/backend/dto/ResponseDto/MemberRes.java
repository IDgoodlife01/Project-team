package com.ggori_salang.backend.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MemberRes {
        private Long id;
        private String username;
        private String nickname;
        private String role;
        private LocalDateTime createAt;

        // Entity -> Response
        public static MemberRes of(MemberRes entity) {
                return new MemberRes(entity.getId(), entity.getUsername(),
                        entity.getNickname(), entity.getRole(), entity.getCreateAt());
        }
}
