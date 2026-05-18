package com.ggori_salang.backend.vo;

import lombok.Data;
import java.util.Date;

@Data
public class UserVO {
    private int userId;
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String role;
    private Date createdAt;
}