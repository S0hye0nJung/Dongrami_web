document.addEventListener('DOMContentLoaded', () => {
    let comments = [
        { number: 1, topic: '예시 주제', content: '첫번째 댓글 예시', date: '2023-06-20' }
    ]; // 초기 예시 댓글 하나
    const commentsPerPage = 10; // 페이지당 댓글 수 (고정)
    let currentPage = 1; // 현재 페이지

    function displayComments(page) {
        const commentSection = document.getElementById('comment-section');
        commentSection.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'comment-table';

        const header = document.createElement('tr');
        header.innerHTML = `
            <th><input type="checkbox" id="select-all"></th>
            <th>번호</th>
            <th>투표주제</th>
            <th>댓글내용</th>
            <th>작성날짜</th>
            <th>관리</th>
        `;
        table.appendChild(header);

        const startIndex = (page - 1) * commentsPerPage;
        const endIndex = Math.min(startIndex + commentsPerPage, comments.length);

        if (comments.length === 0) {
            const noCommentsRow = document.createElement('tr');
            const noCommentsCell = document.createElement('td');
            noCommentsCell.colSpan = 6; // 전체 열을 합침
            noCommentsCell.id = 'no-comments';
            noCommentsCell.textContent = '작성글이 없습니다.';
            noCommentsRow.appendChild(noCommentsCell);
            table.appendChild(noCommentsRow);
        } else {
            for (let i = startIndex; i < endIndex; i++) {
                const comment = comments[i];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="select-comment"></td>
                    <td>${comments.length - i}</td>
                    <td>${comment.topic || ''}</td>
                    <td>${comment.content || ''}</td>
                    <td>${comment.date || ''}</td>
                    <td><button class="edit-button">수정</button></td>
                `;
                table.appendChild(row);
            }
        }

        commentSection.appendChild(table);

        renderPagination(comments.length, commentsPerPage, page);

        // 전체 선택 체크박스 이벤트 추가
        document.getElementById('select-all').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.select-comment');
            for (let checkbox of checkboxes) {
                checkbox.checked = this.checked;
            }
            updateSelectedCount();
            toggleSelectedCountDisplay();
        });

        // 개별 선택 체크박스 이벤트 추가
        const checkboxes = document.querySelectorAll('.select-comment');
        for (let checkbox of checkboxes) {
            checkbox.addEventListener('change', function() {
                if (!this.checked) {
                    document.getElementById('select-all').checked = false;
                } else {
                    const allChecked = Array.from(checkboxes).every(chk => chk.checked);
                    if (allChecked) {
                        document.getElementById('select-all').checked = true;
                    }
                }
                updateSelectedCount();
                toggleSelectedCountDisplay();
            });
        }

        // 수정 버튼 이벤트 추가 (삭제 기능을 수정 기능으로 대체)
        const editButtons = document.querySelectorAll('.edit-button');
        for (let editButton of editButtons) {
            editButton.addEventListener('click', function() {
                // 수정 기능을 여기에 추가하세요.
                alert('수정 기능이 구현될 예정입니다.');
            });
        }

        // 선택된 댓글 수 업데이트 함수
        function updateSelectedCount() {
            const selectedCount = document.querySelectorAll('.select-comment:checked').length;
            document.getElementById('selected-count').textContent = `${selectedCount}/10 선택`; // 페이지당 댓글 수 고정
        }

        // 선택된 댓글 수 표시 여부 토글 함수
        function toggleSelectedCountDisplay() {
            const selectedCount = document.querySelectorAll('.select-comment:checked').length;
            const selectedCountElement = document.getElementById('selected-count');
            if (selectedCount > 0) {
                selectedCountElement.style.display = 'inline';
            } else {
                selectedCountElement.style.display = 'none';
            }
        }

        // 모달 제어
        const modal = document.getElementById('deleteModal');
        const confirmDeleteButton = document.getElementById('confirm-delete');
        const cancelDeleteButton = document.getElementById('cancel-delete');

        document.getElementById('delete-selected').addEventListener('click', function() {
            const selectedCount = document.querySelectorAll('.select-comment:checked').length;
            if (selectedCount > 0) {
                modal.style.display = 'block';
            }
        });

        cancelDeleteButton.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        // 삭제 확인 버튼 이벤트 추가
        confirmDeleteButton.addEventListener('click', function() {
            const selectedComments = document.querySelectorAll('.select-comment:checked');
            selectedComments.forEach(checkbox => {
                const row = checkbox.closest('tr');
                const index = Array.from(row.parentNode.children).indexOf(row) - 1 + startIndex; // index 조정
                comments.splice(index, 1);
            });
            modal.style.display = 'none';
            displayComments(currentPage);
        });

        updateSelectedCount();
        toggleSelectedCountDisplay();
    }

    function renderPagination(totalComments, commentsPerPage, currentPage) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(totalComments / commentsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'page-button';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                displayComments(i);
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    // 초기 댓글 로드
    displayComments(currentPage);

    // 항상 아이콘이 보이도록 설정
    document.getElementById('delete-selected').style.display = 'inline-flex';
});
