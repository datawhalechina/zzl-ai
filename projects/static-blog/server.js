const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

// 处理博客文章请求
app.get('/posts/:post', (req, res) => {
    const postName = req.params.post;
    const filePath = path.join(__dirname, 'dist', `${postName}.html`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('文章未找到');
    }

    res.sendFile(filePath);
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器已启动：http://localhost:${port}`);
});
