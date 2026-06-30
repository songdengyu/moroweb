# 郑州米罗网络科技有限公司官网

一个面向 Cloudflare Pages 的轻量游戏公司门户网站，包含公司简介、游戏作品、研发能力和联系方式。

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

构建产物会输出到 `dist`，Cloudflare Pages 的部署目录也配置为 `dist`。

## 一键部署到 Cloudflare Pages

首次部署前先登录 Cloudflare：

```bash
npx wrangler login
```

然后运行：

```bash
npm run deploy
```

脚本会先执行 `npm run build`，再执行：

```bash
wrangler pages deploy dist --project-name miro-portal
```

如果要换 Cloudflare 项目名，请同步修改 `package.json` 中的 `deploy` 脚本和 `wrangler.toml` 中的 `name`。

## Cloudflare Pages 控制台配置

如果使用 Git 仓库连接 Cloudflare Pages，可以在控制台里这样设置：

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: 留空，除非你把项目放在仓库子目录
- Environment variables: 当前项目不需要

## 修改网站内容

- Logo 原图与处理后的 PNG 在 `public` 目录。
- 公司介绍、栏目结构在 `index.html`。
- 游戏项目、邮箱地址和表单邮件收件人在 `src/main.js` 顶部。
- 颜色、布局、动效和移动端适配在 `src/styles.css`。

上线前建议替换这些占位信息：

- `business@miro-game.com`
- `0371-0000-0000`
- 游戏项目名称和介绍
- `public/robots.txt` 里的 `Sitemap` 域名
