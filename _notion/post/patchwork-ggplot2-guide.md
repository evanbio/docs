## 简介

在数据分析和科研绘图中，**ggplot2** 已经是事实标准。但面对多图拼接（比如论文、报告中的多 Panel 图），很多人第一反应是 `gridExtra`、`cowplot` 或复杂的 `grid` 语法。其实，现在你完全可以用 [patchwork](https://patchwork.data-imaginist.com/) 这个轻量强大的包，**更优雅、更现代地拼接 ggplot2 图形**！

---

## patchwork 能做什么？

- **轻松组合多个 ggplot2 图表**（横排/竖排/网格/自定义布局）
- 支持复杂布局、嵌套拼接、添加注释
- 完全兼容 ggplot2，不需要额外学习新语法
- 极易复用，适合科研和数据分析工作流

---

## 安装

```r
install.packages("patchwork")
# 或者 Github 开发版
# remotes::install_github("thomasp85/patchwork")
```

---

## 核心语法：像拼积木一样“+”号组合

### 最简单例子

```r
library(ggplot2)
library(patchwork)

p1 <- ggplot(mtcars, aes(mpg, disp)) + geom_point()
p2 <- ggplot(mtcars, aes(hp, wt)) + geom_point()

# 横向拼接
p1 + p2

# 纵向拼接
p1 / p2

```

### 更复杂的布局

```r
(p1 + p2) / p1              # 两图横排在上一行，p1 单独占一行
(p1 | p2) / p1              # 等价写法，| 是横排，/ 是竖排
(p1 + p2 + p1) + plot_layout(ncol = 2)    # 三图两列自适应
```

`|` 号就是"横着拼"，`/` 号就是"竖着拼"！

---

## 进阶用法

### 1. 添加标题、标签

```r
(p1 + p2) +
  plot_annotation(title = "MTCars Multi-panel Plot",
                 subtitle = "使用patchwork拼接")

```

### 2. 为每个panel加字母

```r
(p1 + p2) +
  plot_annotation(tag_levels = 'A')

```

### 3. 灵活布局（`plot_layout`）

```r
(p1 + p2 + p1) + plot_layout(ncol = 2, heights = c(1, 2))
```

---

## 和 cowplot/gridExtra 有什么区别？

- **语法更现代，兼容性更好，patchwork 支持 ggplot2 的所有新特性**
- 不需要复杂的 grob 操作，直接“加号”操作即可
- 支持嵌套与自定义组合，适合更复杂的科研绘图

---

## 推荐场景

- 论文和报告的多 Panel 图（Figure 1A、1B、1C…）
- 各种探索性数据分析需要多个结果一起展示时
- 任何你觉得“要把几个 ggplot 放一张图里”的需求！

---

## 参考资料

- [官方文档](https://patchwork.data-imaginist.com/)
- [ggplot2 官方教程](https://ggplot2.tidyverse.org/)
