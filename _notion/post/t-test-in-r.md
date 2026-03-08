### 1. 背景与简介

在日常科研、医学分析或数据挖掘中，我们经常会遇到这样的问题：

> 两组数据之间的均值差异是否具有统计学意义？
> 

例如：

- 比较两种治疗方式对患者某项指标的影响
- 比较药物干预前后血压的变化
- 比较不同组之间的基因表达水平是否有显著差异

在这类场景中，**t 检验（t-test）** 是最经典也最常用的方法之一。

t 检验由英国统计学家 **William Sealy Gosset**（笔名 Student）于 1908 年提出，旨在解决小样本条件下的均值推断问题。当总体标准差未知、样本较小、数据近似服从正态分布时，t 检验提供了一种合理的统计推断方式。

在 R 语言中，我们可以使用内置函数 `t.test()` 快速执行各类 t 检验，也可结合 `ggpubr`、`rstatix` 等 tidyverse 风格的包完成更加整洁、可视化的统计分析。

---

### 2. t 检验的类型

| 类型 | 适用场景 |
| --- | --- |
| **单样本 t 检验** | 比较一个样本均值是否与某个理论值有差异 |
| **独立样本 t 检验** | 比较两个独立组之间的均值差异 |
| **配对样本 t 检验** | 比较同一样本在两个时间点或条件下的均值（如干预前后） |

---

### 3. 使用前提

在进行 t 检验之前，应确认以下假设条件是否成立：

- 数据是**连续型变量**（interval 或 ratio 类型）
- 数据**近似服从正态分布**（可以使用 `shapiro.test()` 检查）
- **样本之间独立**（独立样本）或**一一对应**（配对样本）
- 若为**独立样本 t 检验**，默认使用 Welch 检验（方差不齐）；若假设方差齐，可加 `var.equal = TRUE`

---

### 4. R 中执行 t 检验

### 4.1 示例数据

```r
group_a <- c(5.1, 4.9, 5.0, 5.3, 5.2)
group_b <- c(5.5, 5.6, 5.4, 5.8, 5.7)

```

### 4.2 独立样本 t 检验

```r
# 默认 Welch 检验（方差不等）
t.test(group_a, group_b)

# 若认为两组方差齐，可添加 var.equal = TRUE
t.test(group_a, group_b, var.equal = TRUE)

```

### 4.3 配对样本 t 检验

```r
before <- c(120, 130, 125, 140, 135)
after  <- c(118, 128, 127, 138, 132)

t.test(before, after, paired = TRUE)

```

### 4.4 单样本 t 检验

```r
# 检验 group_a 的均值是否等于 5.0
t.test(group_a, mu = 5.0)

```

---

4.5 使用 rstatix 进行 t 检验（推荐 tidyverse 风格）

```r
library(rstatix)
library(dplyr)

# 构造数据框
df <- data.frame(
  value = c(group_a, group_b),
  group = rep(c("A", "B"), each = 5)
)

# 独立样本 t 检验
df %>%
  t_test(value ~ group) %>%
  add_significance()
```

---

### 5. 基于内置数据集的完整 t 检验示例

本节将基于 R 的内置数据集 `ToothGrowth`，展示一个标准的独立样本 t 检验流程，涵盖：

- 数据加载与预处理
- 使用 `rstatix` 进行 t 检验
- 提取关键信息
- 可视化结果（`ggpubr`）
- 保存统计分析结果

---

### 5.1 数据集简介

`ToothGrowth` 是 R 自带的数据集，记录了维生素 C 对豚鼠牙齿长度的影响，包含以下变量：

| 变量 | 含义 |
| --- | --- |
| `len` | 牙齿增长长度 |
| `supp` | 给药方式（VC：维生素 C、OJ：橙汁） |
| `dose` | 剂量（数值型：0.5、1、2） |

使用 `glimpse()` 查看结构：

```r
library(dplyr)

# 查看数据结构
glimpse(ToothGrowth)

Rows: 60
Columns: 3
$ len  <dbl> 4.2, 11.5, 7.3, 5.8, 6.4, 10.0, 11.2, 11.2, 5.2, 7.0, 16.5, 16.5, 15…
$ supp <fct> VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, VC, …
$ dose <dbl> 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0…
```

