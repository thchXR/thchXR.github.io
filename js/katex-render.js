// 用于自动渲染页面中的 LaTeX 公式（兼容行内和块级公式）

document.addEventListener('DOMContentLoaded', function() {
    // 确保 KaTeX 和 auto-render 已加载
    if (typeof renderMathInElement === 'undefined') {
        console.warn('KaTeX auto-render not loaded yet.');
        return;
    }

    renderMathInElement(document.body, {
        delimiters: [
            { left: "$$",  right: "$$",  display: true },
            { left: "$",   right: "$",   display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false,
        errorColor: "#cc0000",
        strict: "warn",// 严格模式（warn / ignore / error）
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        ignoredClasses: ["katex-ignore", "no-katex"]
    });

    console.log('KaTeX 公式渲染完成');
});