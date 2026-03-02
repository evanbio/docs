### 1️⃣ 默认全局平滑线

```r
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_smooth()
```

- ✅ **不分组**：使用所有数据画出一条总趋势线
- 🟦 线条为默认的蓝色（`color = "steelblue"`）
- ✅ 默认会显示灰色 `se` 置信区间

---

### 2️⃣ 按 group 分组画多条线，但不显色

```r
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_smooth(aes(group = drv))
```

- ✅ **按 `drv` 分组**：每个 `drv` 类别有独立平滑线
- ❌ 未映射颜色 → 所有线条都是默认蓝色，分组无法在视觉上区分
- 🧠 常用于仅逻辑分组而不强调视觉差异

---

### 3️⃣ 按 `drv` 分组 + 上色，但不显示图例

```r
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_smooth(aes(color = drv), show.legend = FALSE)
```

- ✅ 自动分组 + 颜色映射
- 🎨 不同 `drv` 分组的线条有不同颜色
- ❌ `show.legend = FALSE` 会隐藏图例（适合需要简洁视觉的情境）
