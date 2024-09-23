const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

const postsDir = path.join(__dirname, 'src', 'posts');
const templatePath = path.join(__dirname, 'src', 'templates', 'template.html');
const outputDir = path.join(__dirname, 'dist');

// 读取模板文件
const template = fs.readFileSync(templatePath, 'utf-8');

// 读取所有 Markdown 文件
const files = fs.readdirSync(postsDir);

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const htmlContent = marked.parse(markdown);

    // 获取文件名（不包含扩展名）
    const fileName = path.basename(file, path.extname(file));

    // 使用模板生成 HTML
    const html = template
        .replace('{{title}}', fileName)
        .replace('{{content}}', htmlContent);

    // 输出生成的 HTML 文件
    fs.outputFileSync(path.join(outputDir, `${fileName}.html`), html);
});

console.log('博客生成完毕！');
