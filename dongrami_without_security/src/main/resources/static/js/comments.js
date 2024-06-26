document.addEventListener('DOMContentLoaded', () => {
    let comments = [
        { id: 1, page: 1, topic: '예시 주제', content: '이것은 예시 댓글입니다.', date: '2024-01-01' }
    ];
    const commentsPerPage = 10;
    let currentPage = 1;
    const userId = '123'; // 실제 사용자 ID로 변경 필요

    // 서버로부터 댓글 데이터를 불러오는 함수
    function loadComments() {
        $.ajax({
            url: `/api/comments/mine?userId=${userId}`, // 사용자 댓글 불러오기
            method: 'GET',
            success: (data) => {
                comments = data;
                displayComments(currentPage);
            },
            error: (err) => {
                console.error('Failed to load comments', err);
            }
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
            noCommentsCell.colSpan = 6;
            noCommentsCell.id = 'no-comments';
            noCommentsCell.textContent = '작성글이 없습니다.';
            noCommentsRow.appendChild(noCommentsCell);
            table.appendChild(noCommentsRow);
        } else {
            for (let i = startIndex; i < endIndex; i++) {
                const comment = comments[i];
                const row = document.createElement('tr');
                row.dataset.index = i;
                row.dataset.commentId = comment.commentId;
                row.innerHTML = `
                    <td><input type="checkbox" class="select-comment"></td>
                    <td>${comments.length - i}</td>
                    <td>${comment.topic || ''}</td>
                    <td><a href="#" class="comment-link" data-id="${comment.commentId}" data-page="${comment.page}">${comment.content || ''}</td>
                    <td>${comment.replyCreate || ''}</td>
                    <td><button class="edit-button" data-id="${i}" data-topic="${comment.topic}" data-content="${comment.content}">수정</button></td>
                `;
                table.appendChild(row);
            }
        }

        commentSection.appendChild(table);
        renderPagination(comments.length, commentsPerPage, page);

        document.getElementById('select-all').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.select-comment');
            for (let checkbox of checkboxes) {
                checkbox.checked = this.checked;
            }
            updateSelectedCount();
            toggleSelectedCountDisplay();
        });

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

        const commentLinks = document.querySelectorAll('.comment-link');
        commentLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const commentId = this.getAttribute('data-id');
                const commentPage = this.getAttribute('data-page');
                window.location.href = `/vote?page=${commentPage}&commentId=${commentId}`;
            });
        });

        const editButtons = document.querySelectorAll('.edit-button');
        for (let editButton of editButtons) {
            editButton.addEventListener('click', function() {
                const commentId = this.getAttribute('data-id');
                const commentTopic = this.getAttribute('data-topic');
                const commentContent = this.getAttribute('data-content');
                $('#comment-text').val(commentContent);
                $('#commentId').val(commentId);
                $('#modal-topic').text(`투표 주제: ${commentTopic}`);
                $('#comment-modal').css('display', 'block');
            });
        }

        function updateSelectedCount() {
            const selectedCount = document.querySelectorAll('.select-comment:checked').length;
            document.getElementById('selected-count').textContent = `${selectedCount}/10 선택`;
        }

        function toggleSelectedCountDisplay() {
            const selectedCount = document.querySelectorAll('.select-comment:checked').length;
            const selectedCountElement = document.getElementById('selected-count');
            if (selectedCount > 0) {
                selectedCountElement.style.display = 'inline';
            } else {
                selectedCountElement.style.display = 'none';
            }
        }

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

        confirmDeleteButton.addEventListener('click', function() {
            const selectedComments = document.querySelectorAll('.select-comment:checked');
            selectedComments.forEach(checkbox => {
                const row = checkbox.closest('tr');
                const index = Array.from(row.parentNode.children).indexOf(row) - 1 + startIndex;
                $.ajax({
                    url: `/api/comments/delete/${comments[index].commentId}`,
                    method: 'DELETE',
                    success: () => {
                        comments.splice(index, 1);
                        displayComments(currentPage);
                    },
                    error: (err) => {
                        console.error('Failed to delete comment', err);
                    }
                });
            });
            modal.style.display = 'none';
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

    loadComments();

    document.getElementById('delete-selected').style.display = 'inline-flex';

    const closeModal = () => {
        $('#comment-modal').css('display', 'none');
    };

    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    document.getElementById('cancel-comment').addEventListener('click', closeModal);

    document.getElementById('save-comment').addEventListener('click', (event) => {
        event.preventDefault();
        const commentId = $('#commentId').val();
        const updatedContent = $('#comment-text').val();
        $.ajax({
            url: '/api/comments/update',
            method: 'POST',
            data: JSON.stringify({ commentId: commentId, content: updatedContent }),
            contentType: 'application/json',
            success: () => {
                loadComments();
                closeModal();
            },
            error: (err) => {
                console.error('Failed to update comment', err);
            }
        });
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('comment-modal');
        if (event.target == modal) {
            closeModal();
        }
    });
});

