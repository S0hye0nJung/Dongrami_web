// script.js

document.addEventListener("DOMContentLoaded", function() {
    const voteListDiv = document.getElementById('vote-list');

    // 서버에서 투표 리스트 가져오기
    fetch('/api/votes')
        .then(response => response.json())
        .then(data => {
            data.forEach(vote => {
                const voteDiv = createVoteElement(vote);
                voteListDiv.appendChild(voteDiv);
            });
        })
        .catch(error => console.error('Error fetching votes:', error));

    // Vote 엘리먼트 생성 함수
    function createVoteElement(vote) {
    const voteDiv = document.createElement('div');
    voteDiv.classList.add('vote-item');
    
    // 기존 요소 추가
    voteDiv.innerHTML = `
        <h2>${vote.question}</h2>
        <img src="${vote.voteImage}" alt="Vote Image">
        <p>${vote.option1}</p>
        <p>${vote.option2}</p>
    `;
	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('button-container');
	buttonContainer.innerHTML = `
		<button onclick="voteOption(${vote.voteId}, 'option1')">투표</button>
        <button onclick="voteOption(${vote.voteId}, 'option2')">투표</button>
	`;
	voteDiv.appendChild(buttonContainer);
    // 추가적인 요소들 추가
    const barContainer1 = document.createElement('div');
    barContainer1.classList.add('bar-container');
    barContainer1.id = 'barContainer1';
    barContainer1.innerHTML = `
        <div class="bar" id="bar1"></div>
        <span class="text-left" id="text1">A</span>
        <span class="percentage" id="percentage1"></span>
    `;
    voteDiv.appendChild(barContainer1);

    const barContainer2 = document.createElement('div');
    barContainer2.classList.add('bar-container');
    barContainer2.id = 'barContainer2';
    barContainer2.innerHTML = `
        <div class="bar" id="bar2"></div>
        <span class="text-left" id="text2">B</span>
        <span class="percentage" id="percentage2"></span>
    `;
    voteDiv.appendChild(barContainer2);
	
	const toggleContainer = document.createElement('div');
    toggleContainer.classList.add('toggle-container');
    toggleContainer.innerHTML = `
     	 <button id="toggleButton" onclick="toggleComment()">댓글 달기</button>
    `;
    voteDiv.appendChild(toggleContainer);
    
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('reply-container');
    replyContainer.innerHTML = `
     <button id="replyButton" >반응 보기</button>
    `;
    voteDiv.appendChild(replyContainer);
    
    return voteDiv;
	
     
}

function toggleComment() {
    const commentContainer = document.getElementById('comment-container');
    const toggleButton = document.getElementById('toggleButton');

    // 댓글 컨테이너 보이기/숨기기
    if (commentContainer.style.display === 'none' || commentContainer.style.display === '') {
        commentContainer.style.display = 'block';
        toggleButton.textContent = '댓글 닫기';
    } else {
        commentContainer.style.display = 'none';
        toggleButton.textContent = '댓글 달기';
    }
  }

    // 특정 옵션에 투표하는 함수
    function voteOption(voteId, option) {
        fetch(`/api/votes/${voteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ option: option }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to vote');
            }
            return response.json();
        })
        .then(updatedVote => {
            // 성공적으로 업데이트된 투표를 처리할 수 있음
            console.log('Vote successful:', updatedVote);
            // 예를 들어, 투표 엘리먼트 업데이트 등 추가 작업 가능
        })
        .catch(error => {
            console.error('Error voting:', error);
            // 오류 처리
        });
    }
});

 $(document).ready(function() {
    var lastSelectedOption = 0; // 초기에는 선택된 옵션이 없으므로 0으로 설정

    $(".button-container").click(function() {
        // 클릭된 버튼의 id에서 숫자 추출
        var optionId = parseInt($(this).attr("id").substr(-1)); // 클릭된 버튼의 id에서 숫자 추출 


        // 이전에 선택한 버튼의 배경색 원래대로 되돌리기

		 $(".button-container").removeClass("selected");
        // 선택한 버튼의 배경색 변경
        $(this).addClass("selected");
       	if (optionId === lastSelectedOption) {
            return;
        }
        lastSelectedOption = optionId;
        // vote 함수 호출
        vote(optionId);
        
        // replyButton1 및 toggleButton1 표시
        $("#replyButton1").css("display", "block");
        $("#toggleButton1").css("display", "block");

        // 서버에서 이미지 데이터 가져오기
    });
});