我们将从中筛选出 **剂量为 0.5** 的数据，比较 VC 与 OJ 两种给药方式在该剂量下的效果差异。

---

### 5.2 数据预处理

```r
library(dplyr)

# 加载数据集并筛选 dose = 0.5
df <- ToothGrowth %>%
  filter(dose == 0.5) %>%
  mutate(supp = factor(supp))  # 确保分组变量是因子类型

```

---

### 5.3 进行独立样本 t 检验

```r
library(rstatix)

# 执行 t 检验（Welch 方法）
ttest_result <- df %>%
  t_test(len ~ supp) %>%
  add_significance()

```

查看结果：

```r
ttest_result

# A tibble: 1 × 9
  .y.   group1 group2    n1    n2 statistic    df       p p.signif
  <chr> <chr>  <chr>  <int> <int>     <dbl> <dbl>   <dbl> <chr>   
1 len   OJ     VC        10    10      3.17  15.0 0.00636 **     
```

---

### 5.4 提取关键信息

```r
# 提取 p 值与显著性符号
ttest_result %>%
  select(statistic, df, p, p.signif)
  
# A tibble: 1 × 4
  statistic    df       p p.signif
      <dbl> <dbl>   <dbl> <chr>   
1      3.17  15.0 0.00636 **  

```

你也可以访问 `ttest_result$p`、`ttest_result$p.signif` 等字段作为后续报告输入。

---

### 5.5 可视化结果（添加显著性标注）

```r
library(ggpubr)

ggboxplot(df, x = "supp", y = "len", color = "supp", add = "jitter") +
  stat_compare_means(
    method = "t.test",
    comparisons = list(c("OJ", "VC")),
    label.y = 22,                # 根据你的数据调整高度
    label.x.npc = "center"       # 👈 让标注居中
  ) +
  labs(
    title = "ToothGrowth: Dose = 0.5",
    x = "Supplement",
    y = "Tooth Length"
  )

```

该图会自动标注 p 值，并展示两组差异的显著性。

---

### 5.6 保存分析结果

```r
# 保存为 CSV 文件
write.csv(ttest_result, "ttest_result.csv", row.names = FALSE)

# 保存为 RDS（推荐用于后续复用）
saveRDS(ttest_result, "ttest_result.rds")
```

---

### 5.7 小结

通过 `ToothGrowth` 数据集的实战演示，我们完成了一个标准的独立样本 t 检验流程：

- 使用 `glimpse()` 快速了解数据结构
- 筛选指定子集并处理分组变量
- 通过 `rstatix::t_test()` 完成统计检验并提取结果
- 使用 `ggpubr` 进行可视化并居中展示显著性差异
- 最后将分析结果保存为 `.csv` 和 `.rds` 以便复用

这一流程非常适合作为日常科研或项目数据分析中的**可复用模板**。 

---

### 6. 延伸建议

为了进一步扩展分析能力，建议考虑以下方向：

- **多组比较（ANOVA）**：当处理组数量 ≥ 3 时，使用 `anova_test()` 替代 t 检验，并结合事后检验（如 Tukey HSD）
- **配对样本分析**：若同一对象在两个条件下重复测量，可使用 `t.test(..., paired = TRUE)` 或 `rstatix::t_test(..., paired = TRUE)`
- **非参数检验**：当正态性假设不满足时，可使用 `wilcox_test()` 替代
- **多重检验校正**：若有多组比较，使用 `adjust_pvalue()` 方法进行 p 值校正（如 FDR、Bonferroni）
- **报告整合**：可将分析结果和图表整合到 R Markdown / Quarto / Logbook 报告中，便于输出归档

---

### 7. 总结

`t 检验` 是统计分析中最常用、最基础但也最实用的差异检验工具之一。掌握其原理的同时，构建一套清晰、标准化的分析流程至关重要。

在本篇笔记中，我们通过：

- 回顾基本理论与使用前提
- 学习基础用法（`t.test()`）与 tidyverse 风格（`rstatix`）
- 结合实际数据完成一个标准流程（数据探索 → t 检验 → 可视化 → 保存结果）
