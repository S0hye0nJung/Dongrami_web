document.addEventListener('DOMContentLoaded', () => {
    const reviewContainer = document.getElementById('reviews');
    const ratingValueElement = document.querySelector('.rating-value');
    const ratingDetailsElement = document.querySelector('.rating-details');
    const starElements = document.querySelectorAll('.satisfaction .star');
    const paginationContainer = document.getElementById('pagination');

    const reviewsPerPage = 10;
    let currentPage = 1;
    let reviews = [];

    fetchReviews();

    function fetchReviews() {
        $.ajax({
            type: 'GET',
            url: '/api/reviews',
            success: function(data) {
                console.log('Fetched reviews:', data);
                if (data && Array.isArray(data)) {
                    reviews = data;
                    renderReviews(reviews, currentPage);
                    updateAverageRating(reviews);
                } else {
                    console.error('Invalid data format:', data);
                }
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

        pageReviews.forEach(review => {
            const reviewId = review.reviewId;
            if (!reviewId) {
                console.error('Review ID is missing or invalid:', review);
            }

            const rating = review.rating ? review.rating : 0;
            const nickname = review.nickname || '닉네임';
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-content">
                    <div class="review-header">
                        <div class="review-title">#${review.subcategoryName}</div>
                        <div class="review-meta">
                            <div class="stars">
                                ${generateStars(rating)}
                            </div>
                            <div class="review-separator">|</div>
                            <div class="review-date">${new Date(review.reviewCreate).toLocaleDateString()}</div>
                            <div class="review-separator">|</div>
                            <button class="next-button" data-id="${reviewId}">></button>
                        </div>
                    </div>
                    <div class="review-divider"></div>
                    <p class="review-text">${review.reviewText}</p>
                </div>
                <div class="nickname-container">
                    <button class="edit-button" data-id="${reviewId}" data-nickname="${nickname}" data-subcategory="${review.subcategoryName}" data-rating="${review.rating}" data-text="${review.reviewText}">수정</button>
                    <span class="nickname">${nickname}</span>
                </div>
                ${review.image ? `<img src="${review.image}" alt="Review Image" class="review-image">` : ''}
            `;
            reviewContainer.appendChild(reviewCard);
        });

        const nextButtons = document.querySelectorAll('.next-button');
        nextButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                console.log('Next button clicked, review ID:', id);
            });
        });

        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const reviewId = event.target.getAttribute('data-id');
                console.log('Edit button clicked, review ID:', reviewId);
                if (!reviewId) {
                    console.error('Review ID is invalid');
                    alert('유효하지 않은 리뷰 ID입니다.');
                    return;
                }
                const nickname = event.target.getAttribute('data-nickname');
                const subcategory = event.target.getAttribute('data-subcategory');
                const rating = event.target.getAttribute('data-rating');
                const reviewText = event.target.getAttribute('data-text');
                
                $('#review-text').val(reviewText);
                $('.user-name').text(nickname);
                $('.user-role').text('#' + subcategory);
                $('#modal-rating .star').each(function(index) {
                    if (index < rating) {
                        $(this).addClass('selected');
                    } else {
                        $(this).removeClass('selected');
                    }
                });
                $('.modal-rating-score').text(rating + '점');
                $('#ratingScore').val(rating);
                $('#update-review').attr('data-id', reviewId).show();
                $('#delete-review').attr('data-id', reviewId).show();
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

        ratingValueElement.textContent = averageRating;
        ratingDetailsElement.textContent = `${totalReviews}개의 리뷰`;

        starElements.forEach((star, index) => {
            if (index < Math.floor(averageRating)) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });

        const fractionalPart = averageRating - Math.floor(averageRating);
        if (fractionalPart > 0) {
            const nextStar = starElements[Math.floor(averageRating)];
            if (nextStar) {
                nextStar.classList.add('half-filled');
            }
        }
    }

    $('#update-review').on('click', function() {
        const reviewId = $(this).attr('data-id');
        if (!reviewId) {
            alert('유효하지 않은 리뷰 ID입니다.');
            return;
        }
        const updatedReview = {
            rating: parseInt($('#ratingScore').val()),
            reviewText: $('#review-text').val(),
            userId: '1', // 실제 사용자 ID로 변경
            subcategoryId: 1, // 실제 소주제 ID로 변경
            resultId: 1, // 실제 결과 ID로 변경
            nickname: '사용자 닉네임' // 실제 닉네임으로 변경
        };
        $.ajax({
            type: 'PUT',
            url: '/api/reviews/update/' + reviewId,
            contentType: 'application/json',
            data: JSON.stringify(updatedReview),
            success: function() {
                alert('리뷰가 수정되었습니다.');
                $('#review-modal').css('display', 'none');
                fetchReviews();
            },
            error: function() {
                alert('리뷰 수정에 실패했습니다.');
            }
        });
    });

    $('#delete-review').on('click', function() {
        const reviewId = $(this).attr('data-id');
        if (!reviewId) {
            alert('유효하지 않은 리뷰 ID입니다.');
            return;
        }
        $.ajax({
            type: 'DELETE',
            url: '/api/reviews/delete/' + reviewId,
            success: function() {
                alert('리뷰가 삭제되었습니다.');
                $('#review-modal').css('display', 'none');
                fetchReviews();
            },
            error: function() {
                alert('리뷰 삭제에 실패했습니다.');
            }
        });
    });

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        document.getElementById('review-modal').style.display = 'none';
    });
});
