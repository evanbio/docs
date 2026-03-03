### ❌ `geom_smooth()` 中 `shape` 不起作用？

在 `geom_smooth()` 这样的**线图层**中，`shape` 参数是无效的 —— 因为 shape 只作用于“点”的图层，例如 `geom_point()`、`geom_jitter()`。

---

### 📉 错误示例：shape 不生效

```r
ggplot(mpg, aes(x = displ, y = hwy, shape = drv)) +
  geom_smooth()

```

- ❌ 图中没有任何不同的“形状”显示
- ❌ 即使 `shape` 是映射变量，也不会影响线条样式

---

### ✅ 正确方式：使用 `linetype` 来区分线

```r
ggplot(mpg, aes(x = displ, y = hwy, linetype = drv)) +
  geom_smooth()

```

- ✅ `linetype` 能让不同分组的线条变为实线、虚线、点划线等
- ✅ 默认最多支持 6 种线型，更多可用 `scale_linetype_manual()` 扩展

---

### ✅ 推荐组合示范

```r
ggplot(mpg, aes(displ, hwy, color = drv)) +
  geom_point(aes(shape = drv)) +
  geom_smooth(aes(linetype = drv), se = FALSE)

```

- 点图用 **shape** 分组
- 平滑线用 **linetype** 分组
- 样式分离，更清晰可读
