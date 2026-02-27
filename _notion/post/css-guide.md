> CSS (Cascading Style Sheets，层叠样式表) 是一种样式表语言，用于描述 HTML 或 XML 文件中元素的表现形式。CSS 决定网页的外观与布局，是前端开发的核心技术之一。通过 CSS，可以使同一网页在不同设备和屏幕尺寸下保持美观和一致性。
> 

---

## 1. 主要功能

1. **样式与美化**
    - 控制颜色（文本、背景、边框）
    - 设置字体（类型、大小、样式、行高等）
    - 排版（对齐方式、间距、缩进）
2. **布局控制**
    - **盒模型**：`margin`、`padding`、`border` 定义元素间距与结构
    - **布局模型**：`Flexbox`、`Grid` 灵活控制排列
    - **定位**：相对定位、绝对定位、固定定位
3. **响应式设计**
    - **媒体查询**：根据设备宽度/高度/方向应用不同样式
    - **流式布局**：自动调整比例，适配不同屏幕
4. **动画与过渡**
    - **过渡 (transition)**：实现平滑的样式变化
    - **动画 (animation)**：通过 `@keyframes` 定义复杂交互效果

---

## 2. 基本语法结构

CSS 由 **选择器** 与 **声明块** 构成：

```css
p {
  color: blue;        /* 文本颜色 */
  font-size: 16px;    /* 字体大小 */
  margin: 10px;       /* 外边距 */
}

```

- **选择器**：指定目标元素（如 `p`）
- **声明块**：由属性和值组成，控制样式

---

## 3. 常见选择器

- **标签选择器**：`h1 { color: red; }`
- **类选择器**：`.header { font-size: 24px; }`
- **ID 选择器**：`#main { background-color: yellow; }`
- **组合选择器**：`h1, p { margin: 20px; }` 或 `div p { color: green; }`

---

## 4. 层叠性与继承性

- **层叠性**：当多个规则作用于同一元素时，遵循优先级：
    
    浏览器默认 < 外部样式表 < 内联样式；选择器优先级：ID > 类 > 标签。
    
- **继承性**：某些属性（如字体、颜色）会从父元素继承到子元素。

```css
body {
  font-family: Arial, sans-serif;
}

```

---

## 5. 常用属性

- **颜色与背景**
    
    ```css
    color: red;
    background-color: lightblue;
    
    ```
    
- **文本与字体**
    
    ```css
    font-size: 18px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    
    ```
    
- **盒模型**
    
    ```css
    padding: 10px;
    margin: 15px;
    border: 1px solid black;
    
    ```
    
- **布局**
    
    ```css
    display: flex;
    justify-content: center;
    
    ```
    

---

## 6. 响应式设计示例

```css
/* 默认样式 */
body {
  font-size: 16px;
}

/* 移动端适配 */
@media screen and (max-width: 600px) {
  body {
    font-size: 12px;
  }
}

```

---

## 7. CSS 与 HTML 的关系

HTML 定义网页的 **内容与结构**，CSS 决定其 **样式与表现**。

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css"> <!-- 外部 CSS 文件 -->
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to my website.</p>
</body>
</html>

```

---

## 8. 总结

- CSS 是控制网页样式的语言，为 HTML 内容添加颜色、布局、动画等效果。
- 借助 **选择器、层叠性与继承性**，开发者能灵活控制页面样式。
- 配合 HTML、JavaScript，CSS 构成 Web 前端开发三大核心。
