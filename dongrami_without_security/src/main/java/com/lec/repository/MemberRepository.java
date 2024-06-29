package com.lec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lec.entity.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, String>{
  
    // 추가된 메서드
    Member findByNickname(String nickname);
}

