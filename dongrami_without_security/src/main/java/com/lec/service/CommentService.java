package com.lec.service;

import java.util.List;

import com.lec.dto.CommentDTO;

public interface CommentService {
    List<CommentDTO> getCommentsByUserId(String userId);
    CommentDTO createComment(CommentDTO commentDTO);
    CommentDTO updateComment(CommentDTO commentDTO);
    void deleteComment(Integer id);
}
