package com.ggori_salang.backend.vo;


import lombok.Data;
import java.util.List;

@Data
public class CafeVO {
    private int cafeId;
    private int regionId;
    private String cafeName;
    private String address;
    private String phone;
    private String description;
    private String allowedPetTypes;  // "소형견,중형견,고양이"
    private double maxWeight;
    private double rating;
    private int favoriteCount;
    private Double latitude;
    private Double longitude;
    private List<String> imageUrls;  // Firebase URL 목록
    private String naverMapUrl;  // 추가
}