package com.ggori_salang.backend.controller.admin;

import com.ggori_salang.backend.Service.PetSitterService;
import com.ggori_salang.backend.Service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final PostService postService;
    private final PetSitterService petSitterService;

    // 자유게시판 목록
    @GetMapping("/free")
    public String freePostList(Model model) {
        model.addAttribute("posts", postService.getPostList());
        return "admin/free-post-list";
    }

    // 자유게시판 글 삭제
    @PostMapping("/free/delete/{postId}")
    public String deleteFreePost(@PathVariable int postId) {
        postService.deletePostByAdmin(postId); // 변경
        return "redirect:/admin/posts/free";
    }

    // 펫시터 게시판 목록
    @GetMapping("/petsitter")
    public String petSitterList(Model model) {
        model.addAttribute("posts", petSitterService.getSitterList());
        return "admin/petsitter-list";
    }

    // 펫시터 글 삭제
    @PostMapping("/petsitter/delete/{postId}")
    public String deletePetSitterPost(@PathVariable int postId) {
        petSitterService.deleteSitterPostByAdmin(postId); // 변경
        return "redirect:/admin/posts/petsitter";
    }
}