package com.ggori_salang.backend.controller.admin;

import com.ggori_salang.backend.Service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    // 회원 목록 페이지
    @GetMapping
    public String userList(Model model) {
        model.addAttribute("users", adminUserService.getAllUsers());
        return "admin/user-list";
    }

    // 회원 삭제
    @PostMapping("/delete/{userId}")
    public String deleteUser(@PathVariable int userId) {
        adminUserService.deleteUser(userId);
        return "redirect:/admin/users";
    }
}
