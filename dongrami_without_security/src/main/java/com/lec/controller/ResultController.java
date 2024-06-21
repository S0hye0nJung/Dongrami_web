package com.lec.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.lec.Impl.ResultServiceImpl;
import com.lec.dto.WebReadingDTO;
import com.lec.entity.WebReading;


@Controller
public class ResultController {
	
	@Autowired
	ResultServiceImpl resultService;
	
	@GetMapping("/result_three")
	public String showResult(Model model) {
        List<WebReadingDTO> webReadings = resultService.getRandomCardReadings();
        model.addAttribute("webReadings", webReadings);
        return "result_three";
	}

}
