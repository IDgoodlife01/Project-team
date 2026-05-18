package com.ggori_salang.backend.controller;

import com.ggori_salang.backend.Service.PetService;
import com.ggori_salang.backend.vo.PetVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    /**
     * 내 반려동물 목록 조회
     * GET /api/pets/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<PetVO>> getMyPets(@PathVariable int userId) {
        return ResponseEntity.ok(petService.getMyPets(userId));
    }

    /**
     * 반려동물 등록
     * POST /api/pets
     */
    @PostMapping
    public ResponseEntity<String> registerPet(@RequestBody PetVO pet) {
        boolean isSuccess = petService.registerPet(pet);
        return isSuccess
                ? ResponseEntity.ok("반려동물 등록 성공")
                : ResponseEntity.badRequest().body("반려동물 등록 실패");
    }

    /**
     * 반려동물 정보 수정
     * PUT /api/pets/{petId}
     */
    @PutMapping("/{petId}")
    public ResponseEntity<String> updatePet(@PathVariable int petId, @RequestBody PetVO pet) {
        pet.setPetId(petId);
        boolean isSuccess = petService.updatePet(pet);
        return isSuccess
                ? ResponseEntity.ok("반려동물 수정 성공")
                : ResponseEntity.badRequest().body("반려동물 수정 실패");
    }

    /**
     * 반려동물 삭제
     * DELETE /api/pets/{petId}
     */
    @DeleteMapping("/{petId}")
    public ResponseEntity<String> deletePet(@PathVariable int petId) {
        boolean isSuccess = petService.deletePet(petId);
        return isSuccess
                ? ResponseEntity.ok("반려동물 삭제 성공")
                : ResponseEntity.badRequest().body("반려동물 삭제 실패");
    }
}