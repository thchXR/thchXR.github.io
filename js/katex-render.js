// 用于自动渲染页面中的 LaTeX 公式（兼容行内和块级公式）

document.addEventListener('DOMContentLoaded', function() {
    // 确保 KaTeX 和 auto-render 已加载
    if (typeof renderMathInElement === 'undefined') {
        console.warn('KaTeX auto-render not loaded yet.');
        return;
    }

    renderMathInElement(document.body, {
        // 支持的公式分隔符（推荐配置）
        delimiters: [
            { left: "$$",  right: "$$",  display: true },   // 块级公式
            { left: "$",   right: "$",   display: false },  // 行内公式
            { left: "\\(", right: "\\)", display: false },  // 行内公式（推荐）
            { left: "\\[", right: "\\]", display: true }    // 块级公式（推荐）
        ],
        
        // 其他常用选项
        throwOnError: false,        // 公式错误时不抛出异常（防止页面崩溃）
        errorColor: "#cc0000",      // 错误时显示的红色
        strict: "warn",             // 严格模式（warn / ignore / error）
        
        // 可选：忽略某些标签里的公式（防止代码块等被错误渲染）
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        ignoredClasses: ["katex-ignore", "no-katex"]
    });

    console.log('KaTeX 公式渲染完成');
});