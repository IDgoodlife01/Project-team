package com.ggori_salang.backend.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseDto<T> {
    private boolean success; // 성공 여부
    private String message;  // 화면에 띄울 메시지
    private T data;          // 실제 전달할 데이터 (없으면 null)
}