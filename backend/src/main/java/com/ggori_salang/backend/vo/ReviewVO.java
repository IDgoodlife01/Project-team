package com.ggori_salang.backend.vo;


import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class ReviewVO {
    private int reviewId;
    private int userId;
    private String nickname;
    private int cafeId;       // 추가
    private String cafeName;  // JOIN으로 가져옴 (DB 컬럼 아님)
    private String title;
    private String content;
    private int rating;
    private int viewCount;
    private Date createdAt;
    private List<String> imageUrls;
}