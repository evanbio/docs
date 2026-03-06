> theme_pubr() 是 ggpubr 包专为学术出版、报告展示优化的 ggplot2 主题，特点是简洁、完整边框、无网格、默认字体适中，能一键生成专业感极强的图表。
> 

---

## 一、核心特色

- **极简风格**：去除背景和网格，仅保留轴和边框。
- **四边完整黑色边框**：期刊论文最常用的科学风格。
- **默认字体适合阅读/打印**，整体美观。
- **适配论文/报告，适合与 patchwork 多图排版结合。**

---

## 二、安装与快速入门

```r
install.packages("ggpubr")
library(ggplot2)
library(ggpubr)

p <- ggplot(mtcars, aes(mpg, disp)) +
     geom_point() +
     theme_pubr()

print(p)
```

---

## 三、与 patchwork 搭配多图排版

```r
library(patchwork)
p1 <- ggplot(mtcars, aes(mpg, disp)) + geom_point() + ggtitle("MPG vs Disp")
p2 <- ggplot(mtcars, aes(mpg, wt)) + geom_point() + ggtitle("MPG vs Weight")

# 横排多图 + 标题 + 子图标记
(p1 | p2) +
  plot_annotation(title = "汽车性能分析", tag_levels = "A") &
  theme_pubr()

```

- 一行代码让所有图表一体化美观，适合论文多 panel 图、数据可视化 dashboard！

---

## 四、自定义参数和细节微调

```r
ggplot(mtcars, aes(mpg, disp)) +
  geom_point() +
  theme_pubr(base_size = 14,   # 字体
             border = TRUE)    # 是否显示完整边框（默认已开）

```

- `base_size` 控字体（默认 12，可调 10~16）
- `border` 控边框（科学图表建议开启）

---

## 五、论文/出版级输出建议

- **导出高分辨率图片：**
    
    ```r
    ggsave("plot_pubr.tiff", p, width = 5, height = 4, dpi = 300)
    
    ```
    
- **黑白配色**：可用 `scale_color_grey()`、`scale_fill_grey()`
- **字体自定义**：如需 Arial/Times, 可叠加 `theme(text = element_text(family = "Arial"))`

---

## 六、典型多图组合案例

```r
p3 <- ggplot(mtcars, aes(hp)) + geom_histogram()

layout <- (p1 | p2) / p3
layout +
  plot_annotation(
    title = "汽车数据集分析",
    subtitle = "基于 mtcars",
    tag_levels = "A"
  ) &
  theme_pubr(base_size = 12)

```

---

## 七、参考资源

- [ggpubr::theme_pubr 官方文档](https://rpkgs.datanovia.com/ggpubr/reference/theme_pubr.html)
- [patchwork 多图拼接教程](https://patchwork.data-imaginist.com/)
- [ggplot2 官方手册](https://ggplot2.tidyverse.org/)

---

> 总结：
> 
> 
> 如果你想让 R 绘图“一秒专业”，论文/报告多图布局快速成稿，`theme_pubr()` + `patchwork` 是最优解之一。遇到特殊排版需求，叠加 `theme()` 灵活调整即可。
>
