package com.lec.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lec.entity.Member;
import com.lec.entity.Reply;
import com.lec.entity.Vote;
import com.lec.repository.ReplyRepository;

@Service
@Transactional
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    public Reply saveReply(String content, int level, int parentReId, Vote vote, Member member) {
        Reply reply = Reply.builder()
                .content(content)
                .level(level)
                .replyCreate(LocalDate.now())
                .parentReId(parentReId)
                .vote(vote)
                .member(member)
                .build();
        return replyRepository.save(reply);
    }

    public Optional<Reply> findReplyById(int replyId) {
        return replyRepository.findById(replyId);
    }

    public List<Reply> findAllRepliesByVote(Vote vote) {
        return replyRepository.findAll();
    }

    public void deleteReply(int replyId) {
        replyRepository.deleteById(replyId);
    }

    public Reply updateReply(int replyId, String content) {
        Optional<Reply> optionalReply = replyRepository.findById(replyId);
        if (optionalReply.isPresent()) {
            Reply reply = optionalReply.get();
            reply.setContent(content);
            reply.setReplyModify(LocalDate.now());
            return replyRepository.save(reply);
        }
        return null;
    }

	public Optional<Reply> getReplyById(int id) {
		 return replyRepository.findById(id);
	}

	public List<Reply> getAllReplies() {
	    return replyRepository.findAll();
		
	}

	public Reply saveReply(Reply newReply) {
		// TODO Auto-generated method stub
		 return replyRepository.save(newReply);
	}


}
