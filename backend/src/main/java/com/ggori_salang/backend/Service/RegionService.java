package com.ggori_salang.backend.Service;


import com.ggori_salang.backend.dao.RegionDAO;
import com.ggori_salang.backend.vo.RegionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {
    private final RegionDAO regionDAO;

    public List<RegionVO> getRegionList() {
        return regionDAO.findAll();
    }
}
