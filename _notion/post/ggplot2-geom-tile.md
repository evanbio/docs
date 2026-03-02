`geom_tile()` 是 `ggplot2` 用于绘制**二维块图（tile）**的函数，通常搭配 `fill` 映射使用，用来表达一个变量在二维网格中的强度（如表达量、频数、打分等）。

---

### ✅ 基本语法

```r
geom_tile(mapping = NULL, color = NA, fill = NULL, ...)

```

| 参数 | 说明 |
| --- | --- |
| `x`, `y` | 瓷砖的中心位置 |
| `fill` | 填充色（通常映射数值） |
| `color` | 边框颜色（默认 `NA` 不显示边框） |
| `width` | 瓷砖宽度（默认自动） |
| `height` | 瓷砖高度（默认自动） |

---

### 📦 示例数据（伪热图）

```r
library(ggplot2)
library(dplyr)

df <- expand.grid(
  sample = LETTERS[1:5],
  gene = paste0("G", 1:5)
) %>%
  mutate(expr = runif(n(), 0, 10))  # 模拟表达量

```

---

### 💡 示例 1：基础热图

```r
ggplot(df, aes(x = gene, y = sample, fill = expr)) +
  geom_tile()

```

✅ 按表达量 `expr` 用颜色填充，构成 `gene × sample` 的热图网格。

---

### 💡 示例 2：添加边框 + 自定义调色

```r
ggplot(df, aes(gene, sample, fill = expr)) +
  geom_tile(color = "white") +
  scale_fill_gradient(low = "white", high = "red") +
  theme_minimal()

```

---

### 💡 示例 3：顺序控制（防止字符自动排序）

```r
df <- df %>%
  mutate(
    gene = factor(gene, levels = paste0("G", 1:5)),
    sample = factor(sample, levels = rev(LETTERS[1:5]))
  )

ggplot(df, aes(gene, sample, fill = expr)) +
  geom_tile()

```

---

### 💡 示例 4：在 tile 上叠加数值标签

```r
ggplot(df, aes(gene, sample, fill = expr)) +
  geom_tile() +
  geom_text(aes(label = round(expr, 1)), color = "black")

```
