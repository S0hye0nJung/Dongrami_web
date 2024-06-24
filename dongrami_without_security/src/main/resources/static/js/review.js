document.addEventListener('DOMContentLoaded', () => {
    const reviewContainer = document.getElementById('reviews');
    const reviewCountElement = document.getElementById('review-count');
    const ratingValueElement = document.querySelector('.rating-value');
    const ratingDetailsElement = document.querySelector('.rating-details');
    const starElements = document.querySelectorAll('.satisfaction .star');
    const paginationContainer = document.getElementById('pagination');

    const reviewsPerPage = 10;
    let currentPage = 1;
    let reviews = []; // 리뷰 데이터를 저장할 변수
    let currentReviewId = null; // 현재 수정 중인 리뷰 ID를 저장할 변수

    // 로컬 스토리지에서 소주제 값을 가져옴
    const subtopicTitle = localStorage.getItem('subtopicTitle') || '소주제';
    const nickname = "닉네임"; // 실제 사용자 닉네임으로 변경

    // 로컬 스토리지에서 리뷰 데이터를 가져옴
    const localReviews = window.localStorage.getItem('reviews');
    if (localReviews) {
        reviews = JSON.parse(localReviews);
        window.localStorage.removeItem('reviews'); // 가져온 후 로컬 스토리지에서 제거
    } else {
        fetchReviews();
    }

    function fetchReviews() {
        $.ajax({
            type: 'GET',
            url: '/getReviews',
            success: function(data) {
                console.log('서버에서 가져온 리뷰 데이터:', data); // 데이터 확인
                reviews = data;
                renderReviews(reviews, currentPage);
                updateAverageRating(reviews); // 평균 평점을 업데이트합니다.
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('리뷰 데이터를 가져오는 중 오류 발생:', textStatus, errorThrown);
            }
        });
    }

    function renderReviews(reviews, page) {
        reviewContainer.innerHTML = '';
        const start = (page - 1) * reviewsPerPage;
        const end = start + reviewsPerPage;
        const pageReviews = reviews.slice(start, end);

        console.log('렌더링할 리뷰 데이터:', pageReviews); // 페이지 리뷰 데이터 확인

        pageReviews.forEach(review => {
            const rating = review.rating ? review.rating : 0; // NaN 문제를 방지하기 위해 기본값 설정
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-content">
                    <div class="review-header">
                        <div class="review-title">${subtopicTitle}</div> <!-- 소주제 제목 표시 -->
                        <div class="review-meta">
                            <div class="stars">
                                ${generateStars(rating)}
                            </div>
                            <div class="review-separator">|</div>
                            <div class="review-date">${new Date(review.reviewCreate).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="review-divider"></div>
                    <p class="review-text">${review.reviewText}</p>
                </div>
                <div class="nickname-container">
                    <button class="edit-button" data-id="${review.reviewId}">수정</button> <!-- 수정 버튼 추가 -->
                    <div class="nickname">${review.nickname || nickname}</div> <!-- 닉네임 표시 -->
                </div>
                ${review.image ? `<img src="${review.image}" alt="Review Image" class="review-image">` : ''}
                <button class="next-button" data-url="${review.url}">&gt;</button>
            `;
            reviewContainer.appendChild(reviewCard);
        });

        // next-button 클릭 이벤트 추가
        const nextButtons = document.querySelectorAll('.next-button');
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const url = button.getAttribute('data-url');
                window.location.href = url;
            });
        });

        // edit-button 클릭 이벤트 추가
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const reviewCard = event.target.closest('.review-card');
                const reviewTitle = reviewCard.querySelector('.review-title').textContent;
                const reviewText = reviewCard.querySelector('.review-text').textContent;
                const reviewRating = reviewCard.querySelectorAll('.review-meta .stars .star.filled').length;
                const reviewNickname = reviewCard.querySelector('.nickname').textContent;
                currentReviewId = parseInt(event.target.getAttribute('data-id'), 10); // 현재 리뷰 ID 설정

                console.log('수정할 리뷰 ID:', currentReviewId); // 여기서 currentReviewId 확인

                if (!currentReviewId) {
                    alert('리뷰 ID를 찾을 수 없습니다. 다시 시도해주세요.');
                    return;
                }

                $('#review-modal .modal-content h2').text("타로와 함께한 시간!");
                $('#review-modal .user-info .user-role').text(reviewTitle);
                $('#review-modal .user-info .user-name').text(reviewNickname || nickname);
                $('#review-text').val(reviewText);
                $('#modal-rating .star').each(function(index) {
                    if (index < reviewRating) {
                        $(this).addClass('selected');
                    } else {
                        $(this).removeClass('selected');
                    }
                });
                $('.modal-rating-score').text(reviewRating + '점');
                $('#ratingScore').val(reviewRating);

                // 수정 및 삭제 버튼 보이기
                $('#update-review').show();
                $('#delete-review').show();

                $('#review-modal').css('display', 'block');
            });
        });

        renderPagination(reviews.length);
    }

    function generateStars(stars) {
        let starHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < stars) {
                starHTML += '<span class="star filled">★</span>';
            } else {
                starHTML += '<span class="star">★</span>';
            }
        }
        return starHTML;
    }

    function renderPagination(totalReviews) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(totalReviews / reviewsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'page-button';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderReviews(reviews, currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    function updateAverageRating(reviews) {
        const totalReviews = reviews.length;
        const totalStars = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        const averageRating = (totalStars / totalReviews).toFixed(1);

        // 별 옆에 평균 평점 숫자를 표시
        ratingValueElement.textContent = averageRating;
        ratingDetailsElement.textContent = `${totalReviews}개의 리뷰`;

        // 별 색칠하기 수정된 부분
        starElements.forEach((star, index) => {
            if (index < Math.floor(averageRating)) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });

        // 평균 별점을 반영한 별 색칠 (소수점 반영)
        const fractionalPart = averageRating - Math.floor(averageRating);
        if (fractionalPart > 0) {
            const nextStar = starElements[Math.floor(averageRating)];
            if (nextStar) {
                nextStar.classList.add('half-filled');
            }
        }
    }

    if (reviews.length > 0) {
        renderReviews(reviews, currentPage);
        updateAverageRating(reviews);
    }

    // 모달창 관련 JavaScript 코드
    $('#write-review').on('click', function() {
        $('#review-modal .modal-content h2').text("타로와 함께한 시간!");
        $('#review-modal .user-info .user-role').text(`#${subtopicTitle}`);
        $('#review-modal .user-info .user-name').text(nickname);
        $('.user-avatar').attr('src', subtopicImage);
        $('#review-modal').css('display', 'block');
        $('#modal-rating .star').addClass('selected');
        $('.modal-rating-score').text('5점');

        // 수정 및 삭제 버튼 숨기기
        $('#update-review').hide();
        $('#delete-review').hide();
    });

    $('.close').on('click', function() {
        $('#review-modal').css('display', 'none');
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#review-modal')) {
            $('#review-modal').css('display', 'none');
        }
    });

    $('#modal-rating .star').on('click', function() {
        const index = $(this).index() + 1;
        $('#modal-rating .star').each(function(i) {
            if (i < index) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
            }
        });
        $('.modal-rating-score').text(index + '점');
        $('#ratingScore').val(index);
    });

    $('#review-text').on('input', function() {
        const maxLength = 100;
        const currentLength = $(this).val().length;
        if (currentLength > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
        $('#character-count').text(`${currentLength}/${maxLength}`);
    });

    $('#update-review').on('click', function() {
        console.log('수정 버튼 클릭, currentReviewId:', currentReviewId); // 여기서 currentReviewId 확인

        if (!currentReviewId) {
            alert('리뷰 ID가 설정되지 않았습니다. 다시 시도해주세요.');
            return;
        }

        const updatedReview = {
            rating: $('#ratingScore').val(),
            reviewText: $('#review-text').val(),
            nickname: $('#review-modal .user-info .user-name').text() // 닉네임 필드 추가
        };

        $.ajax({
            type: 'PUT',
            url: `/updateReview/${currentReviewId}`,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(updatedReview),
            success: function(response) {
                alert('리뷰가 수정되었습니다.');
                $('#review-modal').css('display', 'none');
                fetchReviews(); // 수정 후 최신 리뷰 목록 가져오기
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('에러 메시지:', textStatus, errorThrown);
                alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
            }
        });
    });

    $('#delete-review').on('click', function() {
        console.log('삭제 버튼 클릭, currentReviewId:', currentReviewId); // 여기서 currentReviewId 확인

        if (!currentReviewId) {
            alert('리뷰 ID가 설정되지 않았습니다. 다시 시도해주세요.');
            return;
        }

        const reviewIdToDelete = currentReviewId;

        $.ajax({
            type: 'DELETE',
            url: `/deleteReview/${reviewIdToDelete}`,
            success: function(response) {
                alert('리뷰가 삭제되었습니다.');
                $('#review-modal').css('display', 'none');
                fetchReviews(); // 삭제 후 최신 리뷰 목록 가져오기
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('에러 메시지:', textStatus, errorThrown);
                alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        });
    });
});
