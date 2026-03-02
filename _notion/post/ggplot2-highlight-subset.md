在 `ggplot2` 中，可以通过**多个 `geom_point()` 图层**实现高亮特定数据子集，比如标出异常值、特定分类或关注群体。

---

### ✅ 基本结构

```r
ggplot(data, aes(x, y)) +
  geom_point() +  # 1. 绘制完整数据
  geom_point(data = subset1, color = "red") +  # 2. 子集上色
  geom_point(data = subset1, shape = 1, size = 3, color = "red")  # 3. 子集外圈高亮

```

- **第一层**：绘制完整数据
- **第二层**：绘制目标子集，改变颜色
- **第三层**：为目标子集添加外圈，进一步强调

---

### 🧪 实战示例：突出 `"2seater"` 类别

```r
library(ggplot2)
library(dplyr)

ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_point(
    data = filter(mpg, class == "2seater"),
    color = "red"
  ) +
  geom_point(
    data = filter(mpg, class == "2seater"),
    shape = 1,           # 空心圆
    size = 3,
    color = "red"
  )
```

- **`filter()`** 筛选目标类别
- **外圈高亮**让目标点更明显
- 这种方法对异常值标记、特定群体分析非常有用
