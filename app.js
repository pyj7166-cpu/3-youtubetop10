// YouTube Data API 설정
const API_KEY = "AIzaSyB3_4-RCqSRANb5R6Mcy85IsFjpUSQijRE";
const API_BASE_URL = "https://www.googleapis.com/youtube/v3";

// DOM 요소
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const videosContainer = document.getElementById('videos');
const refreshBtn = document.getElementById('refreshBtn');

// 숫자를 한국어 형식으로 변환하는 함수
function formatNumber(num) {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '억';
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + '천';
    }
    return num.toString();
}

// 영상 카드 HTML 생성
function createVideoCard(video, index) {
    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url;
    const videoId = video.id;
    const title = video.snippet.title;
    const channel = video.snippet.channelTitle;
    const views = video.statistics?.viewCount || "조회수 없음";

    return `
        <div class="video-card">
            <div class="rank">${index + 1}</div>
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                <img src="${thumbnailUrl}" alt="${title}">
            </a>
            <h3>${title}</h3>
            <p class="channel">${channel}</p>
            <p class="views">조회수 ${formatNumber(views)}회</p>
        </div>
    `;
}

// 인기 영상 불러오기
async function fetchPopularVideos() {
    loadingElement.style.display = "block";
    errorElement.style.display = "none";
    videosContainer.innerHTML = "";

    try {
        const response = await fetch(
            `${API_BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=10&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        data.items.forEach((video, index) => {
            videosContainer.innerHTML += createVideoCard(video, index);
        });

    } catch (error) {
        console.error(error);
        errorElement.style.display = "block";
        errorElement.textContent = "⚠️ 데이터를 불러올 수 없습니다: " + error.message;
    } finally {
        loadingElement.style.display = "none";
    }
}

// 이벤트 리스너
document.addEventListener("DOMContentLoaded", fetchPopularVideos);
refreshBtn.addEventListener("click", fetchPopularVideos);
