package com.lec.service;

import java.text.ParseException;
import java.util.Date;
import java.util.Random;
import java.util.Optional;

import com.lec.dto.MemberDTO;
import com.lec.entity.Member;

public interface MemberService {
	
	String join(MemberDTO memberDTO)throws ParseException;
	Date getCurrentDate() throws ParseException;
	String generateString();
	String generateRandomString(String source, int length, Random random);
	Optional<Member> getMemberById(String userId);

    // 추가된 메서드
    Member findByNickname(String nickname);
}


