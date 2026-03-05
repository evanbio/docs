> 简介
> 
> 
> [`ggthemr`](https://github.com/Mikata-Project/ggthemr) 是一个为 `ggplot2` 提供**主题和调色板**的 R 包，可以加载预设风格，也能自定义任意色板，轻松为所有图表统一“皮肤”。
> 

---

## 1. 安装与加载

```r
# 从 GitHub 安装
remotes::install_github("Mikata-Project/ggthemr")

# 加载
library(ggthemr)
```

---

## 2. 应用预设主题

```r
# 常用 “dust” 主题
ggthemr("dust")

# 恢复到 ggplot2 默认主题
ggthemr_reset()
```

- 预设主题包括 `"fresh"`、`"pale"`、`"flat"`、`"dust"` 等十余种。

---

## 3. 自定义色板

```r
# 随机挑选 10 种非白色
set.seed(12345)
random_colours <- sample(colors()[-c(1,253,361)], 10)

# 定义自己的调色板
ugly <- define_palette(
  swatch   = random_colours,
  gradient = c(lower = random_colours[1], upper = random_colours[2])
)

# 应用自定义调色板
ggthemr(ugly)

```

- `swatch`：离散色板
- `gradient`：数值映射时使用的渐变色

---

## 4. 示例对比

```r
# 先切换到“fresh”主题
ggthemr("fresh")

# 绘制示例图
p1 <- ggplot(mtcars, aes(wt, mpg)) +
  geom_point(size = 3) +
  ggtitle("Example: fresh theme")

p2 <- ggplot(mtcars, aes(wt, hp, color = factor(cyl))) +
  geom_point(size = 3) +
  ggtitle("Example: fresh + discrete colours")

# 显示
print(p1)
print(p2)

# 恢复默认主题
ggthemr_reset()

```

---

## 5. 主题速查

| 主题名 | 说明 |
| --- | --- |
| `ggthemr("fresh")` | 清新配色 |
| `ggthemr("dust")` | 淡雅灰尘感 |
| `ggthemr("pale")` | 柔和浅色 |
| `ggthemr("flat")` | 扁平化风格 |
| `ggthemr_reset()` | 恢复 ggplot2 默认 |

---

> 小结
> 
> - `ggthemr` 不仅提供多种**预设主题**，还能通过 `define_palette()` **自由定义色板**；
> - 一旦设置，后续所有 `ggplot2` 绘图都会自动套用该主题；
> - 完成图形后别忘了用 `ggthemr_reset()` 恢复默认，避免影响其他可视化。
