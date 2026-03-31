const postsDir = 'posts/';

// 文章列表目前使用手动维护
// TODO: 之后将使用c语言完成管理器的编写，自动生成json文件加载
// 新增文章时，只需在这里添加一行即可
// { slug: "文件名不带.md", title: "文章标题", date: "2026-03-30" },
const postManifest = [
  { slug: "2026-03-有关康托尔集的基数", title: "有关康托尔集的基数", date: "2026-03-30" },
  { slug: "test-post", title: "测试文章", date: "2026-03-31" },
];


document.addEventListener('DOMContentLoaded', () => {
  renderPostList();
  document.getElementById('back-button')?.addEventListener('click', showListPage);
});

function renderPostList() {
  const listEl = document.getElementById('post-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  postManifest.forEach(post => {
    const li = document.createElement('li');
    li.className = 'post-item';
    li.innerHTML = `
      <a href="#" data-slug="${post.slug}">${post.title}</a>
      <div class="date">${post.date}</div>
    `;
    listEl.appendChild(li);
  });

  listEl.addEventListener('click', handlePostClick);
}

async function handlePostClick(e) {
  if (e.target.tagName === 'A' && e.target.dataset.slug) {
    e.preventDefault();
    await loadAndShowPost(e.target.dataset.slug);
  }
}

async function loadAndShowPost(slug) {
  const url = `${postsDir}${slug}.md`;
  console.log('正在尝试加载：', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const markdownText = await response.text();
    const htmlContent = marked.parse(markdownText, {
      highlight: (code) => hljs ? hljs.highlightAuto(code).value : code
    });

    document.getElementById('list-page').style.display = 'none';
    document.getElementById('post-page').style.display = 'block';
    document.getElementById('post-content').innerHTML = htmlContent;

  } catch (error) {
    console.error('加载失败:', error);
    alert(`文章加载失败！\n\n路径: ${url}\n错误: ${error.message}\n\n请确认 posts/${slug}.md 文件存在且文件名完全正确。`);
  }
}

function showListPage() {
  document.getElementById('post-page').style.display = 'none';
  document.getElementById('list-page').style.display = 'block';
}