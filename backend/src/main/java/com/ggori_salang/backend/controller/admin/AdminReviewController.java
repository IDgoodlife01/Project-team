package com.ggori_salang.backend.controller.admin;

import com.ggori_salang.backend.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;

    // 리뷰 목록
    @GetMapping
    public String reviewList(Model model) {
        model.addAttribute("reviews", reviewService.getReviewList());
        return "admin/review-list";
    }

    // 리뷰 삭제
    @PostMapping("/delete/{reviewId}")
    public String deleteReview(@PathVariable int reviewId) {
        reviewService.deleteReviewByAdmin(reviewId); // 변경
        return "redirect:/admin/reviews";
    }
}
