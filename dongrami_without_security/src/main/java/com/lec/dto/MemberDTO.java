package com.lec.dto;

import com.lec.entity.Member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class MemberDTO {
	
	@NotEmpty(message = "이메일은 필수 입력입니다.")
    private String email;

    @NotEmpty(message = "")
    private String password;

    @NotEmpty
    private String password2;

    @NotEmpty
    private String nickname;

    private String phoneNumber;

    @NotEmpty
    private String birthYear;

    @NotEmpty
    private String birthMonth;

    @NotEmpty
    private String birthDay;

    private String gender;
    
    public Member toEntity() {
      return Member.builder()
    		  .email(email)
    		  .nickname(nickname)
    		  .phoneNumber(phoneNumber)
    		  .gender(gender)
    		  .build();
    		  
    }

}
