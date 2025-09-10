// app.js - YouTube Popular Videos (KR) sample
// IMPORTANT: Replace YOUR_API_KEY_HERE with your actual API key before testing.
// After testing on GitHub Pages, **remove the key and delete/revoke it** in Google Cloud Console.

const API_KEY = "AIzaSyB3_4-RCqSRANb5R6Mcy85IsFjpUSQijRE"; // <-- 여기에 발급받은 API 키를 넣으세요
const API_BASE = "https://www.googleapis.com/youtube/v3";

const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const videosContainer = document.getElementById('videos');
const refreshBtn = document.getElementById('refreshBtn');

function formatNumber(num){
  num = Number(num) || 0;
  if(num >= 100000000) return (num/100000000).toFixed(1) + '억';
  if(num >= 10000) return (num/10000).toFixed(1) + '만';
  if(num >= 1000) return (num/1000).toFixed(1) + '천';
  return String(num);
}

function showError(message){
  loadingElement.style.display = 'none';
  errorElement.style.display = 'block';
  errorElement.textContent = message || '데이터를 불러오지 못했습니다.';
}

function createCard(item, index){
  const thumb = item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '';
  const title = item.snippet.title;
  const channel = item.snippet.channelTitle;
  const views = item.statistics?.viewCount || '';
  const videoId = item.id;

  const div = document.createElement('article');
  div.className = 'video-card';
  div.innerHTML = `
    <img src="${thumb}" alt="${title}">
    <div class="meta">
      <h3>${index + 1}. ${title}</h3>
      <p>${channel}</p>
      <p>조회수 ${formatNumber(views)}회</p>
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">유튜브에서 보기</a>
    </div>
  `;
  return div;
}

async function fetchPopularVideos(){
  // basic check
  if(!API_KEY || API_KEY === "YOUR_API_KEY_HERE"){
    showError('API 키가 설정되어 있지 않습니다. app.js에서 API_KEY를 붙여넣으세요.');
    return;
  }

  loadingElement.style.display = 'block';
  errorElement.style.display = 'none';
  videosContainer.innerHTML = '';

  try{
    // videos.list with chart=mostPopular and statistics included
    const url = `${API_BASE}/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=10&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if(data.error){
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    // render
    data.items.forEach((item, idx) => {
      const card = createCard(item, idx);
      videosContainer.appendChild(card);
    });

  }catch(err){
    console.error(err);
    showError('API 호출 실패: ' + (err.message || err));
  }finally{
    loadingElement.style.display = 'none';
  }
}

refreshBtn && refreshBtn.addEventListener('click', fetchPopularVideos);
window.addEventListener('load', fetchPopularVideos);
