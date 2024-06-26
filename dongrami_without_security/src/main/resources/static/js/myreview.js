document.addEventListener('DOMContentLoaded', () => {
    let comments = [];
    const commentsPerPage = 10;
    let currentPage = 1;

    function fetchComments() {
        fetch('/reviews')
            .then(response => {
                if (!response.ok) {
                    throw new Error('댓글을 가져오는 중 오류가 발생했습니다: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                comments = data;
                displayComments(currentPage);
                fetchTotalCommentCount(); // 총 댓글 수 업데이트
            })
            .catch(error => {
                console.error(error);
                comments = [];
                displayComments(currentPage);
            });
    }

    function fetchTotalCommentCount() {
        fetch('/reviews/count')
            .then(response => {
                if (!response.ok) {
                    throw new Error('댓글 갯수를 가져오는 중 오류가 발생했습니다: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const totalCountElement = document.getElementById('total-count');
                totalCountElement.textContent = `총 댓글: ${data.count}개`;
            })
            .catch(error => {
                console.error(error);
                const totalCountElement = document.getElementById('total-count');
                totalCountElement.textContent = '총 댓글: 오류';
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
            <th>타로주제</th>
            <th>리뷰내용</th>
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
                row.innerHTML = `
                    <td><input type="checkbox" class="select-comment"></td>
                    <td>${comments.length - i}</td>
                    <td>${comment.mainCategoryName || ''}</td>
                    <td>${comment.reviewText || ''}</td>
                    <td>${formatDate(comment.reviewCreate) || ''}</td>
                    <td><button class="edit-button" data-id="${comment.reviewId}" data-text="${comment.reviewText}" data-rating="${comment.rating}">수정</button></td>
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

        confirmDeleteButton.addEventListener('click', function() {
            const selectedComments = document.querySelectorAll('.select-comment:checked');
            selectedComments.forEach(checkbox => {
                const row = checkbox.closest('tr');
                const index = Array.from(row.parentNode.children).indexOf(row) - 1 + startIndex;
                const reviewId = comments[index].reviewId;
                deleteReview(reviewId);
                comments.splice(index, 1);
            });
            modal.style.display = 'none';
            displayComments(currentPage);
        });

        updateSelectedCount();
        toggleSelectedCountDisplay();

        const editButtons = document.querySelectorAll('.edit-button');
        for (let editButton of editButtons) {
            editButton.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-id');
                const reviewText = this.getAttribute('data-text');
                const rating = parseInt(this.getAttribute('data-rating'));
                fillEditModal(reviewId, reviewText, rating);
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

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    }

    function fillEditModal(reviewId, reviewText, rating) {
        const editReviewTextElement = document.getElementById('edit-review-text');
        const editReviewIdElement = document.getElementById('edit-review-id');

        if (editReviewTextElement && editReviewIdElement) {
            editReviewTextElement.value = reviewText;
            editReviewIdElement.value = reviewId;
            updateStars(rating, '#edit-rating');

            const editModal = document.getElementById('editModal');
            if (editModal) {
                editModal.style.display = 'block';

                const closeButtons = document.getElementsByClassName('close');
                for (let closeButton of closeButtons) {
                    closeButton.onclick = function() {
                        closeModal('editModal');
                    };
                }

                const cancelEditButton = document.getElementById('cancel-edit');
                if (cancelEditButton) {
                    cancelEditButton.onclick = function() {
                        closeModal('editModal');
                    };
                }

                const editForm = document.getElementById('edit-form');
                if (editForm) {
                    editForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        const updatedReview = {
                            reviewId: parseInt(editReviewIdElement.value),
                            reviewText: editReviewTextElement.value,
                            rating: parseInt(document.getElementById('edit-rating-score-value').value)
                        };

                        updateReview(updatedReview);
                    });
                }

                const stars = document.querySelectorAll('#edit-rating .star');
                stars.forEach((star, index) => {
                    star.addEventListener('click', () => {
                        const rating = index + 1;
                        updateStars(rating, '#edit-rating');
                        document.getElementById('edit-rating-score-value').value = rating; // 수정된 부분
                    });
                });
            }
        } else {
            console.error('Edit review modal elements not found');
        }
    }

    function updateReview(review) {
        fetch(`/reviews/${review.reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('리뷰 업데이트에 실패했습니다: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('리뷰가 성공적으로 업데이트되었습니다:', data);
            fetchComments(); // 수정된 리뷰 목록을 다시 불러옴
            closeModal('editModal'); // 수정 모달 닫기
            // 수정 완료 메시지 표시
            document.getElementById('edit-success-message').style.display = 'block';
            setTimeout(() => {
                document.getElementById('edit-success-message').style.display = 'none';
            }, 3000); // 3초 후 메시지 숨기기
        })
        .catch(error => {
            console.error('리뷰 업데이트에 실패했습니다:', error);
        });
    }

    function updateStars(rating, container) {
        const stars = document.querySelectorAll(`${container} .star`);
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });

        const ratingScoreElement = document.getElementById('edit-rating-score-value');
        if (ratingScoreElement) {
            ratingScoreElement.value = rating;
        } else {
            console.error('Rating score element not found');
        }

        const ratingScoreTextElement = document.getElementById('edit-rating-score');
        if (ratingScoreTextElement) {
            ratingScoreTextElement.textContent = rating.toString();
        } else {
            console.error('Rating score text element not found');
        }
    }

    function deleteReview(reviewId) {
        fetch(`/reviews/${reviewId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('리뷰 삭제에 실패했습니다: ' + response.statusText);
            }
            console.log('리뷰가 성공적으로 삭제되었습니다.');
            fetchComments(); // 삭제 후 리뷰 목록 다시 불러옴
        })
        .catch(error => {
            console.error('리뷰 삭제에 실패했습니다:', error);
        });
    }

    function updateSelectedCount() {
        const selectedCount = document.querySelectorAll('.select-comment:checked').length;
        const totalCount = Math.min(comments.length, 10); // 최대 선택 가능 항목 수는 10개로 제한
        const selectedCountElement = document.getElementById('selected-count');
        selectedCountElement.style.display = 'inline-block';
        selectedCountElement.textContent = `${selectedCount}/${totalCount} 선택`;
    }

    function toggleSelectedCountDisplay() {
        const selectedCount = document.querySelectorAll('.select-comment:checked').length;
        const totalCount = Math.min(comments.length, 10); // 최대 선택 가능 항목 수는 10개로 제한
        const selectedCountElement = document.getElementById('selected-count');
        if (selectedCount === 0) {
            selectedCountElement.style.display = 'none';
        } else {
            selectedCountElement.style.display = 'inline-block';
        }
        selectedCountElement.textContent = `${selectedCount}/${totalCount} 선택`;
    }

    fetchComments(); // 페이지 로드 시 리뷰 목록을 가져옴
});
