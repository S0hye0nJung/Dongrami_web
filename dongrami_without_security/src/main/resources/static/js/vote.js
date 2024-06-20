
// 예를 들어, vote 함수 정의
function vote(optionId) {
    // 투표할 옵션 ID
    var optionId = optionId;

    // 서버에 투표 요청 보내기
    fetch(`/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ optionId: optionId })
    })
    .then(response => response.json())
    .then(data => {
        // 투표 결과 업데이트
        updateVoteResults(data);
        document.getElementById('percentage1').style.display="block";
        document.getElementById('bar1').style.display="block";
        document.getElementById('bar2').style.display="block";
    	document.getElementById('percentage2').style.display="block";
    })
    .catch(error => console.error('Error:', error));
}
$(document).ready(function() {
    var lastSelectedOption = 0; // 초기에는 선택된 옵션이 없으므로 0으로 설정

    $(".vote-button").click(function() {
        var optionId = parseInt($(this).attr("id").substr(-1)); // 클릭된 버튼의 id에서 숫자 추출

        // 이전에 선택한 버튼의 배경색 원래대로 되돌리기
        if (lastSelectedOption !== 0) {
            $("#voteButton" + lastSelectedOption).removeClass("selected");
        }

        // 선택한 버튼의 배경색 변경
        $(this).addClass("selected");
        lastSelectedOption = optionId;

        // vote 함수 호출
        vote(optionId);
        
        // replyButton1 및 toggleButton1 표시
        $("#replyButton1").css("display", "block");
        $("#toggleButton1").css("display", "block");

        // 서버에서 이미지 데이터 가져오기
    });
});

function updateVoteResults(data) {
    const totalVotes = data.option1Count + data.option2Count;
    
    const option1Percentage = Math.round((data.option1Count / totalVotes) * 100);
    const option2Percentage = Math.round((data.option2Count / totalVotes) * 100);

    document.getElementById('percentage1').innerText = `${option1Percentage}% `;
    document.getElementById('percentage2').innerText = `${option2Percentage}% `;
    

    document.getElementById('bar1').style.width = `${option1Percentage}%`;
    document.getElementById('bar2').style.width = `${option2Percentage}%`;
}

// 초기 투표 결과 불러오기
document.addEventListener('DOMContentLoaded', () => {
    fetch('/vote-results')
        .then(response => response.json())
        .then(data => {
            // 초기 로딩 시 투표 결과가 있는 경우에만 업데이트
            if (data.option1Count > 0 || data.option2Count > 0) {
                updateVoteResults(data);
            }
        })
        .catch(error => console.error('Error:', error));
        document.getElementById("comment-container1").style.display = "none";
        var voteDataId = 1;
         $.get("/vote-data/" + voteDataId, function(data) {
        if (data && data.voteImage) {
            $(".image-container").append('<img src="' + data.voteImage + '" alt="Vote Image">');
        } else {
            $(".image-container").append('<p>Image not found</p>');
        }
    });
});

  
  function toggleComment(){
    const button = document.getElementById("toggleButton1");
    const commentSection = document.getElementById("comment-container1");
    if (commentSection.style.display === "none") {
        commentSection.style.display = "block";
        button.innerText = "댓글 숨기기";
    } else {
        commentSection.style.display = "none";
        button.innerText = "댓글 달기";
    }
  }
  
  
  
  
  const comments1 = [];
  const comments2 = [];
  const commentsPerPage = 5;
  let currentPage1 = 1;
  let currentPage2 = 1;
  
  function addComment(inputId, listId) {
    const commentInput = document.getElementById(inputId);
    if (commentInput.value.trim() === "") {
        alert("댓글을 입력하세요.");
        return;
    }
  
    const commentText = commentInput.value;
    const now = new Date();
    const commentTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    const comments = (listId === 'comment-list1') ? comments1 : comments2;
    comments.push({ text: commentText, time: commentTime });
    commentInput.value = "";
  
    renderComments(listId);
  }
  
  function renderComments(listId) {
    const commentList = document.getElementById(listId);
    commentList.innerHTML = "";
  
    const comments = (listId === 'comment-list1') ? comments1 : comments2;
    const currentPage = (listId === 'comment-list1') ? currentPage1 : currentPage2;
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = Math.min(startIndex + commentsPerPage, comments.length);
  
    for (let i = startIndex; i < endIndex; i++) {
        const comment = comments[i];
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
  
        commentElement.innerHTML = `
            <div class="comment-info">
                <div class="comment-author">익명</div>
                <div class="comment-time">${comment.time}</div>
                <div class="comment-text">${comment.text}</div>
            </div>
            <div class="comment-actions">
                <button class="edit-button" onclick="editComment(this, '${listId}')">수정</button>
                <button class="delete-button" onclick="deleteComment(this, '${listId}')">삭제</button>
            </div>
            <button class="menu-button" onclick="toggleActions(event, this)">...</button>
        `;
        commentList.appendChild(commentElement);
    }
    renderPagination(listId);
  }
  
  function renderPagination(listId) {
    const paginationContainer = document.getElementById(`pagination${listId.charAt(listId.length - 1)}`);
    paginationContainer.innerHTML = "";
  
    const comments = (listId === 'comment-list1') ? comments1 : comments2;
    const currentPage = (listId === 'comment-list1') ? currentPage1 : currentPage2;
    const totalPages = Math.ceil(comments.length / commentsPerPage);
  
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = (i === currentPage) ? 'active' : '';
        button.addEventListener('click', () => {
            if (listId === 'comment-list1') {
                currentPage1 = i;
            } else {
                currentPage2 = i;
            }
            renderComments(listId);
        });
        paginationContainer.appendChild(button);
    }
  }
  
  function editComment(button, listId) {
    const commentElement = button.closest('.comment');
    const commentTextElement = commentElement.querySelector('.comment-text');
    const currentText = commentTextElement.textContent;
  
    const editableDiv = document.createElement('div');
    editableDiv.contentEditable = 'true';
    editableDiv.classList.add('editable-div');
    editableDiv.textContent = currentText;
  
    commentTextElement.style.display = 'none';
    commentTextElement.parentNode.insertBefore(editableDiv, commentTextElement.nextSibling);
  
    const saveButton = document.createElement('button');
    saveButton.textContent = '저장';
    saveButton.classList.add('save-button');
    commentTextElement.parentNode.insertBefore(saveButton, editableDiv.nextSibling);
  
    saveButton.addEventListener('click', () => {
        const newText = editableDiv.textContent.trim();
        if (newText !== "") {
            commentTextElement.textContent = newText;
        }
        editableDiv.remove();
        saveButton.remove();
        commentTextElement.style.display = '';
    });
  }
  
  function deleteComment(button, listId) {
    if (confirm("댓글을 삭제하시겠습니까?")) {
        const commentElement = button.closest('.comment');
        const commentIndex = Array.from(commentElement.parentNode.children).indexOf(commentElement);
        const comments = (listId === 'comment-list1') ? comments1 : comments2;
        comments.splice(commentIndex + ((listId === 'comment-list1' ? currentPage1 : currentPage2 - 1) * commentsPerPage), 1);
        renderComments(listId);
    }
  }
  
  function toggleActions(event, button) {
    event.stopPropagation();
    const commentElement = button.closest('.comment');
    const actionsElement = commentElement.querySelector('.comment-actions');
    if (actionsElement.style.display === 'none' || actionsElement.style.display === '') {
        const allActions = document.querySelectorAll('.comment-actions');
        allActions.forEach(function(actions) {
            actions.style.display = 'none';
        });
        actionsElement.style.display = 'flex';
    } else {
        actionsElement.style.display = 'none';
    }
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.menu-button')) {
        const actionsElements = document.querySelectorAll('.comment-actions');
        actionsElements.forEach(function(actionsElement) {
            actionsElement.style.display = 'none';
        });
    }
  }
  document.getElementById("replyButton1").onclick = function () {
    // 다른 페이지로 이동할 URL 설정
    var url = "/mainvote.html";
    // 현재 창에서 새로운 페이지로 이동
    window.location.href = url;
};