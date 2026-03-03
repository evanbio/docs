## 1. 什么是 ANOVA？

**ANOVA（Analysis of Variance，方差分析）** 是一种用于比较多个组之间均值差异的统计方法。

它的核心思想是：

> 将数据的总变异分解为“组间变异”和“组内变异”，并比较两者的相对大小。
> 

如果组间变异远大于组内变异，说明组别之间的均值可能存在显著差异。

---

## 2. ANOVA 的基本类型

1. **单因素方差分析（One-way ANOVA）**
    - 仅有一个分类自变量（factor）。
    - 例如：比较三种药物对血压的影响。
2. **双因素方差分析（Two-way ANOVA）**
    - 有两个分类自变量，可检测交互作用。
    - 例如：药物类型 × 性别 对血压的影响。
3. **重复测量方差分析（Repeated Measures ANOVA）**
    - 同一组对象在不同时间或条件下多次测量。
4. **协方差分析（ANCOVA）**
    - 在 ANOVA 中引入一个或多个协变量（连续型变量），控制其影响。

---

## 3. 假设前提

在使用 ANOVA 前，需要检查以下假设：

1. **正态性**：每组数据近似服从正态分布（可用 Shapiro-Wilk 检验）。
2. **方差齐性**：各组数据的方差相等（可用 Levene’s test 检验）。
3. **独立性**：各观测值之间相互独立。

---

## 4. 统计原理

ANOVA 使用 **F 统计量**：

$$F = \frac{\text{组间均方}}{\text{组内均方}}$$

- **组间均方（MSB）**：反映组均值之间的差异。
- **组内均方（MSW）**：反映组内个体之间的差异。

当 F 值足够大，且 p 值 < 显著性水平（如 0.05）时，拒绝原假设（组均值相等）。

---

## 5. R 语言实现

### 5.1 模拟数据

```r
set.seed(123)
df <- data.frame(
  group = rep(c("A", "B", "C"), each = 10),
  value = c(rnorm(10, 5, 1),
            rnorm(10, 6, 1),
            rnorm(10, 7, 1))
)
head(df)

```

---

### 5.2 检查假设

```r
# 正态性
by(df$value, df$group, shapiro.test)

# 方差齐性
library(car)
leveneTest(value ~ group, data = df)

```

---

### 5.3 单因素方差分析

```r
fit <- aov(value ~ group, data = df)
summary(fit)

```

---

### 5.4 多重比较（事后检验）

如果 ANOVA 显著，需要事后检验：

```r
TukeyHSD(fit)

```

---

### 5.5 可视化结果

```r
library(ggplot2)
ggplot(df, aes(x = group, y = value, fill = group)) +
  geom_boxplot() +
  theme_minimal() +
  labs(title = "组间均值比较（ANOVA）", y = "值", x = "组别")

```

---

## 6. 结果解释

1. **ANOVA 表**（`summary(fit)` 输出）
    - `Pr(>F)` 即 p 值，小于显著性水平（如 0.05）则认为至少有两组存在显著差异。
2. **Tukey 事后检验**
    - 显示各组间两两比较的 p 值及置信区间。
3. **可视化**
    - 箱线图、均值 ± 置信区间图等可以直观展示差异。

---

## 7. 进阶：双因素 ANOVA

```r
# 模拟数据
df2 <- data.frame(
  drug = rep(c("A", "B"), each = 12),
  gender = rep(c("M", "F"), times = 12),
  value = rnorm(24, 10, 2)
)

fit2 <- aov(value ~ drug * gender, data = df2)
summary(fit2)

```

- 输出中 `drug:gender` 项表示交互作用效应。

---

## 8. 小结

- ANOVA 适合用于**均值比较**，比多次 t 检验更稳健（避免多重比较问题）。
- 必须在**正态性**和**方差齐性**假设基本满足的情况下使用。
- 如果假设不满足，可以考虑：
    - 非参数检验（Kruskal-Wallis）
    - 方差不齐时用 Welch ANOVA
