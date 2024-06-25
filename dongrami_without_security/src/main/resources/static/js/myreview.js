document.addEventListener('DOMContentLoaded', () => {
    let comments = []; // 초기 댓글 데이터는 비어있음
    const commentsPerPage = 10; // 페이지당 댓글 수 (고정)
    let currentPage = 1; // 현재 페이지

    function fetchComments() {
        fetch('/reviews') // 실제 API 엔드포인트에 맞게 수정해야 함
            .then(response => response.json())
            .then(data => {
                comments = data; // 서버에서 받아온 댓글 데이터를 변수에 저장
                displayComments(currentPage); // 댓글 표시 함수 호출
            })
            .catch(error => {
                console.error('댓글을 가져오는 중 오류가 발생했습니다:', error);
                comments = []; // 오류 발생 시 댓글 데이터를 초기화
                displayComments(currentPage); // 오류 상황에 대한 처리
            });
    }

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
                    <td>${comment.mainCategoryName || ''}</td>
                    <td>${comment.reviewText || ''}</td>
                    <td>${formatDate(comment.reviewCreate) || ''}</td>
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

        // 선택된 댓글 수 업데이트 함수
        function updateSelectedCount() {
            const selectedCount = document.querySelectorAll('.select-comment:checked').length;
            document.getElementById('selected-count').textContent = `${selectedCount}/${commentsPerPage} 선택`; // 페이지당 댓글 수 고정
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

        // 수정 버튼 이벤트 추가
        const editButtons = document.querySelectorAll('.edit-button');
        for (let editButton of editButtons) {
            editButton.addEventListener('click', function() {
                const row = this.closest('tr');
                const reviewId = parseInt(row.querySelector('td:nth-child(2)').textContent.trim()); // 리뷰 번호
                const reviewText = row.querySelector('td:nth-child(4)').textContent.trim(); // 리뷰 내용
                // 수정할 리뷰의 정보를 모달에 채우기
                fillEditModal(reviewId, reviewText);
            });
        }
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
    fetchComments();

    // 모달 닫기 함수
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

    // 날짜 포맷 변경 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR'); // 원하는 형식으로 포맷을 변경할 수 있음
    }

    // 수정 폼 채우기 함수
    function fillEditModal(reviewId, reviewText) {
        // 모달에 데이터 채우기
        document.getElementById('edit-review-text').value = reviewText;
        document.getElementById('edit-review-id').value = reviewId;

        // 모달 보이기
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'block';

        // 닫기 버튼 이벤트 처리
        const closeButtons = document.getElementsByClassName('close');
        for (let closeButton of closeButtons) {
            closeButton.onclick = function() {
                closeModal('editModal');
            }
        }

        // 취소 버튼 이벤트 처리
        document.getElementById('cancel-edit').onclick = function() {
            closeModal('editModal');
        }

        // 수정 폼 제출 처리
const editForm = document.getElementById('edit-form');
editForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const updatedReview = {
        reviewId: document.getElementById('edit-review-id').value,
        reviewText: document.getElementById('edit-review-text').value
    };

    updateReview(updatedReview);
});
    }

    // 리뷰 업데이트 함수
    function updateReview(review) {
        fetch(`/reviews/${review.reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })
        .then(response => response.json())
        .then(data => {
            console.log('리뷰가 성공적으로 업데이트되었습니다:', data);
            fetchComments(); // 댓글 다시 로드
            closeModal('editModal'); // 모달 닫기
        })
        .catch(error => {
            console.error('리뷰 업데이트에 실패했습니다:', error);
            // 실패 시 사용자에게 알림 등을 추가할 수 있습니다.
        });
    }

    // 초기 댓글 로드
    fetchComments();

    // 항상 아이콘이 보이도록 설정
    document.getElementById('delete-selected').style.display = 'inline-flex';

    // 날짜 포맷 변경 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR'); // 원하는 형식으로 포맷을 변경할 수 있음
    }

    // 모달 닫기 함수
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }
});

