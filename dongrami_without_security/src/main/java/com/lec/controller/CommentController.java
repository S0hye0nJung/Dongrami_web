package com.lec.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lec.dto.CommentDTO;
import com.lec.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 사용자 댓글 가져오기
    @GetMapping("/mine")
    public ResponseEntity<List<CommentDTO>> getCommentsByUserId(@RequestParam(name = "userId") String userId) {
        List<CommentDTO> comments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 작성
    @PostMapping("/create")
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO) {
        CommentDTO createdComment = commentService.createComment(commentDTO);
        return ResponseEntity.ok(createdComment);
    }

    // 댓글 수정
    @PostMapping("/update")
    public ResponseEntity<CommentDTO> updateComment(@RequestBody CommentDTO commentDTO) {
        CommentDTO updatedComment = commentService.updateComment(commentDTO);
        return ResponseEntity.ok(updatedComment);
    }

    // 댓글 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
