document.addEventListener('DOMContentLoaded', () => {
    let comments = [];
    const commentsPerPage = 10; // 페이지당 댓글 수 (고정)
    let currentPage = 1; // 현재 페이지

    // 데이터 가져오기
    async function fetchReviews() {
        try {
            const response = await fetch('/reviews');
            if (!response.ok) {
                throw new Error('리뷰 데이터를 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
comments = data.map(review => ({
    number: review.reviewId,
    topic: review.subcategory.maincategory.maincategoryName, // maincategoryName으로 수정
    content: review.reviewText,
    date: new Date(review.reviewCreate).toLocaleDateString()
}));
            displayComments(currentPage);
        } catch (error) {
            console.error('리뷰 데이터 가져오기 오류:', error);
        }
    }

    // 댓글 표시 함수
    function displayComments(page) {
        const commentSection = document.getElementById('comment-section');
        commentSection.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'comment-table';

        const header = document.createElement('tr');
        header.innerHTML = `
            <th><input type="checkbox" id="select-all"></th>
            <th>번호</th>
            <th>대주제</th>
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
            noCommentsCell.textContent = '작성된 리뷰가 없습니다.';
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

        // 수정 버튼 이벤트 추가 (수정 기능 구현 예정)
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
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // 삭제 확인 버튼 이벤트 추가
    confirmDeleteButton.addEventListener('click', function() {
        const selectedComments = document.querySelectorAll('.select-comment:checked');
        selectedComments.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const index = Array.from(row.parentNode.children).indexOf(row) - 1 + (currentPage - 1) * commentsPerPage; // index 조정
            comments.splice(index, 1); // 원본 데이터에서 삭제
            row.remove(); // DOM에서 삭제
        });
        modal.style.display = 'none';
        renderPagination(comments.length, commentsPerPage, currentPage);
    });

    // 페이지네이션 렌더링 함수
    function renderPagination(totalComments, commentsPerPage, currentPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(totalComments / commentsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.textContent = i;
            pageLink.href = '#';
            pageLink.classList.add('page-link');
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', function(event) {
                event.preventDefault();
                currentPage = i;
                displayComments(currentPage);
            });
            pagination.appendChild(pageLink);
        }
    }

    // 초기화
    fetchReviews();
});
