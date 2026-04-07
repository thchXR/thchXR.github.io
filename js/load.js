const postsDir = 'posts/';

// 文章列表目前使用手动维护
// TODO: 之后将使用c语言完成管理器的编写，自动生成json文件加载
// 新增文章时，只需在这里添加一行即可
// { slug: "文件名不带.md", title: "文章标题", date: "2026-03-30" },
const postManifest = [
  { slug: "2026-04-donut.c的原理", title: "donut.c的原理", date: "2026-04-06" },
  { slug: "2026-04-有关康托尔集的基数", title: "有关康托尔集的基数", date: "2026-04-01" },
];


document.addEventListener('DOMContentLoaded', () => {
  renderPostList();
  document.getElementById('back-button')?.addEventListener('click', showListPage);
  
  initKaTeX();
});

function initKaTeX() {
  if (typeof renderMathInElement === 'undefined') {
    console.warn('KaTeX auto-render 尚未加载，等待 100ms 后重试...');
    setTimeout(initKaTeX, 100);
    return;
  }

  const options = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false,
    errorColor: "#cc0000",
    strict: "warn",
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    ignoredClasses: ["katex-ignore", "no-katex"]
  };

  // 全局渲染（列表页可能不需要，但无害）
  renderMathInElement(document.body, options);
  console.log('KaTeX 全局渲染完成');
}

// 渲染列表
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
// 处理点击事件
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
    let markdownText = await response.text();
    // let 定义以便修改
    // 移除 YAML 
    markdownText = markdownText.replace(/^\s*---\s*\n([\s\S]*?)\s*---\s*\n/, '');

    const htmlContent = marked.parse(markdownText, {
      highlight: (code) => hljs ? hljs.highlightAuto(code).value : code
    });

    document.getElementById('list-page').style.display = 'none';
    document.getElementById('post-page').style.display = 'block';
    document.getElementById('post-content').innerHTML = htmlContent;

    setTimeout(() => {
      if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.getElementById('post-content'), {
          delimiters: [
            { left: "$$",  right: "$$",  display: true },
            { left: "$",   right: "$",   display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
        console.log('文章内 KaTeX 重新渲染完成');
      }
    }, 50);

  } catch (error) {
    console.error('加载失败:', error);
    alert(`文章加载失败！\n\n路径: ${url}\n错误: ${error.message}`);
  }
}

function showListPage() {
  document.getElementById('post-page').style.display = 'none';
  document.getElementById('list-page').style.display = 'block';
}