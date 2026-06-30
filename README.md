# 郑州米罗网络科技有限公司官网

一个面向 Cloudflare Workers 静态资源部署的轻量游戏公司门户网站。

## 本地运行

```bash
npm install
npm run dev
```

默认本地地址为 `http://127.0.0.1:5173`。

## 生产构建

```bash
npm run build
```

构建产物会输出到 `dist`。

## Cloudflare 部署

当前项目使用 Workers 静态资源部署：

```bash
npm run deploy
```

对应命令为：

```bash
wrangler deploy --assets=./dist
```

`wrangler.toml` 中的项目名为 `moroweb`，静态资源目录为 `./dist`。

## 内容位置

- 页面结构：`index.html`
- 游戏信息和邮箱：`src/main.js`
- 浅色视觉样式：`src/styles.css`
- Logo 和游戏图：`public`

当前商务邮箱：

```txt
mirokejicompany@gmail.com
```
