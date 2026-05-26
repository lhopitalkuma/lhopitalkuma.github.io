---
title: "Gwyn, Lord of Cinder — LilyPond 乐谱"
excerpt: |
  用 LilyPond + Frescobaldi 编写并导出乐谱与 MIDI。爆肝8小时的制作历程。
order: 3
collection: portfolio
---

<div style="display:flex; gap:1rem; align-items:flex-start;">
  <img src="/files/portfolio/soul5.gif" alt="Soul five" style="max-width:300px; width:100%; height:auto;">
  
  <img src="/files/portfolio/gwyn.jpg" alt="Gwyn cover" style="max-width:300px; width:100%; height:auto;">

  <img src="/files/portfolio/leftbow.gif" alt="Soul five" style="max-width:300px; width:100%; height:auto;">
</div>

<!-- 本地大视频已注释，使用 B 站 iframe 占位以便本地构建预览 -->
<!--
<video width="100%" height="auto" controls style="max-width:800px; margin-top:1rem;">
  <source src="/files/portfolio/Gwyn%20lord%20of%20cinder.mp4" type="video/mp4">
  您的浏览器不支持 video 标签。
</video>
-->

<!-- 占位 B 站播放器：已替换为你提供的 BV 链接 -->
<iframe src="https://player.bilibili.com/player.html?bvid=BV18XSjBREqF&page=2" width="100%" height="450" frameborder="0" scrolling="no" allowfullscreen style="max-width:800px; margin-top:1rem;"></iframe>

这是我使用 LilyPond（一个类似 LaTeX 的文本乐谱排版语言）和 Frescobaldi 编辑器完成的作品。整个过程花了我 8 小时：学习语法、调试编译错误、不断迭代修改，最终导出高质量的 PDF 乐谱与可播放的 MIDI 文件。

关于 LilyPond

- LilyPond（荷花池）是一个追求传统乐谱排版美学的自由软件，属于 GNU Project。
- 使用文本标记语言描述乐谱，然后编译生成 PDF（印刷级乐谱）和 MIDI（可播放）文件，体验类似写 LaTeX 的流程。

编辑器：Frescobaldi

- 使用 Frescobaldi 编辑 LilyPond 代码，它能高亮语法、管理工程并调用编译器生成输出。

制作心得

纯手搓，全白键，光明磊落
爆肝8小时（包括学习这门代码语言），与神奇的编译特性和唯有英文一翻译还崩溃的官方学习文档斗智斗勇。（嘻嘻，我一定要写完啊）不断报错不断修改，何尝不是三百六十五里路呢。所以，前有薪王，敬请见证！

如果你想尝试：

- 下载 Frescobaldi 并安装 LilyPond 编译器。
- 在编辑器中打开 `.ly` 文件，编译生成 PDF/MIDI。


