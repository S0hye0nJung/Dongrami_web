document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.content-text a');

    // localStorage에서 클릭 수 초기화
    links.forEach(link => {
        const id = link.getAttribute('id');
        const clickCount = localStorage.getItem(id) || 0;
        link.dataset.clickCount = clickCount;
    });

    // 클릭 수에 따라 링크를 정렬하는 함수
    const sortLinks = () => {
        const sortedLinks = Array.from(links).sort((a, b) => {
            return b.dataset.clickCount - a.dataset.clickCount;
        });
        const container = document.querySelector('.content-text');
        container.innerHTML = '';
        sortedLinks.forEach(link => container.appendChild(link));
    };

    // 클릭 수를 증가시키는 이벤트 리스너
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // 링크의 기본 동작 방지
            const id = link.getAttribute('id');
            let clickCount = localStorage.getItem(id) || 0;
            clickCount++;
            localStorage.setItem(id, clickCount);
            link.dataset.clickCount = clickCount;

            // 클릭 후 링크 정렬
            sortLinks();
        });
    });

    // 초기 정렬
    sortLinks();
});

/*
document.querySelectorAll('a[data-click-count]').forEach(function(element) {
    element.addEventListener('click', function(event) {
        event.preventDefault();

        const subcategoryId = this.id.replace('link', ''); // id가 "link1", "link2" 등이라고 가정
        const url = `/api/subcategories/${subcategoryId}/increment`;

        fetch(url, {
            method: 'POST',
        }).then(response => {
            if (response.ok) {
                let clickCount = parseInt(this.getAttribute('data-click-count')) + 1;
                this.setAttribute('data-click-count', clickCount);
                console.log('Click count updated successfully');
            } else {
                console.error('Failed to update click count');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }); 
});*/