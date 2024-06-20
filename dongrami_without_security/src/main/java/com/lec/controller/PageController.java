package com.lec.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    @GetMapping("/comments")
    public String commentsPage() {
        return "comments";
    }
    
    @GetMapping("/result")
    public String resultPage() {
        return "result";
    }
    
    @GetMapping("/review")
    public String reviewPage() {
        return "review";
    }
    
    @GetMapping("/mypage")
    public String myPage() {
        return "mypage";
    }
    
    @GetMapping("/")
    public String indexPage() {
        return "index";
    }
    
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
    
    @GetMapping("/topic")
    public String topicPage() {
        return "topicpage";
    }
    
    @GetMapping("/vote")
    public String votePage() {
        return "votepage";
    }
    
    
}