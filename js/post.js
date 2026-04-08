// js/post.js
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    document.getElementById('article-body').innerHTML = 
      '<p style="color:red; text-align:center;">错误：缺少文章标识符 (slug)</p>';
    return;
  }

  // 从 postManifest 中找到对应文章（postManifest 在 load.js 中定义）
  const post = window.postManifest?.find(p => p.slug === slug);

  if (!post) {
    document.getElementById('article-body').innerHTML = 
      `<p style="color:red; text-align:center;">错误：未找到文章 "${slug}"</p>`;
    return;
  }

  // 设置标题
  document.getElementById('page-title').textContent = `${post.title} - thchXRs Blog`;
  document.getElementById('article-title').textContent = post.title;

  // 设置元数据
  document.getElementById('post-meta').innerHTML = `
    <time>${post.date}</time>
  `;

  // 加载并渲染 Markdown
  await loadMarkdownPost(slug);
  
  // 返回按钮
  document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});

// 复用你原来的加载逻辑（稍作调整）
async function loadMarkdownPost(slug) {
  const url = `posts/${slug}.md`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    let markdownText = await response.text();

    // 移除 YAML front matter
    markdownText = markdownText.replace(/^\s*---\s*\n([\s\S]*?)\s*---\s*\n/, '');

    // 处理 KaTeX 兼容性（你原来的处理）
    markdownText = markdownText.replace(/(\$\$[\s\S]*?\$\$)/g, (match) => {
      return match.replace(/\\\\/g, '\\\\');
    });

    // 渲染 Markdown
    const htmlContent = marked.parse(markdownText, {
      mangle: false,
      headerIds: false,
      smartypants: false,
      breaks: false,
      highlight: (code) => hljs ? hljs.highlightAuto(code).value : code
    });

    document.getElementById('article-body').innerHTML = htmlContent;

    // KaTeX 渲染
    const articleBody = document.getElementById('article-body');
    if (typeof renderMathInElement !== 'undefined') {
      renderMathInElement(articleBody, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false,
        errorColor: "#cc0000",
        strict: "warn",
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\CC": "\\mathcal{C}"
        }
      });
    }

    // 代码高亮
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('#article-body pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }

  } catch (error) {
    console.error('加载文章失败:', error);
    document.getElementById('article-body').innerHTML = 
      `<p style="color:red;">加载文章失败<br>${error.message}</p>`;
  }
}