package com.lec.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TopicController {
	
	@GetMapping("/tarot")
	public String rematch() {
		return "tarot";
	}
	
	@GetMapping("/lover")
	public String lover() {
		return "lover";
	}
	
	@GetMapping("/reMeet")
	public String reMeet() {
		return "reMeet";
	}
	
	@GetMapping("/coin")
	public String coin() {
		return "coin";
	}
	
	@GetMapping("/stock")
	public String stock() {
		return "stock";
	}
	
	@GetMapping("/stock_sell")
	public String stock_sell() {
		return "stock_sell";
	}
	
	@GetMapping("/turnover")
	public String turnover() {
		return "turnover";
	}
	
	@GetMapping("/sangsa")
	public String sangsa() {
		return "sangsa";
	}
	
	@GetMapping("/golden")
	public String golden() {
		return "golden";
	}
	

}
