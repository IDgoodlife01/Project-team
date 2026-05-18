package com.ggori_salang.backend.vo;


import lombok.Data;

@Data
public class PetVO {
    private int petId;
    private int userId;
    private String petName;
    private String petType;   // 소형견, 중형견, 대형견, 고양이
    private String breed;
    private String sizeType;  // 소형견, 중형견, 대형견
    private double weight;
    private String description;
}