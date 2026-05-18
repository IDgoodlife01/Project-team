package com.ggori_salang.backend.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUser extends User {
    private final Long memberId;  // 세션에 memberId를 함께 저장

    public CustomUser(Member member, Collection<? extends GrantedAuthority> authorities) {
        super(member.getUsername(), member.getPassword(), authorities);
        this.memberId = member.getId();
    }

    public Long getMemberId() {
        return memberId;
    }

}