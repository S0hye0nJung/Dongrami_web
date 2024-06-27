package com.lec.controller;

import com.lec.dto.ReplyDTO;
import com.lec.entity.Member;
import com.lec.entity.Reply;
import com.lec.entity.Vote;
import com.lec.service.MemberService;
import com.lec.service.ReplyService;
import com.lec.service.VoteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @Autowired
    private VoteService voteService;
    @Autowired
    private MemberService memberService;


    @PostMapping("/add/{voteId}")
    public ResponseEntity<ReplyDTO> addReply(@PathVariable int voteId,
                                             @RequestBody ReplyDTO request) {
        Optional<Vote> optionalVote = voteService.getVoteById(voteId);
        Optional<Member> optionalMember = memberService.getMemberById(request.getUserId());

        if (optionalVote.isPresent() && optionalMember.isPresent()) {
            Vote vote = optionalVote.get();
            Member member = optionalMember.get();

            Reply newReply = new Reply();
            newReply.setContent(request.getContent());
            newReply.setLevel(request.getLevel());
            newReply.setParentReId(request.getParentReId());
            newReply.setVote(vote);
            newReply.setMember(member);
            newReply.setReplyCreate(LocalDate.now());

            Reply savedReply = replyService.saveReply(newReply);

            ReplyDTO replyDTO = new ReplyDTO(savedReply);
            return ResponseEntity.ok(replyDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/votes/{voteId}")
    public List<Reply> getAllRepliesByVoteId(@PathVariable("voteId") int voteId) {
        Optional<Vote> optionalVote = voteService.getVoteById(voteId);
        if (optionalVote.isPresent()) {
            Vote vote = optionalVote.get();
            return replyService.findAllRepliesByVote(vote);
        } else {
            return Collections.emptyList(); // 빈 리스트 반환
        }
    }

    @GetMapping("/replies/{replyId}")
    public ResponseEntity<Reply> getReplyById(@PathVariable("replyId") int replyId) {
        Optional<Reply> optionalReply = replyService.getReplyById(replyId);
        if (optionalReply.isPresent()) {
            return new ResponseEntity<>(optionalReply.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/{replyId}")
    public ResponseEntity<Reply> updateReply(@PathVariable int replyId,
                                             @RequestParam String content) {
        Reply updatedReply = replyService.updateReply(replyId, content);
        if (updatedReply != null) {
            return ResponseEntity.ok(updatedReply);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable int replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }
}
