$(document).ready(function() {
    // 닉네임과 주제 가져오기
    const nickname = localStorage.getItem('nickname') || '닉네임';
    const subject = localStorage.getItem('subject') || '주제';
    const subjectImage = localStorage.getItem('subjectImage') || 'assets/images/basic.png'; // 기본 이미지 파일명 설정
    $('.user-name').text(nickname);
    $('.user-role').text(`#${subject}`);
    $('.review-rating label').text('평점');

    // 주제에 따른 이미지 설정
    $('.user-avatar').attr('src', subjectImage);

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
    $('#submit-review').on('click', function() {
        const reviewText = $('#review-text').val();
        const ratingScore = $('.rating-score').text();
        if (reviewText) {
            localStorage.setItem('reviewText', reviewText);
            localStorage.setItem('ratingScore', ratingScore);
            window.location.href = 'review.html';
        } else {
            alert('리뷰 내용을 작성해주세요.');
        }
    });
});
