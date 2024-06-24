package com.lec.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.Builder;

@Entity
@Table(name = "reply")
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private int replyId;

    @Column(name = "content", nullable = false, length = 255)
    private String content;

    @Column(name = "level", nullable = false)
    private int level;

    @Column(name = "reply_create", nullable = false)
    private Date replyCreate;

    @Column(name = "reply_modify")
    private Date replyModify;

    @Column(name = "parent_re_id", nullable = false)
    private int parentReId;

    @ManyToOne
    @JoinColumn(name = "vote_id", nullable = false)
    private Vote vote;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @Builder
	public Comments(int replyId, String content, int level, Date replyCreate, Date replyModify, int parentReId, Vote vote,
			Member member) {
		super();
		this.replyId = replyId;
		this.content = content;
		this.level = level;
		this.replyCreate = replyCreate;
		this.replyModify = replyModify;
		this.parentReId = parentReId;
		this.vote = vote;
		this.member = member;
	}

    
}
