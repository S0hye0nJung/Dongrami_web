package com.lec.dto;

import java.util.Date;

import com.lec.entity.Comments;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CommentsDTO {

	private int replyId;
	
	private String content;
	
	private int level;
	
	private Date replyCreate;
	
	private Date replyModify;
	
	private int parentReId;
	
	private int voteId;
	
	private int userId;
	
	//날짜는 서비스에서 로직처리 해서 넣는 걸 권고
	public Comments toEntity() {
		return Comments.builder()
				.replyId(replyId)
				.content(content)
				.level(level)
				.parentReId(parentReId)
				.build();
	}
	
	
}
