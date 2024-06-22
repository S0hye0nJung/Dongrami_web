package com.lec.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lec.dto.WebReadingDTO;
import com.lec.entity.WebReading;
import com.lec.repository.CardRepository;
import com.lec.repository.ResultRepository;
import com.lec.repository.SubcategoryRepository;

@Service
public class ResultServiceImpl {

    @Autowired
    ResultRepository resultRepository;

    @Autowired
    SubcategoryRepository subcategoryRepository;

    @Autowired
    CardRepository cardRepository;

    public List<WebReadingDTO> getRandomCardReadings() {
        List<Object[]> results = resultRepository.findRandomCardReadings();
        return results.stream()
            .map(this::mapToWebReadingDTO)
            .collect(Collectors.toList());
    }

    private WebReadingDTO mapToWebReadingDTO(Object[] result) {
        WebReadingDTO dto = new WebReadingDTO();
        dto.setWebReadingId((Integer) result[0]);
        dto.setReading1((String) result[1]);
        dto.setReading2((String) result[2]);
        dto.setReading3((String) result[3]);
        dto.setReading1Title((String) result[4]);
        dto.setReading2Title((String) result[5]);
        dto.setReading3Title((String) result[6]);
        
        // Subcategory와 Card 설정
        Integer subcategoryId = (Integer) result[7];
        Integer cardId = (Integer) result[8];
        dto.setSubcategory(subcategoryRepository.findById(subcategoryId).orElse(null));
        dto.setCard(cardRepository.findById(cardId).orElse(null));

        dto.setImageUrl1((String) result[9]);
        dto.setImageUrl2((String) result[10]);
        dto.setImageUrl3((String) result[11]);

        return dto;
    }
}
