document.addEventListener("DOMContentLoaded", function() {
    const voteDetailsDiv = document.getElementById('vote-list');

    function fetchVoteById(id) {
        fetch(`/api/votes/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch vote');
                }
                return response.json();
            })
            .then(vote => {
                // 투표 정보를 사용하여 HTML을 동적으로 생성하여 voteDetailsDiv에 추가
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

        const replyContainer = document.createElement('div');
        replyContainer.classList.add('reply-container');
        const replyButton = document.createElement('button');
        replyButton.id = 'replyButton';
        replyButton.textContent = '반응 보기';
        replyButton.addEventListener('click', function() {
            viewReplies(vote.voteId);
        });
        replyContainer.appendChild(replyButton);
        voteDiv.appendChild(replyContainer);

        return voteDiv;
        
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
        const percentage1 = totalVotes === 0 ? 0 : Math.round((vote.option1Count / totalVotes) * 100);
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

    // 예시: 투표 목록에서 특정 투표를 클릭했을 때 fetchVoteById 함수를 호출하는 예시
    // 투표 목록에서 특정 요소를 클릭하는 방식에 따라 이벤트 핸들러를 추가
    // 예를 들어, 특정 클래스를 가진 요소를 클릭했을 때 해당 요소의 데이터셋을 이용하여 id를 가져오는 방식 등을 사용할 수 있습니다.
});
