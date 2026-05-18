package com.ggori_salang.backend.dto;

import lombok.Data;

@Data
public class UserMyPageDTO {
    // 집사 정보
    private int userId;
    private String nickname;
    private String phone;
    private String password; // 비번 변경 시에만 사용

    // 강아지 정보 (단일 객체로 처리)
    private String petName;
    private String breed;
    private String sizeType;
    private String description;
}