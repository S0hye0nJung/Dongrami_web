package com.lec.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.lec.dto.MyTarotListDTO;
import com.lec.service.MyTarotListService;

@RestController
public class MyTarotListController {

    @Autowired
    private MyTarotListService myTarotListService;

    @GetMapping("/my-tarot-list")
    public List<MyTarotListDTO> getMyTarotList() {
        return myTarotListService.getAllMyTarotList();
    }
    
    // 댓글 삭제 엔드포인트
    @DeleteMapping("/delete-comment/{id}")
    public void deleteComment(@PathVariable("id") Integer commentId) {
        myTarotListService.deleteComment(commentId);
    }
}