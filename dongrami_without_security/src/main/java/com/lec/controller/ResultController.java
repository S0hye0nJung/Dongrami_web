package com.lec.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.lec.Impl.ResultServiceImpl;
import com.lec.dto.WebReadingDTO;
import com.lec.entity.WebReading;
import com.lec.entity.Subcategory;
import com.lec.service.SubcategoryService;

@Controller
public class ResultController {

    @Autowired
    ResultServiceImpl resultService;

    @Autowired
    SubcategoryService subcategoryService;

    @GetMapping("/result_three")
    public String showResult(@RequestParam("subcategory_id") int subcategoryId, Model model) {
        WebReadingDTO webReading = resultService.getReading(subcategoryId);
        System.out.println("세 개의 해석 : " + webReading + "타입 : " + webReading.getClass().getName());
        model.addAttribute("reading", webReading);
        return "result_three";
    }

    @GetMapping("/result_one")
    public String showOne(@RequestParam("subcategory_id") int subcategoryId, Model model) {
        List<WebReadingDTO> webReading = resultService.getOneCardReadings(subcategoryId);
        System.out.println("한 개의 해석 : " + webReading+ "타입 : " + webReading.getClass().getName());
        model.addAttribute("webReading", webReading);
        return "result_one";
    }

    @GetMapping("/api/subcategory/{subcategoryId}")
    public ResponseEntity<Subcategory> getSubcategory(@PathVariable("subcategoryId") int subcategoryId) {
        Optional<Subcategory> subcategory = subcategoryService.findById(subcategoryId);
        return subcategory.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
