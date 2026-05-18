package com.ggori_salang.backend.controller.admin;

import com.ggori_salang.backend.Service.CafeService;
import com.ggori_salang.backend.Service.RegionService;
import com.ggori_salang.backend.vo.CafeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/cafes")
@RequiredArgsConstructor
public class AdminCafeController {

    private final CafeService cafeService;
    private final RegionService regionService;

    // 카페 목록 페이지
    @GetMapping
    public String cafeList(Model model) {
        model.addAttribute("cafes", cafeService.getAllCafes());
        return "admin/cafe-list";
    }

    // 카페 등록 폼
    // 카페 등록 폼
    @GetMapping("/add")
    public String addForm(Model model) {
        CafeVO cafe = new CafeVO();
        cafe.setCafeId(0);        // 추가
        cafe.setRegionId(0);      // 추가
        cafe.setMaxWeight(0.0);   // 추가
        cafe.setRating(0.0);      // 추가
        cafe.setFavoriteCount(0); // 추가
        cafe.setLatitude(0.0);    // 추가
        cafe.setLongitude(0.0);   // 추가
        model.addAttribute("cafe", cafe);
        model.addAttribute("regions", regionService.getRegionList());
        return "admin/cafe-form";
    }

    // 카페 등록 처리
    @PostMapping("/add")
    public String addCafe(@ModelAttribute CafeVO cafe) {
        cafeService.createCafe(cafe);
        return "redirect:/admin/cafes";
    }

    // 카페 수정 폼
    @GetMapping("/edit/{cafeId}")
    public String editForm(@PathVariable int cafeId, Model model) {
        model.addAttribute("cafe", cafeService.getCafeById(cafeId));
        model.addAttribute("regions", regionService.getRegionList());
        return "admin/cafe-form";
    }

    // 카페 수정 처리
    @PostMapping("/edit/{cafeId}")
    public String editCafe(@PathVariable int cafeId, @ModelAttribute CafeVO cafe) {
        cafe.setCafeId(cafeId);
        cafeService.updateCafe(cafe);
        return "redirect:/admin/cafes";
    }

    // 카페 삭제
    @PostMapping("/delete/{cafeId}")
    public String deleteCafe(@PathVariable int cafeId) {
        cafeService.deleteCafe(cafeId);
        return "redirect:/admin/cafes";
    }
}