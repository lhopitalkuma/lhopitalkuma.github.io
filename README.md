# Ruzhuo Xiong · Mechanical Playground — GitHub Pages 版

这是可独立部署的 GitHub Pages 静态版本。保留现有页面、机械动画、明暗主题、图片、视频、演讲 PDF，以及导出时已发布的 2 篇博客和 1 个小说章节。页面使用相对路径，兼容个人主页和仓库子路径。

## 推荐：GitHub Actions 自动部署

1. 在 GitHub 创建仓库。个人主页仓库名称必须是 `你的用户名.github.io`；普通仓库也可以，网址会多一段仓库名。
2. 将本压缩包解压后的全部内容上传到仓库根目录，包括 `.github/workflows/pages.yml`。不要只上传 ZIP，也不要在外面再套一层目录。
3. 默认分支使用 `main`。进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 提交后查看 **Actions → Deploy Mechanical Playground**。成功后在 Settings → Pages 查看实际网址。必要时在 Actions 中手动点 **Run workflow**。

本方案不需要 npm、访问令牌或额外付费服务。Actions 用 Python 标准库生成文章列表后部署 `_site`。GitHub Pages 的具体可用性取决于仓库可见性及你的 GitHub 套餐。

### 使用本地 Git 上传

确保在解压后的目录中打开终端，将下面地址改成自己的新仓库地址：

```bash
git init
git add .
git commit -m "Import Mechanical Playground for GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

已有个人主页仓库时，先备份原站，在其检出目录中合并这些文件并提交。不要直接对已有仓库执行上述新仓库命令。

## 以后如何发博客、上传小说

### 方式一：使用网页 Markdown 编辑器

1. 打开新网站页脚的 **Markdown 编辑器**。
2. 选择博客或小说。小说填写书名、可选卷名、章节序号和章节标题。
3. 写正文或导入 `.md`，预览后点击 **下载待发布 Markdown**。
4. 将下载文件上传到 GitHub 仓库的 `content/blog/` 或 `content/fiction/`，然后提交。
5. Actions 成功后，文章会显示在人文对应分类中。相同书名归为同一部小说，章节按序号排序。

编辑既有导出的文章时，覆盖原来的同名文件，保留 `id`。新建章节请点击“新建文章 / 章节”，每章一个文件。

注意：原来的无 ID 示例博客保存在 `site/writing-base.json`，如需修改该示例，请直接修改这个文件；把它作为新 Markdown 导出会新增一篇文章。

### 方式二：直接上传 Markdown

在文档开头添加元信息。这里只用简单的 `字段: 值` 格式，字符串推荐双引号，不支持复杂 YAML。正文支持现有安全 Markdown 子集：标题、段落、列表、引用、强调、代码与链接；HTML 不执行，暂不支持图片语法和复杂表格。

博客示例：

```markdown
---
title: "我的新随笔"
date: "2026-10-20"
summary: "一句简介"
published: true
---

# 我的新随笔

正文从这里开始。
```

小说章节示例：

```markdown
---
title: "序章：工作台旁"
date: "2026-10-20"
summary: "故事的开始"
novelTitle: "魔导玛星纳"
volume: "第一卷"
chapterNumber: 1
published: true
---

# 序章：工作台旁

正文从这里开始。
```

新文档可以省略 `id`，构建会依据路径生成。`published: false` 不进入公开文章列表；但公开 GitHub 仓库中的草稿源文件仍然公开，不要把私密草稿提交到公开仓库。未发布的原 Sites 云端草稿未包含在此包中，需要先从原后台另行保存。

## 本地查看

安装 Python 3 后，在本目录运行：

```bash
python scripts/build.py
python -m http.server 8000 --directory _site
```

浏览器打开 `http://localhost:8000/`。不要直接双击 HTML，浏览器可能阻止读取文章 JSON。

## 最简单的手动静态部署方式

如果只想先恢复主页，不想配置 Actions，可仅把 `site/` **里面的文件**放入仓库根目录，然后在 Settings → Pages 选择 **Deploy from a branch → main → / (root)**。这个目录已附带当前完整 `writing.json`，能立即阅读。使用此方式后，新增 Markdown 不会自动进入列表；需要在本地运行构建，再用 `_site/` 内的文件替换部署内容。

## 结构

- `site/`：所有页面、脚本、样式和媒体；`writing-base.json` 保存原有演讲和示例文章。
- `content/blog/`、`content/fiction/`：此次导出的已发表 Markdown，后续新增文件也放这里。
- `scripts/build.py`：生成文章列表和 `_site/`。
- `.github/workflows/pages.yml`：提交后自动构建与部署。
- `DEPLOYMENT-SOURCES.md`：部署方式对应的官方文档。

## 与原 Sites 的区别

GitHub Pages 只托管静态内容。这个包没有 Sites 的身份验证、云端数据库、站主登录或直接写入接口。编辑器提供 Markdown 导入、预览和下载；真正发布通过 GitHub 提交完成。包中不含任何凭据、访问令牌或服务器私钥。

导出不会修改或下线原 Sites 网站；本压缩包也尚未上传至你的 GitHub。
