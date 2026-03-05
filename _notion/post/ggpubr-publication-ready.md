## 1. 包介绍与安装

- **全称**：ggplot2-based publication-ready plots
- **开发者**：Alboukadel Kassambala
- **定位**：ggplot2 的增强包，专为学术/医学/生物数据领域的科研人员，简化绘图和统计
- **安装**：
    
    ```r
    install.packages("ggpubr")
    library(ggpubr)
    library(ggplot2)  # 一起加载
    ```
    

---

## 2. 快速科学绘图函数

### 2.1 快捷函数

- `ggscatter()` — 散点图，自动加回归线、置信区间、相关系数
- `ggboxplot()` — 箱线图，主打分组对比、批量统计标注
- `ggbarplot()` — 条形图，支持分组、均值、误差线等

### 例1：带回归线和相关系数的散点图

```r
ggscatter(mtcars, x = "mpg", y = "disp",
          add = "reg.line", conf.int = TRUE, cor.coef = TRUE)

```

### 例2：分组箱线图+自定义配色

```r
ggboxplot(mtcars, x = "cyl", y = "mpg", fill = "cyl", palette = "npg")

```

---

## 3. 统计分析和显著性标注

### 3.1 添加全局和分组检验

- `stat_compare_means()` — 一行代码加 p 值/星号，无需自己写 test
- 支持 `t.test`、`wilcox.test`、`anova` 等方法

### 例3：箱线图自动标注分组检验结果

```r
ggboxplot(mtcars, x = "cyl", y = "mpg") +
  stat_compare_means(method = "anova") +
  stat_compare_means(comparisons = list(c("4", "6"), c("6", "8")), label = "p.signif")

```

---

## 4. 一键美化：theme_pubr() 和布局

### 4.1 论文级主题

- `theme_pubr()` — 极简、无网格、四边框，自动出版感
- 可调字体大小、边框、图例等

```r
ggboxplot(mtcars, x = "cyl", y = "mpg") +
  theme_pubr(base_size = 14, legend = "right")

```

### 4.2 快速拼版：ggarrange vs patchwork

- `ggarrange()`：适合传统拼版，语法简洁
- 推荐 `patchwork`（更现代、灵活，见专文）

```r
p1 <- ggscatter(mtcars, x = "mpg", y = "disp")
p2 <- ggboxplot(mtcars, x = "cyl", y = "mpg")
ggarrange(p1, p2, ncol = 2, labels = c("A", "B"))

```

---

## 5. 常用出版配色

- palette = "npg"（Nature），"jco"（JCO），"lancet"（Lancet）等
- 适合直接复用期刊级色彩

---

## 6. 实战案例：一图流论文

```r
data <- mtcars
data$cyl <- as.factor(data$cyl)
p <- ggboxplot(data, x = "cyl", y = "mpg", fill = "cyl", palette = "jco") +
     stat_compare_means(method = "anova", label.y = 35) +
     stat_compare_means(comparisons = list(c("4", "6"), c("6", "8"), c("4", "8")),
                        method = "t.test", label = "p.signif", label.y = c(38, 41, 44)) +
     theme_pubr() +
     labs(title = "MPG by Cylinder", x = "Cylinders", y = "Miles per Gallon")
ggsave("mpg_analysis.png", p, width = 6, height = 4, dpi = 300)

```

- **一图集成分组、统计、出版美化，论文通用！**

---

## 7. 资源推荐

- [ggpubr 官方文档](https://rpkgs.datanovia.com/ggpubr/)

---

> 总结：
> 
> 
> ggpubr 让 R 科研绘图一条龙，从美化、分组、统计到导出图片全搞定，是“论文直通车”型包。
> 
> 建议与 patchwork、ggplot2 语法结合，灵活应对各种科研场景。
>
