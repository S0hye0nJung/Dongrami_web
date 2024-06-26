package com.lec.entity;

import javax.persistence.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "vote_id")
    private Integer voteId;

    @Column(name = "content")
    private String content;

    @Column(name = "reply_create")
    private Date replyCreate;

    @Column(name = "reply_modify")
    private Date replyModify;

    @Column(name = "parent_id")
    private Integer parentId;

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
