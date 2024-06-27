//package com.lec.controller;
//
//import com.lec.dto.ReplyDTO;
//import com.lec.entity.Reply;
//import com.lec.service.ReplyService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@Controller
//public class ReplyController {
//
//    @Autowired
//    private ReplyService replyService;
//    private ReplyDTO ReplyDTO;
//
//    @GetMapping("/vote/{voteId}/replies")
//    public String getReplies(@PathVariable int voteId, Model model) {
//        List<Reply> replies = replyService.getRepliesForVote(voteId);
//        List<ReplyDTO> replyTree = replyService.buildReplyTree(replies);
//        model.addAttribute("replies", replyTree);
//        return "replyView";
//    }
//
//    @PostMapping("/reply/add")
//    public String addReply(@ModelAttribute Reply reply) {
//        replyService.addReply(reply);
//        return "redirect:/vote/" + reply.getVote().getVoteId() + "/replies";
//    }
//}
