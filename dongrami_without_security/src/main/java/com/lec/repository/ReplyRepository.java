package com.lec.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.lec.entity.Reply;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {
}
