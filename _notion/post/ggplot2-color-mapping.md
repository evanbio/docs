## 🎯 问题：`color = "blue"` 放在 `aes()` 里会发生什么？

在 `ggplot2` 中，`aes()`（aesthetic mapping）用于**数据映射**，而非固定样式设置。

如果我们把 `color = "blue"` 放在 `aes()` 内，会出现一些意想不到的情况。

---

### 🚫 错误示例：固定颜色放进 `aes()`

```r
# ❌ 错误写法
library(ggplot2)

ggplot(mpg) +
  geom_point(aes(x = displ, y = hwy, color = "blue"))

```

🔍 **结果**：

- 点的颜色**不会**变成蓝色。
- `"blue"` 会被当作一个分组变量进行映射。
- 出现一个名为 `"blue"` 的图例项，但颜色来自默认调色板，而非真正的蓝色。

---

### ✅ 正确示例：固定颜色放在 `aes()` 外

```r
# ✅ 正确写法
ggplot(mpg) +
  geom_point(aes(x = displ, y = hwy), color = "blue")

```

🔍 **结果**：

- 所有点都会变成**固定的蓝色**。
- 不会生成图例。
- `color = "blue"` 作为样式设定直接传递给 `geom_point()`。

💡 **口诀**：

> 数据映射放 aes() 里，样式设定放外头！
> 

---

### 📦 进阶示例：多属性固定设置

```r
ggplot(mpg) +
  geom_point(aes(displ, hwy),
             color = "darkblue",
             size = 3,
             shape = 16)

```

- 固定颜色、大小、形状
- 不生成图例

---

### 🔧 推荐模板：分组与样式分离

```r
ggplot(df, aes(x, y, color = group)) +
  geom_point(size = 3, shape = 21, fill = "white")

```

- `color = group` → 分组映射（生成图例）
- `fill = "white"` → 固定内部颜色（适用于 shape 21–25）
- `shape = 21–25` → 支持双配色（`color` 外框 + `fill` 内部）

---

### 📌 总结

- **错误原因**：`aes()` 里只能做数据映射，不能直接设置固定样式。
- **正确方法**：固定样式参数放在 `aes()` 外部。
- 记住**分组映射 vs 样式设定**的区别，能避免很多 ggplot2 绘图错误。
