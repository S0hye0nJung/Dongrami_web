package com.lec.repository;

import com.lec.entity.Reply;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {
   List<Reply> findByVoteIdOrderByParentReIdAscReplyCreateAsc(int voteId);
}
