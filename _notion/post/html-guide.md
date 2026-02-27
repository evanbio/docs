> HTML (HyperText Markup Language) 是一种标记语言，用于定义网页内容和结构。它通过预定义的标签描述网页的文本、图像、链接、表单和多媒体，是构建网页和 Web 应用的基础。
> 

---

## 1. 基本信息

- **文件扩展名**：`.html`
- **用途**：构建网页内容与结构，配合 CSS 和 JavaScript 构成完整的前端页面

---

## 2. 语法规则

### 2.1 预定义标签

HTML 使用一套预定义的标签来表示网页元素：

```html
<h1>This is a heading</h1>
<p>This is a paragraph.</p>
<a href="https://www.example.com">This is a link</a>

```

---

### 2.2 语法宽松

- **闭合标签**：多数标签需闭合，如 `<p></p>`；部分为自闭合，如 `<img />`
- **大小写不敏感**：`<html>` 与 `<HTML>` 都有效，但推荐小写
- **可选结束标签**：某些标签（如 `<li>`、`<p>`）的结束标签可省略，浏览器会自动补全

---

### 2.3 嵌入媒体

支持图片、音频、视频：

```html
<img src="image.jpg" alt="Description of image">
<video controls>
  <source src="movie.mp4" type="video/mp4">
</video>

```

---

### 2.4 超链接与表单

- 超链接：`<a>` 用于页面跳转
- 表单：`<form>` 用于用户输入与交互

---

### 2.5 结构化与语义化

HTML5 引入语义化标签，增强页面可读性和可维护性：

- `<header>`：页眉
- `<footer>`：页脚
- `<article>`：文章块
- `<section>`：内容区块

---

## 3. 示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Webpage</title>
</head>
<body>
  <h1>Welcome to my webpage</h1>
  <p>This is a sample HTML document.</p>
  <a href="https://www.example.com">Visit Example</a>
</body>
</html>

```

---

## 4. 优缺点

**优点**

- 简单易学，快速构建网页内容
- 与 CSS、JavaScript 结合，可增强页面样式与交互
- 容错性强，浏览器能解析不完全符合标准的文档

**缺点**

- 结构化较弱，样式与内容常混合
- 不适合复杂数据存储或传输（与 XML、JSON 相比）

---

## 5. 常见应用

- **网页开发**：静态页面与动态应用的骨架
- **Web 应用程序前端**：配合 CSS/JS 构建交互式体验
- **文档展示**：作为在线说明书、博客、可视化展示的基础
