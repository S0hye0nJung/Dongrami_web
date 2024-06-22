$(document).ready(function() {
    // 사용자의 닉네임을 가져오기
    const userId = 1; // 실제 사용자 ID 데이터를 사용해야 합니다.
    const subcategoryId = 1; // 실제 소분류 ID 데이터를 사용해야 합니다.
    const resultId = 1; // 실제 결과 ID 데이터를 사용해야 합니다.

    // 리뷰 쓰기 버튼 클릭 시 모달 열기
    $('#write-review').on('click', function() {
        $('#review-modal').css('display', 'block');
        $('#rating .star').addClass('selected'); // 기본으로 모든 별을 채운 상태로 설정
        $('.rating-score').text('5점'); // 기본 점수를 5점으로 설정
    });

    // 모달 닫기 버튼 (X) 클릭 시 모달 닫기
    $('.close').on('click', function() {
        $('#review-modal').css('display', 'none');
    });

    // 모달 바깥 클릭 시 모달 닫기
    $(window).on('click', function(event) {
        if ($(event.target).is('#review-modal')) {
            $('#review-modal').css('display', 'none');
        }
    });

    // 별점 클릭 이벤트
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
        $('#ratingScore').val(index); // 숨겨진 입력 필드에 점수 설정
    });

    // 리뷰 텍스트 글자 수 제한 및 카운터 업데이트
    $('#review-text').on('input', function() {
        const maxLength = 100;
        const currentLength = $(this).val().length;
        if (currentLength > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
        $('#character-count').text(`${currentLength}/${maxLength}`);
    });

    // 리뷰 제출 버튼 클릭 시 처리 로직
    $('#submit-review').on('click', function(e) {
        e.preventDefault(); // 폼 제출 중지

        const reviewText = $('#review-text').val();
        const ratingScore = $('.rating-score').text().replace('점', '');

        if (!reviewText) {
            alert('리뷰 내용을 작성해주세요.');
            return false;
        }

        console.log('리뷰 텍스트:', reviewText);
        console.log('평점:', ratingScore);
        console.log('사용자 ID:', userId);
        console.log('소분류 ID:', subcategoryId);
        console.log('결과 ID:', resultId);

        // 폼 데이터를 서버로 전송
        $.ajax({
            type: 'POST',
            url: '/submitReview',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                user_id: userId,
                subcategory_id: subcategoryId,
                result_id: resultId,
                rating: ratingScore,
                review_text: reviewText
            }),
            success: function(response) {
                console.log('서버 응답:', response);
                alert('리뷰가 성공적으로 제출되었습니다.');
                $('#review-modal').css('display', 'none'); // 모달 창 닫기
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('에러 메시지:', textStatus, errorThrown);
                alert('리뷰 제출에 실패했습니다. 다시 시도해주세요. \n' + textStatus + ': ' + errorThrown);
            }
        });
    });
});
