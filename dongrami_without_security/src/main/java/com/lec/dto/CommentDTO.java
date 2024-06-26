package com.lec.dto;

import java.util.Date;

import com.lec.entity.Comment;

public class CommentDTO {
    private Integer commentId;
    private String userId;
    private Integer voteId;
    private String content;
    private Date replyCreate;
    private Date replyModify;
    private Integer parentId;

    // 기본 생성자
    public CommentDTO() {}

    // Comment 객체를 받아들이는 생성자
    public CommentDTO(Comment comment) {
        this.commentId = comment.getCommentId();
        this.userId = comment.getUserId();
        this.voteId = comment.getVoteId();
        this.content = comment.getContent();
        this.replyCreate = comment.getReplyCreate();
        this.replyModify = comment.getReplyModify();
        this.parentId = comment.getParentId();
    }

    // Getter 및 Setter 메서드
    public Integer getCommentId() { return commentId; }
    public void setCommentId(Integer commentId) { this.commentId = commentId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Integer getVoteId() { return voteId; }
    public void setVoteId(Integer voteId) { this.voteId = voteId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getReplyCreate() { return replyCreate; }
    public void setReplyCreate(Date replyCreate) { this.replyCreate = replyCreate; }

    public Date getReplyModify() { return replyModify; }
    public void setReplyModify(Date replyModify) { this.replyModify = replyModify; }

    public Integer getParentId() { return parentId; }
    public void setParentId(Integer parentId) { this.parentId = parentId; }
}
