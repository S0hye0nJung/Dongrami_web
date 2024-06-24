package com.lec.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lec.entity.Vote;
import com.lec.repository.VoteRepository;
import com.lec.service.VoteService;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;
    
    private VoteRepository voteRepository;
    // 모든 투표 리스트 조회
    @GetMapping
    public List<Vote> getAllVotes() {
        return voteService.getAllVotes();
    }
    // 페이징
    public Page<Vote> getVotes(@RequestParam int page, @RequestParam int size) {
        return voteRepository.findAll(PageRequest.of(page, size));
    }

    // 특정 ID의 투표 조회
    @GetMapping("/{id}")
    public ResponseEntity<Vote> getVoteById(@PathVariable int id) {
        Optional<Vote> vote = voteService.getVoteById(id);
        return vote.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 투표 생성
    @PostMapping
    public ResponseEntity<Vote> createVote(@RequestBody Vote vote) {
        Vote createdVote = voteService.createVote(vote);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVote);
    }

    // 투표 업데이트
    @PutMapping("/{id}")
    public ResponseEntity<Vote> updateVote(@PathVariable int id, @RequestBody Vote vote) {
        if (voteService.getVoteById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        vote.setVoteId(id);
        Vote updatedVote = voteService.updateVote(vote);
        return ResponseEntity.ok(updatedVote);
    }

    // 투표 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVote(@PathVariable int id) {
        if (voteService.getVoteById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        voteService.deleteVote(id);
        return ResponseEntity.noContent().build();
    }
}

