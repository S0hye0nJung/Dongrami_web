  function getVoteIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }

        function submitComment() {
            const voteId = getVoteIdFromUrl();
            if (!voteId) {
                console.error("voteId가 없습니다.");
                return;
            }

            const content = document.getElementById("commentInput").value;

            const replyDTO = {
                content: content,
                level: 1,
                parentReId: null,
                userId: "사용자 ID", // 사용자 ID 설정 필요
                userNickname: "사용자 닉네임" // 사용자 닉네임 설정 필요
            };

            createReplyForVote(voteId, replyDTO);
        }

        function createReplyForVote(voteId, replyDTO) {
            fetch(`/api/replies/vote/${voteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(replyDTO),
            })
            .then(response => {
                if (response.ok) {
                    console.log('댓글이 성공적으로 작성되었습니다.');
                    // 성공적으로 등록되면 추가적인 로직을 구현할 수 있습니다.
                } else {
                    console.error('댓글 작성 중 오류 발생:', response.statusText);
                }
            })
            .catch(error => console.error('댓글 작성 중 오류 발생:', error));
        }