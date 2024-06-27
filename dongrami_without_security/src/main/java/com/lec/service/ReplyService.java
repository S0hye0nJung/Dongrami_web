//package com.lec.service;
//
//import com.lec.dto.ReplyDTO;
//import com.lec.entity.Reply;
//import com.lec.entity.Vote;
//import com.lec.repository.ReplyRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class ReplyService {
//    
//    @Autowired
//    private ReplyRepository replyRepository;
//    public List<Reply> getRepliesForVote(int voteId) {
//        return replyRepository.findByVoteIdOrderByParentReIdAscReplyCreateAsc(voteId);
//    }
//
//    public Reply addReply(Reply reply) {
//        reply.setReplyCreate(LocalDate.now());
//        return replyRepository.save(reply);
//    }
//
//    public List<ReplyDTO> buildReplyTree(List<Reply> replies) {
//        Map<Long, ReplyDTO> replyMap = new HashMap<>();
//        List<ReplyDTO> topLevelReplies = new ArrayList<>();
//
//        for (Reply reply : replies) {
//            ReplyDTO dto = convertToDto(reply);
//            replyMap.put((long) dto.getReplyId(), dto);
//
//            if (reply.getLevel() == 1) {
//                topLevelReplies.add(dto);
//            } else {
//                ReplyDTO parent = replyMap.get(reply.getParentReId());
//                if (parent != null) {
//                    parent.getChildren().add(dto);
//                }
//            }
//        }
//
//        return topLevelReplies;
//    }
//
//    private ReplyDTO convertToDto(Reply reply) {
//    	return new ReplyDTO(reply);
//    }
//}
