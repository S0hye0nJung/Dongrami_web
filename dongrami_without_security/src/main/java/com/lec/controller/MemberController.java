package com.lec.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import com.lec.Impl.MemberServiceImpl;
import com.lec.dto.MemberDTO;

@Controller
public class MemberController {
	
	@Autowired
	MemberServiceImpl memberservice;
	
	@PostMapping("/join")
    public String join(MemberDTO memberDTO) throws ParseException {
    	return memberservice.join(memberDTO);
    }

}
