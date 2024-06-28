package com.lec.Impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lec.dto.MemberDTO;
import com.lec.entity.Member;
import com.lec.repository.MemberRepository;
import com.lec.service.MemberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MemberServiceImpl implements MemberService {

    private static final Logger logger = LoggerFactory.getLogger(MemberServiceImpl.class);

    @Autowired
    MemberRepository memberrepository;

    @Override
    public String join(MemberDTO memberDTO) throws ParseException {

        Member member = memberDTO.toEntity();

        String userId = generateString();
        Date createDate = getCurrentDate();

        member.setUserId(userId);

        return "index"; // 회원 가입 완료 후 반환되는 템플릿 명
    }

    @Override
    public Date getCurrentDate() throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = dateFormat.format(new Date());
        return dateFormat.parse(dateString);
    }

    @Override
    public String generateString() {
        Random random = new Random();
        String source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return generateRandomString(source, 10, random);
    }

    @Override
    public String generateRandomString(String source, int length, Random random) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(source.length());
            sb.append(source.charAt(randomIndex));
        }
        return sb.toString();
    }

    @Override
    public Optional<Member> getMemberById(String userId) {
        // TODO Auto-generated method stub
        return Optional.empty();
    }

    // 추가된 메서드
    @Override
    public Member findByNickname(String nickname) {
        logger.debug("Searching for Member with nickname: {}", nickname);
        return memberrepository.findByNickname(nickname);
    }
}
