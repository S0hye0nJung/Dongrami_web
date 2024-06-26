package com.lec.repository;

import org.springframework.data.repository.CrudRepository;

import com.lec.entity.Comment;

import java.util.List;

public interface CommentRepository extends CrudRepository<Comment, Integer> {
    List<Comment> findByUserId(String userId);
}
