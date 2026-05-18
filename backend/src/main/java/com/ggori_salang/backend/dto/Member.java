package com.ggori_salang.backend.dto;

import lombok.*;

//@Getter
//@Setter
//@EqualsAndHashCode //equals와 hashcode
//@RequiredArgsConstructor // final 필드 생성자

@Data
public class Member {
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String role;
}
