package com.ggori_salang.backend.dao;

import com.ggori_salang.backend.vo.PetVO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PetDAO {
    private final JdbcTemplate jdbcTemplate;

    public List<PetVO> findByUserId(int userId) {
        String sql = "SELECT * FROM USER_PETS WHERE user_id = ?";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(PetVO.class), userId);
    }

    public int insertPet(PetVO pet) {
        String sql = "INSERT INTO USER_PETS (pet_id, user_id, pet_name, pet_type, breed, size_type, weight, description) " +
                "VALUES (SEQ_USER_PET.NEXTVAL, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                pet.getUserId(), pet.getPetName(), pet.getPetType(),
                pet.getBreed(), pet.getSizeType(), pet.getWeight(),
                pet.getDescription());
    }

    public int updatePet(PetVO pet) {
        String sql = "UPDATE USER_PETS SET pet_name=?, pet_type=?, breed=?, size_type=?, weight=?, description=? " +
                "WHERE pet_id=?";
        return jdbcTemplate.update(sql,
                pet.getPetName(), pet.getPetType(), pet.getBreed(),
                pet.getSizeType(), pet.getWeight(), pet.getDescription(),
                pet.getPetId());
    }

    public int deletePet(int petId) {
        return jdbcTemplate.update("DELETE FROM USER_PETS WHERE pet_id=?", petId);
    }
}