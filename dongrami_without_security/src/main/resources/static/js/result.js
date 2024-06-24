$(document).ready(function() {
    const userId = 1; // 실제 사용자 ID 데이터를 사용해야 합니다.
    const subcategoryId = 1; // 실제 소분류 ID 데이터를 사용해야 합니다.
    const subtopicTitle = "소주제"; // 실제 소주제 제목으로 변경
    const subtopicImage = "./images/subtopic_image.png"; // 실제 소주제 이미지 경로로 변경
    const nickname = "닉네임"; // 실제 사용자 닉네임으로 변경

    // 소주제 값을 로컬 스토리지에 저장
    localStorage.setItem('subtopicTitle', `#${subtopicTitle}`);

    $('#write-review').on('click', function() {
        $('#review-modal .modal-content h2').text("타로와 함께한 시간!"); // 인사말로 변경
        $('#review-modal .user-info .user-role').text(`#${subtopicTitle}`);
        $('#review-modal .user-info .user-name').text(nickname);
        $('.user-avatar').attr('src', subtopicImage);
        $('#review-modal').css('display', 'block');
        $('#rating .star').addClass('selected');
        $('.rating-score').text('5점');
    });

    $('.close').on('click', function() {
        $('#review-modal').css('display', 'none');
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#review-modal')) {
            $('#review-modal').css('display', 'none');
        }
    });

    $('#rating .star').on('click', function() {
        const index = $(this).index() + 1;
        $('#rating .star').each(function(i) {
            if (i < index) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
            }
        });
        $('.rating-score').text(index + '점');
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

    $('#submit-review').on('click', function(e) {
        e.preventDefault();

        const reviewText = $('#review-text').val();
        const ratingScore = $('#ratingScore').val();

        if (!reviewText) {
            alert('리뷰 내용을 작성해주세요.');
            return false;
        }

        const newReview = {
            userId: userId,
            subcategoryId: subcategoryId,
            rating: ratingScore,
            reviewText: reviewText,
            nickname: nickname
        };

        $.ajax({
            type: 'POST',
            url: '/submitReview',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(newReview),
            success: function(response) {
                console.log('서버 응답:', response);
                alert('리뷰가 성공적으로 저장되었습니다.');
                $('#review-modal').css('display', 'none');
                // 리뷰 페이지에 새로운 리뷰를 반영하도록 요청
                $.ajax({
                    type: 'GET',
                    url: '/getReviews',
                    success: function(reviews) {
                        // 업데이트된 리뷰 데이터를 리뷰 페이지로 보내기
                        window.localStorage.setItem('reviews', JSON.stringify(reviews));
                    }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('에러 메시지:', textStatus, errorThrown);
                let errorMessage = '리뷰 제출에 실패했습니다. 다시 시도해주세요.';
                if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                    errorMessage += '\n' + jqXHR.responseJSON.error;
                }
                alert(errorMessage);
            }
        });
    });

    function fetchReviews() {
        $.ajax({
            type: 'GET',
            url: '/getReviews',
            success: function(reviews) {
                renderReviews(reviews);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('리뷰 데이터를 가져오는 중 오류 발생:', textStatus, errorThrown);
            }
        });
    }

    fetchReviews();
});
