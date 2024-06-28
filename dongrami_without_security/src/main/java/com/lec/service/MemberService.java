package com.lec.service;

import java.text.ParseException;
import java.util.Date;
import java.util.Random;

import com.lec.dto.MemberDTO;

public interface MemberService {
	
	String join(MemberDTO memberDTO)throws ParseException;
	Date getCurrentDate() throws ParseException;
	String generateString();
	String generateRandomString(String source, int length, Random random);
	

}
