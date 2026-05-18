package com.ggori_salang.backend.vo;


import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class PetSitterPostVO {
    private int postId;
    private int userId;
    private String nickname;  // 작성자 닉네임 (JOIN)
    private String title;
    private String content;
    private String region;
    private int viewCount;
    private Date createdAt;
    private List<String> imageUrls;  // Firebase URL 목록
}