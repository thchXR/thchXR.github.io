const postsDir = 'posts/';           // Markdown 文件存放目录
let allPosts = [];                   // 存储所有文章信息

// 文章列表目前使用手动维护
// TODO: 之后将使用c语言完成管理器的编写，自动生成json文件加载
// 新增文章时，只需在这里添加一行即可
// { slug: "文件名不带.md", title: "文章标题", date: "2026-03-30" },
const postManifest = [
  { slug: "有关康托尔集的基数", title: "有关康托尔集的基数", date: "2026-03-30" },
];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderPostList();
  
  // 返回按钮事件
  document.getElementById('back-button').addEventListener('click', showListPage);
});

// 渲染文章列表
function renderPostList() {
  const listEl = document.getElementById('post-list');
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

  // add click ecent
  listEl.addEventListener('click', handlePostClick);
}

// 点击文章标题
async function handlePostClick(e) {
  if (e.target.tagName === 'A' && e.target.dataset.slug) {
    e.preventDefault();
    const slug = e.target.dataset.slug;
    await loadAndShowPost(slug);
  }
}

// 加载并显示单篇文章
async function loadAndShowPost(slug) {
  try {
    const response = await fetch(`${postsDir}${slug}.md`);
    
    if (!response.ok) {
      throw new Error(`文章加载失败: ${response.status}`);
    }
    
    const markdownText = await response.text();
    
    // use marked to render Markdown
    const htmlContent = marked.parse(markdownText, {
      highlight: function(code, lang) {
        if (hljs) {
          return hljs.highlightAuto(code).value;
        }
        return code;
      }
    });

    // 显示文章页，隐藏列表页
    document.getElementById('list-page').style.display = 'none';
    const postPage = document.getElementById('post-page');
    document.getElementById('post-content').innerHTML = htmlContent;
    postPage.style.display = 'block';
    
  } catch (error) {
    console.error(error);
    alert(`无法加载文章 "${slug}"，请确认文件是否存在于 /posts/ 目录下。\n\n错误信息: ${error.message}`);
  }
}

// 显示列表页
function showListPage() {
  document.getElementById('post-page').style.display = 'none';
  document.getElementById('list-page').style.display = 'block';
}