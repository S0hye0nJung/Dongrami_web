package com.lec.Impl;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lec.dto.CommentDTO;
import com.lec.entity.Comment;
import com.lec.repository.CommentRepository;
import com.lec.service.CommentService;

import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public List<CommentDTO> getCommentsByUserId(String userId) {
        List<Comment> comments = commentRepository.findByUserId(userId);
        return comments.stream()
                       .map(CommentDTO::new)
                       .collect(Collectors.toList());
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setUserId(commentDTO.getUserId());
        comment.setVoteId(commentDTO.getVoteId());
        comment.setContent(commentDTO.getContent());
        comment.setReplyCreate(new Date());
        comment.setReplyModify(new Date());
        comment.setParentId(commentDTO.getParentId());
        comment = commentRepository.save(comment);
        return new CommentDTO(comment);
    }

    @Override
    public CommentDTO updateComment(CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(commentDTO.getCommentId()).orElseThrow();
        comment.setContent(commentDTO.getContent());
        comment.setReplyModify(new Date());
        comment = commentRepository.save(comment);
        return new CommentDTO(comment);
    }

    @Override
    public void deleteComment(Integer id) {
        commentRepository.deleteById(id);
    }
}
