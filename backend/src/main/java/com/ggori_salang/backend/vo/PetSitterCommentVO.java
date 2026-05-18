package com.ggori_salang.backend.vo;


import lombok.Data;
import java.util.Date;

@Data
public class PetSitterCommentVO {
    private int commentId;
    private int postId;
    private int userId;
    private String nickname;  // 작성자 닉네임 (JOIN)
    private String content;
    private Date createdAt;
}
