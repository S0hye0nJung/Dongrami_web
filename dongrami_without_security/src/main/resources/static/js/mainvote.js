document.addEventListener("DOMContentLoaded", function() {
    const voteListDiv = document.getElementById('vote-list');
    const commentDiv = document.getElementById('comment-section');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const voteId = id;
    const inputText = document.getElementById('inputText');
    const submitBtn = document.getElementById('submitBtn');
    const commentList = document.getElementById('commentList');

    
  function fetchVoteById(id) {
		
        fetch(`/api/votes/${id}`)       	
            	.then(response => {				
                if (!response.ok) {
                    throw new Error('Failed to fetch vote');
                }
                return response.json();
            })
            .then(vote => {
                const voteDiv = createVoteElement(vote);
                voteListDiv.appendChild(voteDiv);
            })
            .catch(error => {
                console.error('Error fetching vote:', error);
            });
           
    }
   

     function createVoteElement(vote) {
        const voteDiv = document.createElement('div');
        voteDiv.classList.add('vote-item');

        voteDiv.innerHTML = `
            <h2>${vote.question}</h2>
            <img src="${vote.voteImage}" alt="Vote Image">
            <p>${vote.option1}</p>
            <p>${vote.option2}</p>
        `;
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        
        const button1 = document.createElement('button');
        button1.textContent = '투표';
        button1.addEventListener('click', function() {
            voteOption(vote.voteId, 'option1');
            button1.classList.add('selected');
            button2.classList.remove('selected');
        });
        
        const button2 = document.createElement('button');
        button2.textContent = '투표';
        button2.addEventListener('click', function() {
            voteOption(vote.voteId, 'option2');
            button2.classList.add('selected');
            button1.classList.remove('selected');
        });
        
        buttonContainer.appendChild(button1);
        buttonContainer.appendChild(button2);
        voteDiv.appendChild(buttonContainer);

       const barContainer1 = document.createElement('div');
        barContainer1.classList.add('bar-container1');
        barContainer1.id = `barContainer1_${vote.voteId}`; // voteId를 사용하여 고유한 id 생성
        barContainer1.innerHTML = `
            <div class="bar1" id="bar1_${vote.voteId}"></div>
            <span class="text-left" id="text1">A</span>
            <span class="percentage" id="percentage1_${vote.voteId}"></span>
        `;
        voteDiv.appendChild(barContainer1);

        const barContainer2 = document.createElement('div');
        barContainer2.classList.add('bar-container2');
        barContainer2.id = `barContainer2_${vote.voteId}`; // voteId를 사용하여 고유한 id 생성
        barContainer2.innerHTML = `
            <div class="bar2" id="bar2_${vote.voteId}"></div>
            <span class="text-left" id="text2">B</span>
            <span class="percentage" id="percentage2_${vote.voteId}"></span>
        `;
        voteDiv.appendChild(barContainer2);
		
        return voteDiv;
        
    }

    window.voteOption = function(voteId, option) {
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
            console.log('Vote successful:', updatedVote);
            updateVoteResults(updatedVote);
        })
        .catch(error => {
            console.error('Error voting:', error);
        });
    };

    function updateVoteResults(vote) {
        const totalVotes = vote.option1Count + vote.option2Count;
        const percentage1 = totalVotes === 0	 ? 0 : Math.round((vote.option1Count / totalVotes) * 100);
        const percentage2 = totalVotes === 0 ? 0 : Math.round((vote.option2Count / totalVotes) * 100);

        const percentage1Elem = document.getElementById(`percentage1_${vote.voteId}`);
        const percentage2Elem = document.getElementById(`percentage2_${vote.voteId}`);
        const bar1 = document.getElementById(`bar1_${vote.voteId}`);
        const bar2 = document.getElementById(`bar2_${vote.voteId}`);

        percentage1Elem.textContent = `${percentage1}%`;
        percentage2Elem.textContent = `${percentage2}%`;

        bar1.style.width = `${percentage1}%`;
        bar2.style.width = `${percentage2}%`;
    }
    
        function fetchComments(voteId) {
   			 fetch(`/api/replies/votes/${voteId}`)
        		.then(response => {
            		if (!response.ok) {
               		 throw new Error('Failed to fetch comments');
           			 }
           				 return response.json();
       	 })
        .then(comments => {
			console.log(comments);
            comments.forEach(comment => {
                const commentElem = createCommentElement(comment);
                commentDiv.appendChild(commentElem);
            });
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
	}
		
        function createCommentElement(comment) {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment-item');
            commentDiv.innerHTML = `
   
				<textarea id="comment-input" rows="4" placeholder="댓글을 입력하세요..."></textarea>
				<button id = "submit1" onclick="submitReply(${voteId})">댓글 쓰기</button>
				 
                <p>${comment.content}</p>
                <p>작성일: ${comment.replyCreate}</p>
                <!-- 필요한 정보 추가 -->
            `;
            

            // 필요한 경우, 자식 댓글을 표시하는 방법도 추가 가능

            return commentDiv;
        }
            function submitReply(voteId) {
            const content = document.getElementById('replyContent').value.trim();

            if (content === '') {
                alert('댓글을 입력하세요.');
                return;
            }

            const requestBody = {
                content: content
            };

            fetch('/api/replies/add/${voteId}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('댓글 등록에 실패했습니다.');
                }
                return response.json();
            })
            .then(data => {
                alert('댓글이 성공적으로 등록되었습니다.');
                document.getElementById('replyContent').value = ''; // 입력 필드 초기화
            })
            .catch(error => {
                console.error('댓글 등록 오류:', error);
                alert('댓글 등록 중 오류가 발생했습니다.');
            });
        }

    // 초기 로드 시 fetchVoteById 호출
    fetchVoteById(id);
    fetchComments(voteId);
});
