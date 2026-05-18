package com.ggori_salang.backend.vo;


import lombok.Data;
import java.util.Date;

@Data
public class FavoriteVO {
    private int favoriteId;
    private int userId;
    private int cafeId;
    private Date createdAt;
    // 즐겨찾기 목록 조회 시 카페 정보도 함께
    private String cafeName;
    private String address;
    private double rating;
    private String imageUrl;  // 카페 대표 이미지 1장
}
