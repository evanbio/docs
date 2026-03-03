## 🌳 背景

在 `ggplot2` 中，当使用 `geom_point()` 并通过 `aes(shape = group)` 按分组绘制散点时，**默认只支持 6 种可变的点形状**（`shape` 映射到分组变量）。

如果分组数超过 6，`ggplot2` 会：

- **循环使用形状**（导致重复）
- **弹出警告**：`The shape palette can deal with a maximum of 6 discrete values`

---

### 🚫 限制原因

`ggplot2` 的默认 shape 设计中：

- 可映射的形状代码：`0` ~ `25`（共 26 个符号）
- 其中 **0~14** 可用填充色（`fill` + `color`）
- **15~25** 仅使用边框色（`color`）
- 当 shape 用于分组映射时，默认只挑选 **6 个最常用的形状**（`16, 17, 15, 3, 7, 8`）

---

### ✅ 解决方案

### 方法 1：手动指定 `scale_shape_manual()`

```r
library(ggplot2)

df <- data.frame(
  x = rep(1:5, 4),
  y = rnorm(20),
  group = rep(letters[1:10], each = 2)
)

ggplot(df, aes(x, y, shape = group)) +
  geom_point(size = 3) +
  scale_shape_manual(values = c(0:9)) +
  theme_minimal()

```

- 使用 `values` 指定所需的 shape 代码，最多支持 26 种。
- 缺点：需要手动列出 shape 序列。

---

### 方法 2：改用 `color` 或 `fill` 分组

如果分组数多，可以考虑用颜色区分：

```r
ggplot(df, aes(x, y, color = group)) +
  geom_point(size = 3) +
  theme_minimal()

```

- 颜色支持的离散值远超 6 个。

---

### 方法 3：组合映射（shape + color）

```r
ggplot(df, aes(x, y, shape = group, color = group)) +
  geom_point(size = 3) +
  scale_shape_manual(values = 0:9) +
  theme_minimal()

```

- 同时映射形状与颜色，便于区分更多类别。

---

### 💡 总结

- `ggplot2` 默认 shape 映射限制是 **6 个分组**，超出需手动指定。
- 可用 `scale_shape_manual()` 扩展到 26 种形状。
- 分组过多时建议结合颜色，提升可读性。
